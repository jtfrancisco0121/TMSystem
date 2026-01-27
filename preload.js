const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateChecking: (cb) => ipcRenderer.on('update-checking', cb),
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', (event, info) => cb(info)),
  onUpdateNotAvailable: (cb) => ipcRenderer.on('update-not-available', (event, info) => cb(info)),
  onUpdateError: (cb) => ipcRenderer.on('update-error', (event, error) => cb(error)),
  onUpdateProgress: (cb) => ipcRenderer.on('update-progress', (event, progress) => cb(progress)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', (event, info) => cb(info)),
  installUpdate: () => ipcRenderer.send('install-update')
});
