const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

// Command line arguments থেকে development mode check করুন
const isDev = process.argv.includes('--dev')

// Express সার্ভার শুরু করুন
require('../server/index.js')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false // Initially hide the window
  })

  // Development mode এ Vite dev server থেকে load করুন
  if (isDev) {
    console.log('Development mode: Loading from Vite dev server')
    mainWindow.loadURL('http://localhost:5173')
      .then(() => {
        console.log('Successfully loaded from Vite dev server')
        mainWindow.show()
        mainWindow.webContents.openDevTools()
      })
      .catch((error) => {
        console.error('Failed to load from Vite dev server:', error)
        // Fallback: Express server থেকে load করুন
        mainWindow.loadURL('http://localhost:3001')
          .then(() => {
            console.log('Fallback: Loaded from Express server')
            mainWindow.show()
          })
          .catch((fallbackError) => {
            console.error('Failed to load from Express server:', fallbackError)
          })
      })
  } else {
    console.log('Production mode: Loading from Express server')
    mainWindow.loadURL('http://localhost:3001')
      .then(() => {
        mainWindow.show()
      })
      .catch((error) => {
        console.error('Failed to load from Express server:', error)
      })
  }

  // Window closed event
  mainWindow.on('closed', () => {
    console.log('Window closed')
  })
}

app.whenReady().then(() => {
  console.log('App is ready')
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  console.log('All windows closed')
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  console.log('App is quitting')
})

// IPC কমিউনিকেশন হ্যান্ডলার
ipcMain.handle('get-message', async () => {
  try {
    const response = await fetch('http://localhost:3001/api/message')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching message:', error)
    return { message: 'Error connecting to server', error: error.message }
  }
})

// App ready event
app.on('ready', () => {
  console.log('Electron app is ready')
})


// const { app, BrowserWindow, ipcMain } = require('electron')
// const path = require('path')
// const isDev = process.argv.includes('--dev')

// // Express server
// require('../server/index.js')

// function createWindow() {
//   const mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     icon: path.join(__dirname, '../../public/icon.png'),
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       preload: path.join(__dirname, 'preload.js')
//     },
//     show: false
//   })

//   if (isDev) {
//     console.log('Development mode: Loading from Vite dev server')
//     mainWindow.loadURL('http://localhost:5173')
//       .then(() => {
//         mainWindow.show()
//         mainWindow.webContents.openDevTools()
//       })
//       .catch(() => {
//         mainWindow.loadURL('http://localhost:3001').then(() => mainWindow.show())
//       })
//   } else {
//     console.log('Production mode: Loading from local build')
//     mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'))
//       .then(() => mainWindow.show())
//       .catch((error) => {
//         console.error('Failed to load local index.html:', error)
//       })
//   }

//   mainWindow.on('closed', () => console.log('Window closed'))
// }

// app.whenReady().then(() => {
//   createWindow()
//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit()
// })
