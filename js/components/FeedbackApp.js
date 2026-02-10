import { FeedbackItem } from './../components/FeedbackItem.js';
import { storage } from './../utils/localStorage.js';

export function FeedbackApp() {
    const [feedbackList, setFeedbackList] = React.useState(storage.getFeedbackList());
    const [formData, setFormData] = React.useState({ name: '', comment: '' });
    
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
        
        storage.saveFeedback(newFeedback);
        setFeedbackList(prev => [...prev, newFeedback]);
        setFormData({ name: '', comment: '' });
    };
    
    const handleEditFeedback = (id, newComment) => {
        storage.updateFeedback(id, newComment);
        setFeedbackList(prev => prev.map(feedback =>
            feedback.id === id ? { ...feedback, comment: newComment } : feedback
        ));
    };
    
    const handleDeleteFeedback = (id) => {
        storage.removeFeedback(id);
        setFeedbackList(prev => prev.filter(feedback => feedback.id !== id));
    };
    
    const createInput = (type, id, name, value, placeholder, required) => 
        React.createElement('input', {
            type: type,
            id: id,
            name: name,
            value: value,
            onChange: handleInputChange,
            placeholder: placeholder,
            required: required
        });
    
    const createTextarea = (id, name, value, rows, placeholder, required) =>
        React.createElement('textarea', {
            id: id,
            name: name,
            value: value,
            onChange: handleInputChange,
            rows: rows,
            placeholder: placeholder,
            required: required
        });
    
    const createLabel = (htmlFor, text) =>
        React.createElement('label', { htmlFor: htmlFor }, text);
    
    const createButton = (type, className, onClick, text) =>
        React.createElement('button', { type: type, className: className, onClick: onClick }, text);
    
    const createDiv = (className, ...children) =>
        React.createElement('div', { className: className }, ...children);
    
    const title = React.createElement('h2', null, 'Форма обратной связи (React)');
    
    const nameField = createInput('text', 'name', 'name', formData.name, 'Ваше имя', true);
    const nameLabel = createLabel('name', 'Имя:');
    const nameGroup = createDiv('form-group', nameLabel, nameField);
    
    const commentField = createTextarea('comment', 'comment', formData.comment, 4, 'Ваш отзыв...', true);
    const commentLabel = createLabel('comment', 'Отзыв:');
    const commentGroup = createDiv('form-group', commentLabel, commentField);
    
    const submitBtn = createButton('submit', 'submit-btn', null, 'Добавить отзыв');
    const form = React.createElement('form', { id: 'feedback-form', onSubmit: handleSubmit }, nameGroup, commentGroup, submitBtn);
    
    let feedbackContent;
    if (feedbackList.length === 0) {
        feedbackContent = React.createElement('p', { className: 'no-feedback' }, 'Отзывов пока нет. Будьте первым!');
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
    
    const listTitle = React.createElement('h3', null, 'Список отзывов (' + feedbackList.length + ')');
    const listContainer = createDiv('feedback-list', listTitle, feedbackContent);
    const feedbackDiv = React.createElement('div', { id: 'feedback-container', className: 'feedback-list' }, listContainer);
    
    return React.createElement('div', { className: 'feedback-app' }, title, form, feedbackDiv);
}