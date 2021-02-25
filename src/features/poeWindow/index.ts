import { BrowserWindow, Rectangle } from 'electron';
import { overlayWindow } from 'electron-overlay-window';
import appConfig from '../../constants/appConfig';
import { EventEmitter } from 'events';

interface PoeWindow {
  on(event: 'status-changed', listener: (isActive: boolean) => void): this;
}

class PoeWindow extends EventEmitter {
  private _isActive: boolean = false;
  private _bounds?: Rectangle;
  private _isAttached: boolean = false;

  constructor() {
    super();
    overlayWindow.defaultBehavior = true;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  set isActive(value: boolean) {
    if (this._isActive === value) return;

    this._isActive = value;
    console.log('poeWindowIsActiveChanged', this._isActive);
    this.emit('status-changed', this._isActive);
  }

  get bounds(): Rectangle | undefined {
    return this._bounds;
  }

  get isAttached(): boolean {
    return this._isAttached;
  }

  attach(window: BrowserWindow) {
    overlayWindow.on('focus', () => {
      this.isActive = true;
    });

    overlayWindow.on('blur', () => {
      this.isActive = false;
    });

    overlayWindow.on('moveresize', (e) => {
      this._bounds = e;
    });

    overlayWindow.on('attach', (e) => {
      console.log('Attached');
      this._isAttached = true;
      this._bounds = e;
    });

    overlayWindow.on('detach', () => {
      this._isAttached = false;
    });

    overlayWindow.attachTo(window, appConfig.poeWindowName);
  }
}

export const poeWindow = new PoeWindow();
