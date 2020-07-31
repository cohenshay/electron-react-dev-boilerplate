import React, {useState, useEffect, useRef} from 'react'
import './App.css'
import Modal from './Modal'
import Item from './Item'
import Header from './Header'
import useEvent from './hooks/useEvent'
import './menu';
import fs from "fs";


const electron = window.require('electron');
const {shell} = electron;
const {ipcRenderer} = electron;
//Button 'Done' JS parsed to string
let reader
fs.readFile(`./src/reader.js`, (err, data) => {
    reader = data.toString()
})

function App() {

    const itemsFromStorage = JSON.parse(localStorage.getItem('readIt-items')) || [];

    const [items, setItems] = useState(itemsFromStorage)
    //Item after search condition
    const [filteredItems, setFilterItems] = useState([])
    //Show all items or after search condition
    const [hasFilter, setHasFilter] = useState(false)
    //Adding css
    const [selectedItem, setSelectedItem] = useState(
        !!itemsFromStorage[0] ? itemsFromStorage[0].url : null)
    //Display modal on/off
    const [showModal, toggleModalDisplay] = useState(false)
    //Modal button disabled
    const [enableModal, toggleModalAppearance] = useState(true)
    const itemsSource = hasFilter ? [...filteredItems] : [...items]

    const refToSearch = useRef(null);

    //Select the next item
    const keyDownHandler = (e) => {
        const selectedItemIndex = itemsSource.findIndex(
            item => item.url === selectedItem)
        if (e.key === 'ArrowUp' && itemsSource[selectedItemIndex - 1]) {
            setSelectedItem(itemsSource[selectedItemIndex - 1].url)
        } else if (e.key === 'ArrowDown' && itemsSource[selectedItemIndex + 1]) {
            setSelectedItem(itemsSource[selectedItemIndex + 1].url)
        }
    }
    //Gets a message from item window
    const messageHandler = e => {
        const {action} = e.data
        switch (action) {
            case 'delete-item': {

                removeItem();
                //Close window
                e.source.close()
                break;
            }
            default:
                return
        }
    }

    const removeItem = () => {
        //Remove from list
        const removedItem = items.filter(item => item.url !== selectedItem)
        setItems(removedItem)

        //Set new selectedItem
        if (removedItem.length) {
            const itemIndex = items.findIndex(item => item.url === selectedItem)
            const newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex - 1
            setSelectedItem(removedItem[newSelectedItemIndex])
        }
    }

    const openItemNative = (item) => {
        shell.openExternal(item)
    }

    //Open the item in new window and inject 'Done' button that close and remove the item
    const openItem = (url) => {

        //Open item url with nodeIntegration=false since we don't want to let malicious scripts on this site access to file system
        let readerWin = window.open(url, '',
            `maxWidth=2000,maxHeight=2000,width=1200,height=800,backgroundColor=#DEDEDE,nodeIntegration=0,contextIsolation=1`)

        //Inject button JS
        readerWin.eval(reader)
    }

    const searchItem = (title) => {
        const filteredItems = items.filter(
            item => item.title.toLowerCase().includes(title));

        setFilterItems(filteredItems);

        !!title ? setHasFilter(true) : setHasFilter(false)
    }

    const addItem = (url) => {
        toggleModalAppearance(false)

        //Send item to main process in order to capture the screen
        ipcRenderer.send('new-item', url)
    }

    useEffect(() => {
        ipcRenderer.on('new-item-success', (e, newItem) => {
            //Close modal
            toggleModalDisplay(false)

            //Enable modal button for next time open
            toggleModalAppearance(true)

            //Add new item to the list
            setItems(prevArray => [...prevArray, newItem])
        });

        //Creates a function on global window (which is shared between all renderer processes) in order to create new item by menu.
        window.newItem = () => {
            toggleModalDisplay(true)
        }

        window.deleteItem = removeItem;

        // Focus to search items
        window.searchItems = () => {
            refToSearch.current.focus();
        };

    }, []);

    useEffect(() => {
        //Ref to open item in order to open item from menu
        window.openItem = () => openItem(selectedItem)
        window.openItemNative = () => openItemNative(selectedItem)
    }, [selectedItem])

    //Save items to local storage after change
    useEffect(() => {
        saveItems(items)
        if (!selectedItem && items.length) {
            setSelectedItem(items[0])
        }
    }, [items])

    useEvent('keydown', keyDownHandler)
    
    useEvent('message', messageHandler)

    return (
        <div className="app">
            <Header showModal={toggleModalDisplay}
                    searchItem={searchItem} refToSearch={refToSearch}/>

            <div className={'main'}>
                {!showModal && itemsSource.length ?
                    itemsSource.map((item, index) => <Item key={index} item={item}
                                                           openItem={openItem}
                                                           isSelected={selectedItem ===
                                                           item.url}
                                                           setSelected={setSelectedItem}/>)
                    : <p className={'no-items'}>No Items</p>}

                {showModal &&
                <Modal enabled={enableModal} showModal={toggleModalDisplay} addItem={addItem}/>}
            </div>
        </div>
    )
}


//Save items to local storage
const saveItems = items => {
    localStorage.setItem('readIt-items', JSON.stringify(items))
}


export default App
