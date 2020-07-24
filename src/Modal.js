import React from 'react';

function modal(props){
    return(
        <div className={'modal'}>
            <input className={'url'} type={'text'} placeholder={'Enter UTL'}/>
            <button className={'add-item'}>Add Item</button>
            <button className={'close-modal'}>Cancel</button>
        </div>
    )
}

export default modal;