import { KeyToElectron } from '../../constants/keycodes';

export class Shortcut<T extends Function> {
  public readonly callback: T;
  public readonly shortcut?: string;

  constructor(shortcut: string | undefined, callback: T) {
    this.shortcut = shortcut ? Shortcut.toElectronShortcut(shortcut) : shortcut;
    this.callback = callback;
  }

  public static toElectronShortcut(shortcut: string): string {
    return shortcut
      .split(' + ')
      .map(k => KeyToElectron[k as keyof typeof KeyToElectron])
      .join('+');
  }

  call = () => {
    if (!this.shortcut) {
      console.warn(`No shortcut key defined`);
      return;
    }

    this.shortcut.split(' + ')
      .reverse()
      .forEach(key => {
        console.log(key);
      });

    this.callback();
  };
}
