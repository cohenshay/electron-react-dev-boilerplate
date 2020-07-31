import React, { useState, useEffect } from 'react'
import './App.css'
import Modal from './Modal'
import Item from './Item'
import Header from './Header'
import useEvent from './hooks/useEvent'
import './menu';
const electron = window.require('electron')
const { ipcRenderer } = electron

function App () {

  const itemsFromStorage = JSON.parse(localStorage.getItem('readIt-items')) ||  [];

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
    const { action } = e.data
    switch (action) {
      case 'delete-item': {
        //Remove from list
        const removeItem = items.filter(item => item.url !== selectedItem)
        setItems(removeItem)

        //Set new selectedItem
        if (removeItem.length) {
          const itemIndex = items.findIndex(item => item.url === selectedItem)
          const newSelectedItemIndex = (itemIndex === 0) ? 0 : itemIndex - 1
          setSelectedItem(removeItem[newSelectedItemIndex])
        }

        //Close window
        e.source.close()
        break;
      }
      default:
        return
    }
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
    window.newItem = () =>{
      toggleModalDisplay(true)
    }

  }, []);

  //Save items to local storage after change
  useEffect(() => {
    saveItems(items)
    if(!selectedItem && items.length){
      setSelectedItem(items[0])
    }
  }, [items])

  useEvent('keydown', keyDownHandler)
  useEvent('message', messageHandler)

  return (
    <div className="app">
      <Header showModal={toggleModalDisplay}
              searchItem={title => searchItem(title, itemsSource,
                setFilterItems, setHasFilter)}/>

      <div className={'main'}>
        {!showModal && itemsSource.length ?
          itemsSource.map((item, index) => <Item key={index} item={item}
                                                 isSelected={selectedItem ===
                                                 item.url}
                                                 setSelected={setSelectedItem}/>)
          : <p className={'no-items'}>No Items</p>}


        {showModal &&
        <Modal enabled={enableModal} showModal={toggleModalDisplay}
               addItem={(url) => addItem(url, toggleModalAppearance)}/>}
      </div>
    </div>
  )
}

const searchItem = (title, items, setFilterItems, setHasFilter) => {
  const filteredItems = items.filter(
    item => item.title.toLowerCase().includes(title));

  setFilterItems(filteredItems);

  !!title ? setHasFilter(true) : setHasFilter(false)
}

//Save items to local storage
const saveItems = items => {
  localStorage.setItem('readIt-items', JSON.stringify(items))
}

const addItem = (url, toggleModalAppearance) => {
  toggleModalAppearance(false)

  //Send item to main process in order to capture the screen
  ipcRenderer.send('new-item', url)
}

export default App
