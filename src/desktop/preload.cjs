const { contextBridge, ipcRenderer } = require('electron');

// Expose safe, isolated API to the renderer (React POS UI)
contextBridge.exposeInMainWorld('electronAPI', {
  isDesktop: true,
  platform: process.platform,

  // Hardware & Printing
  getPrinters: () => ipcRenderer.invoke('pos:get-printers'),
  printReceipt: (options) => ipcRenderer.invoke('pos:print-receipt', options),
  getSystemInfo: () => ipcRenderer.invoke('pos:get-system-info'),

  // Native Window Management
  minimizeWindow: () => ipcRenderer.send('pos:window-action', 'minimize'),
  maximizeWindow: () => ipcRenderer.send('pos:window-action', 'maximize'),
  closeWindow: () => ipcRenderer.send('pos:window-action', 'close'),
  toggleFullscreen: () => ipcRenderer.send('pos:window-action', 'fullscreen')
});
