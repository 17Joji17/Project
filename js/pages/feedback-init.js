const { useState, useEffect } = React;

function FeedbackItem({ feedback, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState(feedback.comment);
    
    const handleEdit = () => setIsEditing(true);
    const handleSave = () => {
        if (editedComment.trim() !== '') {
            onEdit(feedback.id, editedComment.trim());
            setIsEditing(false);
        }
    };
    const handleCancel = () => {
        setEditedComment(feedback.comment);
        setIsEditing(false);
    };
    const handleDelete = () => {
        if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
            onDelete(feedback.id);
        }
    };
    
    return React.createElement(
        'div',
        { className: 'feedback-item', 'data-id': feedback.id },
        React.createElement(
            'div',
            { className: 'feedback-header' },
            React.createElement(
                'strong',
                { className: 'feedback-name' },
                feedback.name
            ),
            React.createElement(
                'div',
                { className: 'feedback-actions' },
                React.createElement(
                    'button',
                    {
                        className: 'edit-btn',
                        onClick: handleEdit,
                        title: 'Редактировать'
                    },
                    '✏️'
                ),
                React.createElement(
                    'button',
                    {
                        className: 'delete-btn',
                        onClick: handleDelete,
                        title: 'Удалить'
                    },
                    '🗑️'
                )
            )
        ),
        isEditing
            ? React.createElement(
                'div',
                { className: 'feedback-edit' },
                React.createElement(
                    'textarea',
                    {
                        value: editedComment,
                        onChange: (e) => setEditedComment(e.target.value),
                        rows: 3,
                        className: 'edit-textarea'
                    }
                ),
                React.createElement(
                    'div',
                    { className: 'edit-actions' },
                    React.createElement(
                        'button',
                        {
                            onClick: handleSave,
                            className: 'save-btn'
                        },
                        'Сохранить'
                    ),
                    React.createElement(
                        'button',
                        {
                            onClick: handleCancel,
                            className: 'cancel-btn'
                        },
                        'Отмена'
                    )
                )
            )
            : React.createElement(
                'p',
                { className: 'feedback-text' },
                feedback.comment
            )
    );
}

function FeedbackApp() {
    const [feedbackList, setFeedbackList] = useState([]);
    const [formData, setFormData] = useState({ name: '', comment: '' });
    
    useEffect(() => {
        const saved = localStorage.getItem('feedbackList');
        if (saved) {
            setFeedbackList(JSON.parse(saved));
        }
    }, []);
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.comment.trim()) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
        
        const newFeedback = {
            id: Date.now(),
            name: formData.name.trim(),
            comment: formData.comment.trim()
        };
        
        const updatedList = [...feedbackList, newFeedback];
        localStorage.setItem('feedbackList', JSON.stringify(updatedList));
        
        setFeedbackList(updatedList);
        setFormData({ name: '', comment: '' });
    };
    
    const handleEditFeedback = (id, newComment) => {
        const updatedList = feedbackList.map(feedback =>
            feedback.id === id ? { ...feedback, comment: newComment } : feedback
        );
        localStorage.setItem('feedbackList', JSON.stringify(updatedList));
        setFeedbackList(updatedList);
    };
    
    const handleDeleteFeedback = (id) => {
        const updatedList = feedbackList.filter(feedback => feedback.id !== id);
        localStorage.setItem('feedbackList', JSON.stringify(updatedList));
        setFeedbackList(updatedList);
    };
    
    const nameInput = React.createElement(
        'input',
        {
            type: 'text',
            id: 'name',
            name: 'name',
            value: formData.name,
            onChange: handleInputChange,
            required: true,
            placeholder: 'Ваше имя'
        }
    );
    
    const nameLabel = React.createElement('label', { htmlFor: 'name' }, 'Имя:');
    const nameGroup = React.createElement('div', { className: 'form-group' }, nameLabel, nameInput);
    
    const commentTextarea = React.createElement(
        'textarea',
        {
            id: 'comment',
            name: 'comment',
            value: formData.comment,
            onChange: handleInputChange,
            required: true,
            rows: 4,
            placeholder: 'Ваш отзыв...'
        }
    );
    
    const commentLabel = React.createElement('label', { htmlFor: 'comment' }, 'Отзыв:');
    const commentGroup = React.createElement('div', { className: 'form-group' }, commentLabel, commentTextarea);
    
    const submitButton = React.createElement(
        'button',
        { type: 'submit', className: 'submit-btn' },
        'Добавить отзыв'
    );
    
    const form = React.createElement(
        'form',
        { id: 'feedback-form', onSubmit: handleSubmit },
        nameGroup,
        commentGroup,
        submitButton
    );
    
    let feedbackContent;
    if (feedbackList.length === 0) {
        feedbackContent = React.createElement(
            'p',
            { className: 'no-feedback' },
            'Отзывов пока нет. Будьте первым!'
        );
    } else {
        feedbackContent = feedbackList.map(feedback =>
            React.createElement(FeedbackItem, {
                key: feedback.id,
                feedback: feedback,
                onEdit: handleEditFeedback,
                onDelete: handleDeleteFeedback
            })
        );
    }
    
    const listTitle = React.createElement(
        'h3',
        null,
        'Список отзывов (' + feedbackList.length + ')'
    );
    
    const feedbackContainer = React.createElement(
        'div',
        { id: 'feedback-container', className: 'feedback-list' },
        listTitle,
        feedbackContent
    );
    
    const title = React.createElement('h2', null, 'Форма обратной связи');
    
    return React.createElement(
        'div',
        { className: 'feedback-app' },
        title,
        form,
        feedbackContainer
    );
}

if (document.getElementById('feedback-form') || document.querySelector('form')) {
    const oldForm = document.getElementById('feedback-form') || document.querySelector('form');
    
    if (oldForm) {
        const reactContainer = document.createElement('div');
        reactContainer.id = 'feedback-react-root';
        oldForm.parentNode.replaceChild(reactContainer, oldForm);
        
        ReactDOM.render(React.createElement(FeedbackApp), reactContainer);
    }
}