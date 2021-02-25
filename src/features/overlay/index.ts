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
        width: 800,
        height: 600,
        ...overlayWindow.WINDOW_OPTS,
        webPreferences: {
          nodeIntegration: true,
          enableRemoteModule: true,
          webSecurity: false
        }
      });

      this._window = window;

      this._window.setIgnoreMouseEvents(true);
      this._window.webContents.on('before-input-event', this.onBeforeInput);

      this._window.on('closed', () => {
        this._window = undefined;
      });

      const directory = path.join(__dirname, '../..');
      await this._window.loadURL(`file://${directory}/index.html#/overlay`);

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

    // if (this._window) {
    //   this._window.show();
    //   overlayWindow.show();
    //   this._window.setIgnoreMouseEvents(false);
    //   this._isFocused = true;
    // }
    //
    // poeWindow.isActive = false;

    this._isFocused = true;
    if (this._window) {
      this._window.setIgnoreMouseEvents(false);
      this._window.show();
      overlayWindow.activateOverlay();
    }

    poeWindow.isActive = false;
  }

  public closeOverlayWindow(focusTarget = true) {
    // this._isFocused = false;
    // this._window?.hide();
    // overlayWindow.hide();
    // if (focusTarget) overlayWindow.focusTarget();
    //
    // if (this._window) {
    //   this._window.setIgnoreMouseEvents(true);
    // }
    //
    // poeWindow.isActive = true;
    this._isFocused = false;

    if (this._window) {
      this._window.hide();
      this._window.setIgnoreMouseEvents(true);
    }

    if (focusTarget) overlayWindow.focusTarget();
    poeWindow.isActive = true;
  }

  private onPoeWindowStatusChange = (isActive: boolean) => {
    if (isActive && this._isFocused) {
      this._isFocused = false;
      this._window?.setIgnoreMouseEvents(true);
    }
  };

  private onBeforeInput = (event: Electron.Event, input: Electron.Input) => {
    if (input.type !== 'keyDown' || !this._isFocused) return;

    console.log(input);

    let { code, control, shift, alt } = input;

    if (code.startsWith('Key')) {
      code = code.substr('Key'.length);
    } else if (code.startsWith('Digit')) {
      code = code.substr('Digit'.length);
    }

    if (alt && shift) code = `Shift + Alt + ${code}`;
    if (alt && control) code = `Ctrl + Alt + ${code}`;
    if (control && shift) code = `Ctrl + Shift + ${code}`;
    if (alt) code = `Alt + ${code}`;
    if (control) code = `Ctrl + ${code}`;
    if (shift) code = `Shift + ${code}`;

    switch (code) {
      case 'Escape':
      case 'Ctrl + W': {
        event.preventDefault();
        process.nextTick(this.closeOverlayWindow.bind(this));
        break;
      }
    }
  };
}

export const overlay = new OverlayWindow();
