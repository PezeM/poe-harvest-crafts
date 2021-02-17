import { BrowserWindow, ipcMain } from 'electron';
import { IPC_EVENTS } from '../../constants/ipc/events';
import path from 'path';

class OverlayWindow {
  private _window?: BrowserWindow;

  constructor() {
    ipcMain.on(IPC_EVENTS.SHOW_OVERLAY, () => {
      this.showOverlayWindow();
    });
  }

  get window() {
    return this._window;
  }

  createOverlayWindow() {
    if (this._window) {
      this._window.destroy();
    }

    const window = new BrowserWindow({
      width: 1280,
      height: 720,
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

    this._window.setPosition(0, 0);
    this._window.maximize();

    const directory = path.join(__dirname, '../..');
    console.log(directory);

    this._window.loadURL(`file://${directory}/index.html#/overlay`);

    this._window.once('ready-to-show', () => {
      console.log('Showing window');
      this._window?.show();
    });

    this._window.on('closed', () => {
      this._window = undefined;
    });
  }

  public showOverlayWindow() {
    if (!this._window) {
      this.createOverlayWindow();
    }

    this._window?.show();
    this._window?.focus();
  }

  public closeOverlayWindow() {
    if (this._window) {
      this._window.destroy();
    }
  }
}

export const overlayWindow = new OverlayWindow();
