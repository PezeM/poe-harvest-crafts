import { app, BrowserWindow, Menu, Tray } from 'electron';

export class TrayMenu {
  private _mainWindow: BrowserWindow;
  private _tray: Electron.Tray;

  constructor(mainWindow: BrowserWindow, iconPath: string) {
    this._mainWindow = mainWindow;
    this._tray = new Tray(iconPath);
  }

  buildMenu() {
    this._tray.on('click', () => {
      if (!this._mainWindow.isVisible()) {
        this._mainWindow.show();
      }
    });

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show App', click: () => {
          this._mainWindow.show();
        }
      },
      {
        label: 'Quit', click: () => {
          this._mainWindow.destroy();
          app.quit();
        }
      }
    ]);

    this._tray.setContextMenu(contextMenu);
  }
}
