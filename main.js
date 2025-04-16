const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path');

let win1, win2;

const createWindow = () => {
    win1 = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'logo.ico'),
        webPreferences: {
            preload: __dirname + '/preload.js', // Conexión al proceso de renderizado
        },
        //   fullscreen: true,
    });

    win2 = new BrowserWindow({
        autoHideMenuBar: true, // Esconde el menú para un diseño limpio
        resizable: false, // Evita que el usuario redimensione la ventana
        icon: path.join(__dirname, 'logo.ico'),
        webPreferences: {
            preload: __dirname + '/preload.js',
        },
        //   fullscreen: true,
    });

    // Eliminar menú
    win1.setMenu(null);
    win2.setMenu(null);

    // Cargar el contenido
    win1.loadFile('projector.html');
    win2.loadFile('terminal.html');

    // Ajustar automáticamente al contenido
    win2.once('ready-to-show', () => {
        win2.setBounds(win2.getBounds(), true);
        win2.setSize(
            Math.ceil(win2.getContentBounds().width), // Ajusta al ancho del contenido
            Math.ceil(win2.getContentBounds().height) // Ajusta al alto del contenido
        );
    });

    // Asignar la ventana del proyector
    const projectorWindow = win1;

    // Sincronizar clics de celdas entre ventanas
    ipcMain.on('cell-clicked', (event, cellId, isSelected) => {
        const targetWindow = event.sender === win1.webContents ? win2 : win1;
        targetWindow.webContents.send('update-cell', cellId, isSelected);
    });

    // Sincronizar el reinicio entre ventanas
    ipcMain.on('reset-colors', () => {
        win1.webContents.send('reset-colors');
        win2.webContents.send('reset-colors');
    });

    // Manejar pantalla completa
    ipcMain.on('set-fullscreen', (event, isFullscreen) => {
        if (projectorWindow) {
            projectorWindow.setFullScreen(isFullscreen);
        }
    });

    ipcMain.on('update-price', (event, type, value) => {
        win1.webContents.send('update-price', type, value);
    });

    ipcMain.on('announce', (event, type) => {
        win1.webContents.send('announce', type); // win1 es la ventana del proyector
    });    
};

app.whenReady().then(() => {
    createWindow()
});