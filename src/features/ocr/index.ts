import { ImageProcessingService } from '../imageProcessing/imageProcessingService';
import { OcrWorker } from './ocrWorker';
import { nativeImage, NativeImage } from 'electron';
import { ImageDimension } from '../../types/vector.interface';
import { isDevMode, removeBlueTint } from '../../constants/helpers';
import { OcrProgressAction } from '../../types/overlay.interface';
import path from 'path';
import * as os from 'os';
import * as fs from 'fs';

class OcrManager {
  private readonly _imageProcessingService: ImageProcessingService;
  private readonly _ocrWorker: OcrWorker;

  constructor() {
    this._imageProcessingService = new ImageProcessingService();
    this._ocrWorker = new OcrWorker();
  }

  async getTextFromImage(img: NativeImage, imageDimension: ImageDimension, updateProgress?: (progress: OcrProgressAction) => void) {
    try {
      updateProgress?.({ progressText: 'Processing image', active: true });
      const screenshotPath = path.join(os.tmpdir(), `pathOfExile.png`);

      const croppedImage = this._imageProcessingService.cropAndResizeImg(img, imageDimension);
      const croppedImageSize = croppedImage.getSize();
      console.log(croppedImageSize);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.width = croppedImageSize.width;
      canvas.height = croppedImageSize.height;

      const bitmap = croppedImage.toBitmap();
      const pixelArray = removeBlueTint(bitmap);

      const imageData = new ImageData(new Uint8ClampedArray(pixelArray), Math.abs(croppedImageSize.width), Math.abs(croppedImageSize.height));
      const processedImageData = this._imageProcessingService.processImage(imageData, croppedImageSize);

      // ctx.drawImage(canvasImage, 0, 0);
      ctx.putImageData(processedImageData, 0, 0);
      console.log('3');

      const imageSource = canvas.toDataURL('image/png');
      updateProgress?.({ progressText: 'Reading data from image', active: true });
      const ocrText = await this._ocrWorker.recognize(imageSource);

      if (isDevMode()) {
        const imageBuffer = nativeImage.createFromDataURL(imageSource).toPNG();

        await fs.writeFile(screenshotPath, imageBuffer, (err => {
          console.log('Saving file', err);
        }));
      }

      updateProgress?.({ progressText: ocrText, active: false });
    } catch (e) {
      updateProgress?.({ progressText: 'Error occured while processing image', active: false });
      console.error(`Error while getting text from image`, e);
    }
  }
}

export const ocrManager = new OcrManager();
