export interface AppConfig {
  poeWindowName: string;
  dataFolderName: string;
  minOcrWidth: number;
  minOcrHeight: number;
}

export interface Config {
  leagueId?: string;
  clientLog?: string;
  logLevel: string;
  language?: string;
}

export type ConfigKeys = keyof Config;
export type ConfigValue = Config[ConfigKeys];
