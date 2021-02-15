export interface UserConfig {
  leagueId?: string;
  clientLog?: string;
  logLevel: string;
  language?: string;
}

export type UserConfigKeys = keyof UserConfig;
export type UserConfigValues = UserConfig[UserConfigKeys];
