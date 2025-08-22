const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const isDev = process.argv.includes('--dev')

// Import the Express app
const expressApp = require('../server/index.js');

let mainWindow;
let server;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../../public/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    show: false
  })

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
      })
  } else {
    console.log('Production mode: Starting Express server and loading app')
    
    // Start Express server on port 3001
    const PORT = 3001;
    server = expressApp.listen(PORT, () => {
      console.log(`Production server running at http://localhost:${PORT}`)
      
      // Load the app from the Express server
      mainWindow.loadURL(`http://localhost:${PORT}`)
        .then(() => {
          mainWindow.show()
          console.log('Successfully loaded from production server')
        })
        .catch((error) => {
          console.error('Failed to load from production server:', error)
          // Fallback: try loading file directly
          mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'))
            .then(() => {
              mainWindow.show()
              console.log('Successfully loaded from local file')
            })
            .catch((fileError) => {
              console.error('Failed to load file:', fileError)
            })
        })
    })
  }

  mainWindow.on('closed', () => {
    console.log('Window closed')
    if (server) {
      server.close()
    }
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
  if (server) {
    server.close()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC communication handler
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

// Health check IPC
ipcMain.handle('health-check', async () => {
  try {
    const response = await fetch('http://localhost:3001/api/health')
    const data = await response.json()
    return data
  } catch (error) {
    return { status: 'ERROR', message: 'Server not reachable' }
  }
})