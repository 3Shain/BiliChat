import { app, BrowserWindow, screen } from 'electron';
import { bootstrapBackendCore } from '@comen/backend-core';
import { environment } from './environments/environment';
import { join, resolve } from 'path';

async function initService() {
  await bootstrapBackendCore({
    dev: !environment.production,
    frontendPath: join(resolve(__dirname), '..', 'core') // core: frontendProject
  });
}

function ready() {

  const workAreaSize = screen.getPrimaryDisplay().workAreaSize;
  const width = Math.min(1400, workAreaSize.width || 1400);
  const height = Math.min(960, workAreaSize.height || 960);
  const mainWindow = new BrowserWindow({
    width: width,
    height: height,
    show: false,
    webPreferences: {
      contextIsolation: true,
      backgroundThrottling: false,
      devTools: !environment.production
    }
  });
  mainWindow.setMenu(null);
  mainWindow.center();
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.once('closed', () => {
    //todo anlahukeba
  });

  if (!app.isPackaged) {
    mainWindow.loadURL(`http://localhost:${4200}`);
  } else {
    mainWindow.loadURL(`http://127.0.0.1:4000`); // TODO: this is determined by bootstrapBackendCore
  }
}

async function main() {

  await initService();

  app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
      app.quit();
    }
  });

  app.on('ready', () => {
    ready();
  });

  app.on('activate', () => {
    ready();
  });

}

main();