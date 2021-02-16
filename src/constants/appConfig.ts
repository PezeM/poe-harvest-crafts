import devConfig from './appConfig.dev';
import productionConfig from './appConfig.prod';
import { AppConfig } from '../types/config.interface';

const defaultConfig: Partial<AppConfig> = {
  poeWindowName: 'Path of Exile'
};

const config = process.env.NODE_ENV === 'production' ? productionConfig : devConfig;

export default { ...config, ...defaultConfig };
