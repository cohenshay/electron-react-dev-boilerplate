const { remote, shell } = require('electron')

const template = [
  {
    label: 'Items',
    submenu: [
      {
        label: 'Add New',
        click: () => window.newItem(),
        accelerator: 'CmdOrCtrl+O',
      },
      {
        label: 'Read Item',
        accelerator: 'CmdOrCtrl+Enter',
        click: () => window.openItem(),
      },
      {
        label: 'Delete Item',
        accelerator: 'CmdOrCtrl+Backspace',
        click: () => window.deleteItem(),
      },
      {
        label: 'Open in Browser',
        accelerator: 'CmdOrCtrl+Shift+O',
        click: () => window.openItemNative(),
      },
      {
        label: 'Search Items',
        accelerator: 'CmdOrCtrl+S',
        click: () => window.searchItems(),
      },
    ],
  },
  {
    role: 'editMenu',
  },
  {
    role: 'windowMenu',
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn more',
        click: () => {
          shell.openExternal(
            'https://github.com/cohenshay/electron-react-dev-boilerplate')
        },
      },
    ],
  },
]

if (process.platform === 'darwin') {
  template.unshift({
    label: remote.getName(),
    submenu: [
      { role: 'about' },
      { role: 'separator' },
      { role: 'services' },
      { role: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { role: 'separator' },
      { role: 'quit' },
    ],
  })
}
const menu = remote.Menu.buildFromTemplate(template)

remote.Menu.setApplicationMenu(menu)