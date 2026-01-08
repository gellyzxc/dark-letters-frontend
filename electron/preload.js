const { contextBridge, ipcRenderer } = require('electron')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getPath: (name) => ipcRenderer.invoke('app:getPath', name),
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  
  // Add more API methods as needed
  platform: process.platform,
  
  // App info
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
})

// Prevent navigation via middle click or Ctrl+Click
window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (e) => {
    if (e.button === 1 || (e.ctrlKey && e.button === 0)) {
      e.preventDefault()
      e.stopPropagation()
    }
  }, true)
})
