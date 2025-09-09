const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const ttf2woff = require('ttf2woff');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

// IPC
ipcMain.handle('select-ttf-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: 'Fonts', extensions: ['ttf'] }],
    properties: ['openFile']
  });
  if (canceled || filePaths.length === 0) return { canceled: true };
  return { canceled: false, filePath: filePaths[0] };
});

ipcMain.handle('convert-ttf', async (event, ttfPath) => {
  try {
    if (!fs.existsSync(ttfPath)) throw new Error("Plik nie istnieje");
    const ttfData = fs.readFileSync(ttfPath);
    const woffData = ttf2woff(ttfData);
    const jsContent = `export const font = new Uint8Array([${Array.from(woffData.buffer).join(',')}]);`;

    const { canceled, filePath } = await dialog.showSaveDialog({
      defaultPath: path.basename(ttfPath, '.ttf') + '-font.js',
      filters: [{ name: 'JS', extensions: ['js'] }]
    });

    if (canceled || !filePath) return { success: false };
    fs.writeFileSync(filePath, jsContent);
    return { success: true, path: filePath };
  } catch (err) {
    console.error(err);
    return { success: false };
  }
});
