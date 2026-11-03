const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

const isDev = process.env.NODE_ENV === 'development' || (!app.isPackaged && process.argv.includes('--dev'));

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    title: 'FlexiPOS - Sri Lankan Retail POS Platform',
    autoHideMenuBar: true,
    backgroundColor: '#0f172a', // Slate-900 background on launch
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  const distPath = path.join(__dirname, '../../dist/index.html');

  // Forward renderer console logs to terminal
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer] ${message}`);
  });

  // Handle load failure: auto fallback to local dist/index.html if dev server is unreachable
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.warn(`[Electron] Failed to load ${validatedURL}: ${errorDescription} (${errorCode})`);
    if (fs.existsSync(distPath) && !validatedURL.includes('index.html')) {
      console.log('[Electron] Dev server unreachable. Falling back to local dist/index.html...');
      mainWindow.loadFile(distPath);
    }
  });

  // Load URL or File
  if (isDev) {
    console.log('[Electron] Running in Development Mode -> loading http://127.0.0.1:5173');
    mainWindow.loadURL('http://127.0.0.1:5173').catch(() => {
      if (fs.existsSync(distPath)) {
        console.log('[Electron] Falling back to local dist/index.html');
        mainWindow.loadFile(distPath);
      }
    });

    // F12 toggles DevTools
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if (input.key === 'F12' && input.type === 'keyDown') {
        mainWindow.webContents.toggleDevTools();
      }
    });
  } else {
    console.log('[Electron] Running in Production Mode -> loading:', distPath);
    mainWindow.loadFile(distPath).catch((err) => {
      console.error('[Electron] Failed to load production dist/index.html:', err);
    });
  }

  // Handle external link clicks
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// POS Hardware & Native IPC Handlers
ipcMain.handle('pos:get-printers', async () => {
  if (!mainWindow) return [];
  try {
    return await mainWindow.webContents.getPrintersAsync();
  } catch (err) {
    console.error('Failed to get printers:', err);
    return [];
  }
});

ipcMain.handle('pos:print-receipt', async (event, options = {}) => {
  if (!mainWindow) return { success: false, error: 'Window not available' };
  return new Promise((resolve) => {
    mainWindow.webContents.print(
      {
        silent: options.silent ?? false,
        printBackground: true,
        deviceName: options.printerName || undefined,
        copies: options.copies || 1,
        pageSize: options.paperSize === '58mm' ? { width: 58000, height: 200000 } : { width: 80000, height: 200000 }
      },
      (success, failureReason) => {
        if (!success) {
          console.warn('Print failed:', failureReason);
          resolve({ success: false, error: failureReason });
        } else {
          resolve({ success: true });
        }
      }
    );
  });
});

ipcMain.handle('pos:get-system-info', async () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: app.getVersion(),
    electronVersion: process.versions.electron,
    nodeVersion: process.versions.node
  };
});

ipcMain.on('pos:window-action', (event, action) => {
  if (!mainWindow) return;
  switch (action) {
    case 'minimize':
      mainWindow.minimize();
      break;
    case 'maximize':
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
      break;
    case 'fullscreen':
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      break;
    case 'close':
      mainWindow.close();
      break;
  }
});

// App Lifecycle
app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
