export function MenuHighlighter() {
    React.useEffect(() => {
        const highlightActiveMenu = () => {
            const currentPath = window.location.pathname;
            const menuLinks = document.querySelectorAll('nav a');
            
            menuLinks.forEach(link => {
                const linkPath = new URL(link.href, window.location.origin).pathname;
                
                if (linkPath === currentPath || 
                    (currentPath.endsWith('/') && linkPath.endsWith('/index.html'))) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        };
        
        highlightActiveMenu();
        
        window.addEventListener('popstate', highlightActiveMenu);
        
        return () => {
            window.removeEventListener('popstate', highlightActiveMenu);
        };
    }, []);
    
    return null;
}