import React, {useState, useEffect} from 'react';
import './App.css';
import Modal from './Modal';
import Item from './Item';
import Header from './Header';
import useEvent from "./hooks/useEvent";

const electron = window.require('electron');
const {ipcRenderer} = electron;

function App() {

    const [items, setItems] = useState(JSON.parse(localStorage.getItem('readIt-items')) || []);
    const [filteredItems, setFilterItems] = useState([]);
    const [hasFilter, setHasFilter] = useState(false);
    const [selectedItem,setSelectedItem] = useState(null)
    const [showModal, toggleModalDisplay] = useState(false);
    const [enableModal, toggleModalAppearance] = useState(true);
    const itemsSource = hasFilter ? [...filteredItems] : [...items];

    const keyDownHandler = (e) =>{
        const selectedItemIndex = itemsSource.findIndex(item=>item.url===selectedItem);
        if(e.key==="ArrowUp" && itemsSource[selectedItemIndex-1]){
            setSelectedItem(itemsSource[selectedItemIndex-1].url);
        }
        else if(e.key==="ArrowDown" && itemsSource[selectedItemIndex+1]){
            setSelectedItem(itemsSource[selectedItemIndex+1].url);
        }
    };

    useState(() => {
        ipcRenderer.on('new-item-success', (e, newItem) => {
            toggleModalDisplay(false);
            toggleModalAppearance(true);
            setItems(prevArray => [...prevArray, newItem]);
        })
    }, []);

    useEffect(() => {
        saveItems(items)
    }, [items])

    useEvent('keydown',keyDownHandler);

    return (
        <div className="app">
            <Header showModal={toggleModalDisplay}
                    searchItem={title => searchItem(title, itemsSource, setFilterItems, setHasFilter)}/>
            <div className={'main'}>
                {itemsSource.length ?
                    itemsSource.map((item, index) => <Item key={index} item={item} isSelected={selectedItem===item.url} setSelected={setSelectedItem}/>)
                    : <p className={'no-items'}>No Items</p>}
                {showModal && <Modal enabled={enableModal} showModal={toggleModalDisplay}
                                     addItem={(url) => addItem(url, toggleModalAppearance)}/>}
            </div>
        </div>
    );
}

const searchItem = (title, items, setFilterItems, setHasFilter) => {
    const filteredItems = items.filter(item => item.title.toLowerCase().includes(title));
    setFilterItems(filteredItems);
    !!title ? setHasFilter(true) : setHasFilter(false);
}

const saveItems = items => {
    localStorage.setItem('readIt-items', JSON.stringify(items))
}

const addItem = (url, toggleModalAppearance) => {
    toggleModalAppearance(false);
    ipcRenderer.send('new-item', url);
}

export default App;
