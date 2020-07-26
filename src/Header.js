import React from 'react';

function header(props) {
    const {showModal,searchItem} = props;
    return (
        <header>
            <button className={'show-modal'} onClick={() => showModal(true)}>+</button>
            <input className={'search'} type={'text'} placeholder={'Search'} onChange={e=>searchItem(e.target.value)}/>
        </header>
    )
}

export default header;