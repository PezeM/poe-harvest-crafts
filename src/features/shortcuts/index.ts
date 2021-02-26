import { poeWindow } from '../poeWindow';
import { globalShortcut } from 'electron';
import { Shortcut } from './shortcut';
import { config } from '../../constants/config';
import { overlay } from '../overlay';

class ShortcutsManager {
  private _initialized: boolean = false;

  static toElectronShortcut(shortcut: string) {
    return shortcut
      .split(' + ')
      // .map(k => KeyToElectron[k as keyof typeof KeyToElectron])
      .join('+');
  }

  public initializeShortcuts() {
    if (this._initialized) return;

    poeWindow.on('status-changed', this.onPoeWindowStatusChange.bind(this));
    this.registerShortcuts();

    this._initialized = true;
  }

  unregisterShortcuts() {
    globalShortcut.unregisterAll();
    console.log('Unregistered global shortcuts');
  }

  private onPoeWindowStatusChange(newStatus: boolean) {
    process.nextTick(() => {
      if (newStatus === poeWindow.isActive) {
        if (newStatus) {
          this.registerShortcuts();
        } else {
          this.unregisterShortcuts();
        }
      }
    });
  }

  private registerShortcuts() {
    const shortcuts: Shortcut<Function>[] = [
      new Shortcut(config.get('openOcr'), () => overlay.showOverlayWindow())
    ];

    for (const shortcut of shortcuts) {
      const registeredSuccessfully = globalShortcut.register(shortcut.shortcut!, shortcut.call);
      if (!registeredSuccessfully) {
        console.error(`Shortcut ${shortcut.shortcut} wasn't registered because it's used by another application.`);
      }
    }

    console.log(`Registered ${shortcuts.length} global shortcuts`);
  }
}

export const shortcutsManager = new ShortcutsManager();
