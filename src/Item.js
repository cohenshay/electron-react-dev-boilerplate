import React from 'react'
import fs from 'fs'

let reader
fs.readFile(`./src/reader.js`, (err, data) => {
  reader = data.toString()
})

function item (props) {
  const { item, isSelected, setSelected } = props

  return (
    <div onDoubleClick={() => dblClickHandler(item)}
         className={`read-item ${isSelected ? 'selected' : ''}`}
         onClick={() => setSelected(item.url)}>
      <img src={item.screenshot} alt={'screenshot'}/>
      <h2>{item.title}</h2>
    </div>
  )
}

const dblClickHandler = (item) => {
  let readerWin = window.open(item.url, '',
    `maxWidth=2000,maxHeight=2000,width=1200,height=800,backgroundColor=#DEDEDE,nodeIntegration=0,contextIsolation=1`)
  readerWin.eval(reader)
}

export default item