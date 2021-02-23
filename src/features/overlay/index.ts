import { BrowserWindow, ipcMain } from 'electron';
import { overlayWindow } from 'electron-overlay-window';
import { IPC_EVENTS } from '../../constants/ipc/events';
import path from 'path';
import { delay } from '../../constants/helpers';
import { poeWindow } from '../poeWindow';

class OverlayWindow {
  private _window?: BrowserWindow;
  private _isFocused: boolean;

  constructor() {
    this._isFocused = false;

    ipcMain.on(IPC_EVENTS.SHOW_OVERLAY, async () => {
      await this.showOverlayWindow();
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

  get isFocused(): boolean {
    return this._isFocused;
  }

  async createOverlayWindow(): Promise<boolean> {
    if (process.platform === 'linux') {
      // Fix for transparent window on linux
      await delay(1000);
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
      await this._window.loadURL(`file://${directory}/index.html#/overlay`);

      this._window.on('closed', () => {
        this._window = undefined;
      });

      this._window.setIgnoreMouseEvents(true);

      poeWindow.on('status-changed', this.onPoeWindowStatusChange);
      const readyToShow = new Promise(r => this._window?.once('ready-to-show', r));
      const overlayReady = new Promise(r => ipcMain.once(IPC_EVENTS.OVERLAY_READY, r));
      await readyToShow;
      await overlayReady;

      poeWindow.attach(this._window);

      return true;
    } catch (e) {
      this.closeOverlayWindow();
      console.error(`Error when creating overlay window.`, e);

      return false;
    }
  }

  public async showOverlayWindow() {
    console.log('poeWindow.isActive', poeWindow.isActive);

    if (!this._window) {
      await this.createOverlayWindow();
    }

    if (this._window) {
      this._window.setIgnoreMouseEvents(false);
      this._window.show();
      overlayWindow.show();
      this._isFocused = true;
    }

    poeWindow.isActive = false;
  }

  public closeOverlayWindow(focusTarget = true) {
    this._isFocused = false;
    overlayWindow.hide();
    if (focusTarget) overlayWindow.focusTarget();

    if (this._window) {
      this._window.setIgnoreMouseEvents(true);
    }

    poeWindow.isActive = true;
  }

  private onPoeWindowStatusChange = (isActive: boolean) => {
    if (isActive && this._isFocused) {
      this._isFocused = false;
      this._window?.setIgnoreMouseEvents(true);
    }
  };
}

export const overlay = new OverlayWindow();
