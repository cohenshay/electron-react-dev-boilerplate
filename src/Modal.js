import React, {useState, useRef, useEffect} from 'react';

function modal(props) {
    const {showModal, addItem, enabled} = props;
    const [url, setUrl] = useState(null);
    const inputFocused = useRef(null);
    useEffect(() => {
        inputFocused.current.focus();
    }, [])
    return (
        <div className={'modal'} onKeyUp={(e) => e.key === "Enter" ? addItem(url) : ""}>
            <input ref={inputFocused} className={'url'} onChange={(e) => setUrl(e.target.value)} type={'text'}
                   placeholder={'Enter UTL'}/>
            <button className={`add-item ${enabled ? '' : 'item-disabled'}`} disabled={!enabled} onClick={() => addItem(url)}>
               {enabled? 'Add Item':'Adding...'}
            </button>
            <button className={`close-modal ${enabled ? '' : 'modal-disabled'}`}
                    onClick={() => showModal(false)}>Cancel
            </button>
        </div>
    )
}

export default modal;