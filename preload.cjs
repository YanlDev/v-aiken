const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs protegidas al contexto del renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Comunicación con el proceso principal
  onMenuNuevoProyecto: (callback) => {
    ipcRenderer.on('menu-nuevo-proyecto', callback);
  },
  
  // Información del sistema
  platform: process.platform,
  
  // Utilidades para la aplicación
  openExternal: (url) => {
    ipcRenderer.invoke('open-external', url);
  },
  
  // Información de la aplicación
  getVersion: () => {
    return process.env.npm_package_version || '1.0.0';
  },
  
  // Controles de ventana
  windowControls: {
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized')
  },
  
  // Crear nueva ventana (nuevo proyecto)
  newProject: () => ipcRenderer.invoke('new-project')
});

// Eliminar listener cuando la ventana se cierre
window.addEventListener('beforeunload', () => {
  ipcRenderer.removeAllListeners('menu-nuevo-proyecto');
});