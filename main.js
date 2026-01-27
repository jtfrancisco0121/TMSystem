const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = !!process.env.ELECTRON_START_URL;
const { autoUpdater } = require('electron-updater');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const devUrl = process.env.ELECTRON_START_URL || null;
  if (devUrl) {
    win.loadURL(devUrl);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, 'renderer', 'dist', 'index.html'));
  }

  return win;
}

function sendToRenderer(channel, payload) {
  if (win && win.webContents) win.webContents.send(channel, payload);
}

autoUpdater.autoDownload = true;
autoUpdater.on('checking-for-update', () => sendToRenderer('update-checking'));
autoUpdater.on('update-available', info => sendToRenderer('update-available', info));
autoUpdater.on('update-not-available', info => sendToRenderer('update-not-available', info));
autoUpdater.on('error', err => sendToRenderer('update-error', err && err.message ? err.message : err));
autoUpdater.on('download-progress', progress => sendToRenderer('update-progress', progress));
autoUpdater.on('update-downloaded', info => sendToRenderer('update-downloaded', info));

ipcMain.on('install-update', () => {
  try {
    autoUpdater.quitAndInstall();
  } catch (e) {
    console.error('Failed to quit and install update', e);
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Only check for updates when packaged (production). To allow dev checks set AUTO_UPDATE_ALLOW_DEV=1
  if (app.isPackaged || process.env.AUTO_UPDATE_ALLOW_DEV === '1') {
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify().catch(err => console.error('Update check failed', err));
    }, 2000);
  }
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
