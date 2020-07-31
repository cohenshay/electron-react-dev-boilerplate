import React from 'react'


function item(props) {
    const {item, isSelected, setSelected,openItem} = props


    return (
        <div
            onDoubleClick={() => openItem(item.url)}
            className={`read-item ${isSelected ? 'selected' : ''}`}
            onClick={() => setSelected(item.url)}>
            <img src={item.screenshot} alt={'screenshot'}/>
            <h2>{item.title}</h2>
        </div>
    )
}


export default item