import { ImageProcessingService } from '../imageProcessing/imageProcessingService';
import { OcrWorker } from './ocrWorker';
import { nativeImage, NativeImage } from 'electron';
import { ImageDimension } from '../../types/vector.interface';
import { isDevMode, removeBlueTint } from '../../constants/helpers';
import path from 'path';
import * as os from 'os';
import * as fs from 'fs';

function toBase64(arr: Buffer) {
  //arr = new Uint8Array(arr) if it's an ArrayBuffer
  return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ''));
}

class OcrManager {
  private readonly _imageProcessingService: ImageProcessingService;
  private readonly _ocrWorker: OcrWorker;

  constructor() {
    this._imageProcessingService = new ImageProcessingService();
    this._ocrWorker = new OcrWorker();
  }

  async getTextFromImage(img: NativeImage, imageDimension: ImageDimension) {
    console.log('1');
    const screenshotPath = path.join(os.tmpdir(), `pathOfExile.png`);
    console.log(screenshotPath);
    console.log(imageDimension);

    // const croppedImage = this._imageProcessingService.cropAndResizeImg(img, imageDimension);
    const croppedImage = img;
    const croppedImageSize = croppedImage.getSize();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = croppedImageSize.width;
    canvas.height = croppedImageSize.height;

    console.log('loaded');

    console.log('1.5');

    const bitmap = croppedImage.toBitmap();
    const pixelArray = removeBlueTint(bitmap);

    const imageData = new ImageData(new Uint8ClampedArray(pixelArray), croppedImageSize.width, croppedImageSize.height);
    const processedImageData = this._imageProcessingService.processImage(imageData, croppedImageSize);

    // ctx.drawImage(canvasImage, 0, 0);
    ctx.putImageData(processedImageData, 0, 0);
    console.log('3');

    const imageSource = canvas.toDataURL('image/png');
    // await this._ocrWorker.recognize(imageSource);

    console.log('isDevMode', isDevMode());

    if (isDevMode()) {
      const imageBuffer = nativeImage.createFromDataURL(imageSource).toPNG();

      await fs.writeFile(screenshotPath, imageBuffer, (err => {
        console.log('Saving file', err);
      }));
    }
  }
}

export const ocrManager = new OcrManager();
