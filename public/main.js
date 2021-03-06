const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const {ipcMain} = electron;
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const isDev = require('electron-is-dev');
const os = require('os');
const fs = require('fs')
const capturePage = require('./capturePage');

let mainWindow;

function createWindow() {

    let state = windowStateKeeper({
        defaultWidth: 500, defaultHeight: 650
    })

    mainWindow = new BrowserWindow({
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        minWidth: 350,
        minHeight: 300,
        webPreferences: {nodeIntegration: true}
    });

    //Add react-dev-tools in DEV mode
    if(isDev) {
        const reactDevToolsPath = path.join(os.homedir(), '/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/');
        fs.readdir(reactDevToolsPath, function (err, directory) {
            const devToolsVersion = (directory[0].toString());
            BrowserWindow.addDevToolsExtension(
                path.join(reactDevToolsPath, devToolsVersion)
            )
        });
    }



    mainWindow.webContents.openDevTools();

    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    mainWindow.on('closed', () => mainWindow = null);

    state.manage(mainWindow)
}

ipcMain.on('new-item', (e, url) => {
    capturePage(url, item => {
        e.sender.send('new-item-success', item)
    });
})


app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
