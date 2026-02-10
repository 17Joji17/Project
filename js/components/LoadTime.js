
export function LoadTime() {
    const [loadTime, setLoadTime] = React.useState(null);
    
    React.useEffect(() => {
        const time = (performance.now() / 1000).toFixed(2);
        setLoadTime(time);
    }, []);

    console.log(loadTime);
    
    if (!loadTime) return null;
    
    return React.createElement('p', {
        id: 'load-time'
    }, `Время загрузки страницы: ${loadTime} с`);

}