import React from 'react';

function header(props){
    return(
        <header>
            <button className={'show-modal'}>+</button>
            <input className={'search'} type={'text'} placeholder={'Search'}/>
        </header>
    )
}

export default header;