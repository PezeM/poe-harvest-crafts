import { ImageProcessingService } from '../imageProcessing/imageProcessingService';
import { OcrWorker } from './ocrWorker';
import { NativeImage } from 'electron';
import path from 'path';
import os from 'os';
import fs from 'fs';
import { ImageDimension } from '../../types/vector.interface';
import { isDevMode } from '../../constants/helpers';

class OcrManager {
  private readonly _imageProcessingService: ImageProcessingService;
  private readonly _ocrWorker: OcrWorker;

  constructor() {
    this._imageProcessingService = new ImageProcessingService();
    this._ocrWorker = new OcrWorker();
  }

  async getTextFromImage(img: NativeImage, imageDimension: ImageDimension) {
    const screenshotPath = path.join(os.tmpdir(), `pathOfExile.png`);
    console.log(screenshotPath);

    const croppedImage = this._imageProcessingService.cropAndResizeImg(img, imageDimension);
    const imageData = new ImageData(Uint8ClampedArray.from(croppedImage.toBitmap()), imageDimension.width, imageDimension.height);

    // var canvas = document.createElement('canvas');
    // var context = canvas.getContext('2d');
    // canvas.width = imageDimension.width;
    // canvas.height = imageDimension.height;
    const processedImageData = this._imageProcessingService.processImage(imageData, imageDimension);
    // context?.putImageData(processedImageData, 0, 0);

    if (isDevMode()) {
      await fs.writeFile(screenshotPath, processedImageData.data, (err => {
        console.log('Saving file', err);
      }));
    }
  }
}

export const ocrManager = new OcrManager();
