import Store from 'electron-store';
import { Config } from '../types/config.interface';
import { ipcMain } from 'electron';
import { IPC_EVENTS } from './ipc/events';

export const defaultConfig: Config = {
  logLevel: '2',
  leagueId: 'Ritual',
  language: 'en'
};

export const initializeConfigEvents = (): void => {
  ipcMain.on(IPC_EVENTS.GET_CONFIG, e => {
    e.returnValue = config.store;
  });

  ipcMain.on(IPC_EVENTS.UPDATE_CONFIG, (_e, cfg: Config) => {
    config.store = cfg;
  });
};

export const config = (() => {
  const store = new Store<Config>({
    name: 'config',
    cwd: 'data',
    defaults: defaultConfig
  });

  return store;
})();
