const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    cellClicked: (cellId, isSelected) => ipcRenderer.send('cell-clicked', cellId, isSelected),
    resetColors: () => ipcRenderer.send('reset-colors'),
    onCellUpdate: (callback) => ipcRenderer.on('update-cell', callback),
    onReset: (callback) => ipcRenderer.on('reset-colors', callback),
    setFullscreen: (isFullscreen) => ipcRenderer.send('set-fullscreen', isFullscreen),
    updatePrice: (type, value) => ipcRenderer.send('update-price', type, value),
    onPriceUpdate: (callback) => ipcRenderer.on('update-price', callback),
    announce: (type) => ipcRenderer.send('announce', type),
    onAnnounce: (callback) => ipcRenderer.on('announce', callback)
});
