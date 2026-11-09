const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

if (!app.requestSingleInstanceLock()) app.quit();

function createWindow() {
  Menu.setApplicationMenu(null);
  const win = new BrowserWindow({
    width: 1200, height: 800, minWidth: 420, minHeight: 600,
    title: 'Académie Intelligente',
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  win.loadFile(path.join(__dirname, '..', 'www', 'index.html'));
  // Liens externes (WhatsApp, etc.) -> navigateur par défaut
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
