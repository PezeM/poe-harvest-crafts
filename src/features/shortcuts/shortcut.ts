export class Shortcut<T extends Function> {
  public readonly callback: T;
  public readonly shortcut?: string;

  constructor(shortcut: string | undefined, callback: T) {
    this.shortcut = shortcut;
    this.callback = callback;
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
