import devConfig from './app.config.dev';
import productionConfig from './app.config.prod';

const config = process.env.NODE_ENV === 'production' ? productionConfig : devConfig;

export default config;
