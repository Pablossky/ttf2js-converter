const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectTTFFile: () => ipcRenderer.invoke('select-ttf-file'),
  convertTTF: (filePath) => ipcRenderer.invoke('convert-ttf', filePath)
});
