const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const windowStateKeeper = require('electron-window-state');
const path = require('path');
const isDev = require('electron-is-dev');

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
        maxWidth: 650,
        minHeight: 300,
        webPreferences: {nodeIntegration: true}
    });

    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    mainWindow.on('closed', () => mainWindow = null);

    state.manage(mainWindow)
}



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
