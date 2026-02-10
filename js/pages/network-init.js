const { useState, useEffect } = React;

const API = 'https://jsonplaceholder.typicode.com/photos';
const DUMMY_IMAGE_BASE = 'https://dummyimage.com';
const MAX_ITEMS = 12;

function getRandomColor() {
    const colors = [
        '8B4513', 'A0522D', 'CD853F', 'D2691E', 'B8860B', 'DAA520',
        'F4A460', 'DEB887', 'BC8F8F', 'F5DEB3', 'FFF8DC', 'FFEBCD'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function createDummyImageUrl(width = 300, height = 200) {
    const color = getRandomColor();
    const textColor = 'FFFFFF';
    const text = 'BREAD';
    return `${DUMMY_IMAGE_BASE}/${width}x${height}/${color}/${textColor}&text=${text}`;
}

function Card({ item }) {
    return React.createElement(
        'div',
        { className: 'card' },
        React.createElement('img', {
            src: createDummyImageUrl(300, 200),
            alt: item.title || 'Изображение хлеба',
            className: 'card-thumb',
            loading: 'lazy'
        }),
        React.createElement(
            'div',
            { className: 'card-body' },
            React.createElement(
                'h3',
                { className: 'card-title' },
                item.title ? item.title.slice(0, 40) + '...' : 'Вкусный хлеб'
            )
        )
    );
}

function NetworkCards() {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('Загрузка данных...');
    const [albumId, setAlbumId] = useState(null);
    
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    
    const loadData = async () => {
        setLoading(true);
        setError(null);
        setCards([]);
        setStatus('Загрузка данных...');
        
        try {
            const randomAlbumId = rnd(1, 100);
            setAlbumId(randomAlbumId);
            
            const response = await fetch(`${API}?albumId=${randomAlbumId}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Ресурс не найден (404)');
                } else if (response.status >= 500) {
                    throw new Error('Ошибка сервера');
                } else {
                    throw new Error(`HTTP ошибка: ${response.status}`);
                }
            }
            
            const data = await response.json();
            
            if (!data || data.length === 0) {
                throw new Error('Нет данных для отображения');
            }
            
            const items = data.slice(0, MAX_ITEMS);
            setCards(items);
            setStatus(`Загружено ${items.length} карточек (albumId=${randomAlbumId})`);
            
        } catch (err) {
            console.error('Ошибка загрузки:', err);
            
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                setError('Проблемы с интернет-соединением');
            } else {
                setError(err.message);
            }
            
            setStatus('Ошибка загрузки');
            
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        loadData();
    }, []);
    

    const loadButton = React.createElement(
        'button',
        {
            id: 'load-btn',
            onClick: loadData,
            disabled: loading,
            className: 'load-button'
        },
        loading ? 'Загрузка...' : 'Загрузить новые карточки'
    );
    
    const statusText = React.createElement(
        'p',
        { id: 'status', className: 'status-text' },
        status
    );
    
    const albumIdText = albumId 
        ? React.createElement(
            'p',
            { className: 'album-id' },
            'Album ID: ' + albumId
        )
        : null;
    
    const statusContainer = React.createElement(
        'div',
        { className: 'status-container' },
        statusText,
        albumIdText
    );
    
    const controls = React.createElement(
        'div',
        { className: 'controls' },
        loadButton,
        statusContainer
    );
    
    const errorBox = error 
        ? React.createElement(
            'div',
            { id: 'error', className: 'error-box' },
            React.createElement('strong', null, 'Ошибка: '),
            error
        )
        : null;
    
    const spinner = React.createElement('div', { className: 'spinner' });
    const loaderText = React.createElement('p', null, 'Загружаем карточки...');
    const loader = React.createElement(
        'div',
        { 
            className: `loader ${loading ? 'loading' : 'hidden'}`,
            id: 'loader'
        },
        spinner,
        loaderText
    );
    
    const cardsElements = cards.map((item, index) =>
        React.createElement(Card, { key: index, item: item })
    );
    
    const cardsGrid = React.createElement(
        'div',
        { id: 'cards', className: 'cards-grid' },
        cardsElements
    );
    
    return React.createElement(
        'div',
        { className: 'network-app' },
        controls,
        errorBox,
        loader,
        cardsGrid
    );
}

if (document.getElementById('cards') || document.getElementById('load-btn')) {
    const oldContainer = document.querySelector('.network-container') || 
                         document.getElementById('cards')?.parentNode ||
                         document.querySelector('main') ||
                         document.body;
    
    if (oldContainer) {
        const reactRoot = document.createElement('div');
        reactRoot.id = 'network-react-root';
        
        oldContainer.innerHTML = '';
        oldContainer.appendChild(reactRoot);
        
        ReactDOM.render(
            React.createElement(NetworkCards),
            reactRoot
        );
    }
}