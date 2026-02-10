export const storage = {
    getFeedbackList: () => {
        const data = localStorage.getItem('feedbackList');
        return data ? JSON.parse(data) : [];
    },
    
    saveFeedback: (feedback) => {
        const list = storage.getFeedbackList();
        list.push(feedback);
        localStorage.setItem('feedbackList', JSON.stringify(list));
    },
    
    updateFeedback: (id, newComment) => {
        const list = storage.getFeedbackList();
        const index = list.findIndex(f => f.id === id);
        if (index !== -1) {
            list[index].comment = newComment;
            localStorage.setItem('feedbackList', JSON.stringify(list));
        }
    },
    
    removeFeedback: (id) => {
        const list = storage.getFeedbackList();
        const filteredList = list.filter(f => f.id !== id);
        localStorage.setItem('feedbackList', JSON.stringify(filteredList));
    }
};