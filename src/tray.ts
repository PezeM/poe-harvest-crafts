import { app, BrowserWindow, Menu, shell, Tray } from 'electron';
import path from 'path';
import appConfig from './constants/appConfig';

export class TrayMenu {
  private readonly _mainWindow: BrowserWindow;
  private _tray: Electron.Tray;

  constructor(mainWindow: BrowserWindow, iconPath: string) {
    this._mainWindow = mainWindow;
    this._tray = new Tray(iconPath);
    this._tray.setToolTip('Poe Harvest Crafts');
  }

  buildMenu() {
    this._tray.off('click', this.onTrayClick);
    this._tray.on('click', this.onTrayClick);

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App', click: () => {
          this._mainWindow.show();
        }
      },
      { type: 'separator' },
      {
        label: `Version ${app.getVersion()}`,
        click: () => {
          shell.openExternal('https://github.com/PezeM/poe-harvest-crafts/releases');
        }
      },
      {
        label: 'Open data folder',
        click: () => {
          shell.openPath(path.join(app.getPath('userData'), appConfig.dataFolderName));
        }
      },
      { type: 'separator' },
      {
        label: 'Quit', click: () => {
          this._mainWindow.destroy();
          app.quit();
        }
      }
    ]);

    this._tray.setContextMenu(contextMenu);
  }

  private onTrayClick = () => {
    if (this._mainWindow && !this._mainWindow.isVisible()) {
      this._mainWindow.show();
    }
  };
}
