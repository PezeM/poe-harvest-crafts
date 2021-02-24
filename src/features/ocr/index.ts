import { ImageProcessingService } from '../imageProcessing/imageProcessingService';
import { OcrWorker } from './ocrWorker';

class OcrManager {
  private readonly _imageProcessingService: ImageProcessingService;
  private readonly _ocrWorker: OcrWorker;

  constructor() {
    this._imageProcessingService = new ImageProcessingService();
    this._ocrWorker = new OcrWorker();
  }
}

export const ocrManager = new OcrManager();
