import React, { useEffect } from 'react'
import fs from 'fs'

//Button 'Done' JS parsed to string
let reader
fs.readFile(`./src/reader.js`, (err, data) => {
  reader = data.toString()
})

function item (props) {
  const { item, isSelected, setSelected } = props

  useEffect(() => {
    //Ref to open item in order to open item from menu
    window.openItem = () => openItem(item)
  })

  return (
    <div onDoubleClick={() => openItem(item)}
         className={`read-item ${isSelected ? 'selected' : ''}`}
         onClick={() => setSelected(item.url)}>
      <img src={item.screenshot} alt={'screenshot'}/>
      <h2>{item.title}</h2>
    </div>
  )
}

//Open the item in new window and inject 'Done' button that close and remove the item
const openItem = (item) => {

  //Open item url with nodeIntegration=false since we don't want to let malicious scripts on this site access to file system
  let readerWin = window.open(item.url, '',
    `maxWidth=2000,maxHeight=2000,width=1200,height=800,backgroundColor=#DEDEDE,nodeIntegration=0,contextIsolation=1`)

  //Inject button JS
  readerWin.eval(reader)
}

export default item