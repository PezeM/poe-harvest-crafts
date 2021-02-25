import devConfig from './appConfig.dev';
import productionConfig from './appConfig.prod';
import { AppConfig } from '../types/config.interface';

const defaultConfig: AppConfig = {
  poeWindowName: 'Path of Exile',
  dataFolderName: 'phc-data',
  minOcrHeight: 50,
  minOcrWidth: 50
};

const config = process.env.NODE_ENV === 'production' ? productionConfig : devConfig;

export default { ...config, ...defaultConfig };
