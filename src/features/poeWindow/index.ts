import { BrowserWindow } from 'electron';
import { overlayWindow } from 'electron-overlay-window';
import appConfig from '../../constants/appConfig';
import { EventEmitter } from 'events';

interface PoeWindow {
  on(event: 'status-changed', listener: (isActive: boolean) => void): this;
}

class PoeWindow extends EventEmitter {
  private _isActive: boolean = false;

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    if (this._isActive === value) return;

    this._isActive = value;
    console.log('poeWindowIsActiveChanged', this._isActive);
    this.emit('status-changed', this._isActive);
  }

  attach(window: BrowserWindow) {
    overlayWindow.on('focus', () => {
      this.isActive = true;
    });
    overlayWindow.on('blur', () => {
      this.isActive = false;
    });

    overlayWindow.attachTo(window, appConfig.poeWindowName);
  }
}

export const poeWindow = new PoeWindow();
