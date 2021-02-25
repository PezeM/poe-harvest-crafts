import { BrowserWindow, ipcMain, screen } from 'electron';
import { IPC_EVENTS } from '../../constants/ipc/events';

export function initializeIpcListeners(_mainWindow: BrowserWindow) {
  ipcMain.on(IPC_EVENTS.GET_SCREEN_DIMENSION, e => {
    e.returnValue = screen.getPrimaryDisplay().workAreaSize;
  });
}
