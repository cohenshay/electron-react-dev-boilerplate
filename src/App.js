import React, {useState} from 'react';
import './App.css';
import Modal from './Modal';
import Item from './Item';
import Header from './Header';

const electron = window.require('electron');

function App() {

    const [items, setItems] = useState([])


    return (
        <div className="App">
            <Header/>
            {items.length ?
                items.map((item, index) => <Item key={index} data={item}/>)
                : <p className={'no-items'}>No Items</p>}
            <Modal/>
        </div>
    );
}

export default App;
