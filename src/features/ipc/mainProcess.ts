import { Config } from '../../types/config.interface';
import { defaultConfig } from '../../constants/config';
import { Renderer } from 'electron';
import { IPC_EVENTS } from '../../constants/ipc/events';
import { ScreenSizeInterface } from '../../types/screen.interface';

let electron: typeof Renderer | undefined;
try {
  electron = require('electron');
} catch {
}

class MainProcess extends EventTarget {
  constructor() {
    super();

    if (!electron) return;

    electron.ipcRenderer.on(IPC_EVENTS.OCR_PROGRESS, (_e, data) => {
      this.dispatchEvent(new CustomEvent(IPC_EVENTS.OCR_PROGRESS, data));
    });
  }

  get isElectron() {
    return (electron !== null);
  }

  getConfig(): Config {
    return electron ? electron.ipcRenderer.sendSync(IPC_EVENTS.GET_CONFIG) : defaultConfig;
  }

  saveConfig(config: Config): void {
    if (electron) {
      electron.ipcRenderer.send(IPC_EVENTS.UPDATE_CONFIG, JSON.parse(JSON.stringify(config)));
    }
  }

  getScreenDimension(): ScreenSizeInterface {
    return electron ? electron.ipcRenderer.sendSync(IPC_EVENTS.GET_SCREEN_DIMENSION) : { width: 1920, height: 1080 };
  }

  showOverlayWindow(): boolean {
    if (electron) {
      electron.ipcRenderer.send(IPC_EVENTS.SHOW_OVERLAY);
      return true;
    } else {
      return false;
    }
  }

  sendOverlayReady(): void {
    if (electron) {
      electron.ipcRenderer.send(IPC_EVENTS.OVERLAY_READY);
    }
  }

  closeOverlayWindow() {
    if (electron) {
      electron.ipcRenderer.send(IPC_EVENTS.CLOSE_OVERLAY);
    }
  }
}

export const mainProcess = new MainProcess();
