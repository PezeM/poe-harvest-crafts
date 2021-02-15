import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Config, ConfigKeys, ConfigValue } from '../../types/config.interface';
import { RootState } from '../../store';
import { mainProcess } from '../ipc/mainProcess';

interface ConfigKey {
  key: ConfigKeys;
  value: ConfigValue;
}

const configSlice = createSlice({
  name: 'config',
  initialState: mainProcess.getConfig(),
  reducers: {
    updateConfig(state, action: PayloadAction<Config>) {
      Object.assign(state, action.payload);
      mainProcess.saveConfig(state);
    },
    updateKey(state, action: PayloadAction<ConfigKey>) {
      const { key, value } = action.payload;
      const oldValue = state[key];
      if (oldValue === value) return;

      // @ts-ignore
      state[key] = value;
      mainProcess.saveConfig(state);
    }
  }
});

export const {
  updateKey,
  updateConfig
} = configSlice.actions;

export const selectConfig = (state: RootState) => state.config;

export default configSlice.reducer;
