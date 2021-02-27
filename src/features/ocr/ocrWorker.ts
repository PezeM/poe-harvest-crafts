import { createWorker, Worker } from 'tesseract.js';

export class OcrWorker {
  private readonly _worker: Worker;
  private _workerReady: Promise<boolean>;

  constructor() {
    this._worker = createWorker({
      logger: (c) => console.log(c)
    });

    this._workerReady = new Promise<boolean>(async (resolve, reject) => {
      try {
        const start = Date.now();
        await this._worker.load();
        await this._worker.loadLanguage('eng');
        await this._worker.initialize('eng');
        console.log(`Initialized ocr worker in ${Date.now() - start} ms.`);
        resolve(true);
      } catch (e) {
        console.error(`Couldn't load osr worker.`, e);
        reject(false);
      }
    });
  }

  public async isWorkerReady(): Promise<boolean> {
    return await this._workerReady;
  }

  public async recognize(imageSource: string): Promise<string> {
    await this.isWorkerReady();
    const {
      data: { text }
    } = await this._worker.recognize(imageSource);

    console.log(text);

    return text;
  }
}
