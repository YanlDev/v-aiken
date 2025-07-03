const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Mantener una referencia global del objeto de la ventana
let mainWindow;

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    frame: true, // Muestra la barra de título nativa de Windows con controles
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.cjs')
    },
    icon: path.join(__dirname, 'assets/icon.svg'),
    show: false, // No mostrar hasta que esté listo
    autoHideMenuBar: true, // Ocultar menu bar en producción
    webSecurity: true
  });

  // Cargar la app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // Abrir DevTools en desarrollo
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Mostrar ventana cuando esté lista
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Enfocar la ventana
    if (isDev) {
      mainWindow.focus();
    }
  });

  // Emitido cuando la ventana es cerrada
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Manejar enlaces externos
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Este método será llamado cuando Electron haya terminado la inicialización
app.whenReady().then(() => {
  createWindow();

  // Recrear ventana en macOS cuando el dock icon es clickeado
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Salir cuando todas las ventanas estén cerradas, excepto en macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Permitir múltiples instancias para nuevo proyecto
// Comentamos el single instance lock para permitir nueva ventana
// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on('second-instance', () => {
//     // Alguien trató de ejecutar una segunda instancia, enfocamos nuestra ventana
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       mainWindow.focus();
//     }
//   });
// }

// Configurar menu personalizado
const template = [
  {
    label: 'Archivo',
    submenu: [
      {
        label: 'Nuevo Proyecto',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          createWindow();
        }
      },
      { type: 'separator' },
      {
        label: 'Salir',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Ver',
    submenu: [
      { role: 'reload', label: 'Recargar' },
      { role: 'forceReload', label: 'Forzar Recarga' },
      { role: 'toggleDevTools', label: 'Herramientas de Desarrollador' },
      { type: 'separator' },
      { role: 'resetZoom', label: 'Zoom Normal' },
      { role: 'zoomIn', label: 'Acercar' },
      { role: 'zoomOut', label: 'Alejar' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: 'Pantalla Completa' }
    ]
  },
  {
    label: 'Ayuda',
    submenu: [
      {
        label: 'Acerca de Validador Aiken',
        click: () => {
          require('electron').dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: 'Acerca de Validador Aiken',
            message: 'Validador Aiken v1.0.0',
            detail: 'Validación multi-criterio automatizada\nSoftware para análisis de validez de contenido usando coeficiente V de Aiken',
            buttons: ['OK']
          });
        }
      }
    ]
  }
];

// Aplicar menu
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Handlers para controles de ventana
ipcMain.handle('window-minimize', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('window-close', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.handle('window-is-maximized', () => {
  if (mainWindow) {
    return mainWindow.isMaximized();
  }
  return false;
});

// Handler para crear nueva ventana (nuevo proyecto)
ipcMain.handle('new-project', () => {
  createWindow();
});

// Prevenir navegación no deseada
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:5173' && !isDev) {
      event.preventDefault();
    }
  });
});