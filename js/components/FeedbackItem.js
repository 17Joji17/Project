export function FeedbackItem({ feedback, onEdit, onDelete }) {
    const [isEditing, setIsEditing] = React.useState(false);
    const [editedComment, setEditedComment] = React.useState(feedback.comment);
    
    const handleEdit = () => {
        setIsEditing(true);
    };
    
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
        { 
            className: 'feedback-item', 
            'data-id': feedback.id 
        },
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