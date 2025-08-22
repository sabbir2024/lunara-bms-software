const { contextBridge, ipcRenderer } = require('electron')

// মেইন প্রসেসের সাথে নিরাপদ IPC কমিউনিকেশনের জন্য API এক্সপোজ করুন
contextBridge.exposeInMainWorld('electronAPI', {
  getMessage: () => ipcRenderer.invoke('get-message'),
  platform: process.platform,
  versions: process.versions
})