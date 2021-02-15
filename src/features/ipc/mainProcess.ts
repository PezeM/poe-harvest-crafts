import { Config } from '../../types/config.interface';
import { defaultConfig } from '../../constants/config';
import { Renderer } from 'electron';
import { IPC_EVENTS } from '../../constants/ipc/events';

let electron: typeof Renderer | undefined;
try {
  electron = require('electron');
} catch {
}

class MainProcess extends EventTarget {
  constructor() {
    super();
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
}

export const mainProcess = new MainProcess();
