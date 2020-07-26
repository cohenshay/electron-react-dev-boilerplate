import React from 'react';

function item(props) {
    const {item, isSelected, setSelected} = props;

    return (
        <div onDoubleClick={()=>dblClickHandler(item)} className={`read-item ${isSelected ? 'selected' : ''}`} onClick={() => setSelected(item.url)}>
            <img src={item.screenshot}/>
            <h2>{item.title}</h2>
        </div>
    )
}

const dblClickHandler = (item) => {
    console.log(item)
};

export default item;