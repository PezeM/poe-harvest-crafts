import { BrowserWindow, ipcMain } from 'electron';
import { overlayWindow } from 'electron-overlay-window';
import { IPC_EVENTS } from '../../constants/ipc/events';
import path from 'path';
import appConfig from '../../constants/appConfig';

class OverlayWindow {
  private _window?: BrowserWindow;

  constructor() {
    ipcMain.on(IPC_EVENTS.SHOW_OVERLAY, () => {
      this.showOverlayWindow();
    });

    ipcMain.on(IPC_EVENTS.CLOSE_OVERLAY, () => {
      this.closeOverlayWindow();
    });
  }

  get window() {
    return this._window;
  }

  get isOverlayShown(): boolean {
    return this._window?.isVisible() ?? false;
  }

  createOverlayWindow(): boolean {
    if (this._window) {
      this._window.destroy();
    }

    try {
      const window = new BrowserWindow({
        title: 'Poe-harvest-crafts-overlay',
        width: 300,
        height: 400,
        frame: false,
        fullscreenable: true,
        transparent: true,
        skipTaskbar: true,
        resizable: true,
        show: false,
        webPreferences: {
          nodeIntegration: true,
          enableRemoteModule: true
        }
      });

      this._window = window;

      const directory = path.join(__dirname, '../..');
      this._window.loadURL(`file://${directory}/index.html#/overlay`);

      this._window.on('closed', () => {
        this._window = undefined;
      });

      this._window.setIgnoreMouseEvents(true);
      overlayWindow.attachTo(this._window, appConfig.poeWindowName);

      return true;
    } catch (e) {
      this.closeOverlayWindow();
      console.error(`Error when creating overlay window.`, e);

      return false;
    }
  }

  public showOverlayWindow() {
    if (!this._window) {
      this.createOverlayWindow();
    }

    if (this._window) {
      overlayWindow.show();
    }
  }

  public closeOverlayWindow() {
    overlayWindow.hide();

    if (this._window) {
      this._window.destroy();
      this._window = undefined;
      overlayWindow.stop();
    }
  }
}

export const overlay = new OverlayWindow();
