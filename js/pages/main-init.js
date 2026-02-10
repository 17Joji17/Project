
import { LoadTime } from './../components/LoadTime.js';
import { MenuHighlighter } from './../components/MenuHighlighter.js';

const { useState, useEffect } = React;

// function MainApp() {
//     return (
//         <React.Fragment>
//             <MenuHighlighter />
//             <LoadTime />
//         </React.Fragment>
//     );  
// }


function initReactOnPage() {
    const footer = document.querySelector('footer');
    if (footer && !footer.querySelector('#load-time')) {
        const loadTimeContainer = document.createElement('div');
        loadTimeContainer.id = 'load-time-container';
        footer.appendChild(loadTimeContainer);
        
        const root = ReactDOM.createRoot(loadTimeContainer);
        root.render(React.createElement(LoadTime));
    }
    

    const menuHighlighterContainer = document.createElement('div');
    menuHighlighterContainer.id = 'menu-highlighter-container';
    document.body.appendChild(menuHighlighterContainer);
    
    const root2 = ReactDOM.createRoot(menuHighlighterContainer);
    root2.render(React.createElement(MenuHighlighter));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReactOnPage);
} else {
    initReactOnPage();
}