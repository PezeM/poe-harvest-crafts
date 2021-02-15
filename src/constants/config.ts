import Store from 'electron-store';
import { Config } from '../types/interfaces/config.interface';

const defaultConfig: Config = {
  logLevel: '2',
  leagueId: 'Ritual',
  language: 'en'
};

export const config = (() => {
  const store = new Store<Config>({
    name: 'config',
    cwd: 'data',
    defaults: defaultConfig
  });

  return store;
})();

