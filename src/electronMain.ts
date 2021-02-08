import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';


function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 560,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, '/preload.js'),
    },
    width: 500,
  });

  mainWindow.removeMenu();

  // and load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '/dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));

  mainWindow.webContents.on('new-window', (e, uri) => {
    e.preventDefault();
    console.log('Opening external - ' + uri);
    require('electron').shell.openExternal(uri);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) { createWindow(); }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
