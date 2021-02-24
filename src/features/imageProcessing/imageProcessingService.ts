import { ImageBlurService } from './imageBlurService';
import { getARGB, setPixels } from '../../constants/helpers';

export class ImageProcessingService {
  private _imageBlurService: ImageBlurService;

  constructor() {
    this._imageBlurService = new ImageBlurService();
  }

  processImage(canvas: HTMLCanvasElement, thresholdLevel = 1, radius = 0.2): any {
    const processedImageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
    if (!processedImageData) return;
    this._imageBlurService.blurARGB(processedImageData.data, canvas, radius);
    this.dilate(processedImageData.data, canvas);
    this.invertColors(processedImageData.data);
    this.thresholdFilter(processedImageData.data, thresholdLevel);
    return processedImageData;
  }

  thresholdFilter(pixels: Uint8ClampedArray, level: number): void {
    const thresh = Math.floor(level * 255);
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      let val;
      if (gray >= thresh) {
        val = 255;
      } else {
        val = 0;
      }
      pixels[i] = pixels[i + 1] = pixels[i + 2] = val;
    }
  }

  invertColors(pixels: Uint8ClampedArray): void {
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = pixels[i] ^ 255; // Invert Red
      pixels[i + 1] = pixels[i + 1] ^ 255; // Invert Green
      pixels[i + 2] = pixels[i + 2] ^ 255; // Invert Blue
    }
  }

  // from https://github.com/processing/p5.js/blob/main/src/image/filters.js
  dilate(pixels: Uint8ClampedArray, canvas: HTMLCanvasElement): void {
    let currIdx = 0;
    const maxIdx = pixels.length ? pixels.length / 4 : 0;
    const out = new Int32Array(maxIdx);
    let currRowIdx, maxRowIdx, colOrig, colOut, currLum;

    let idxRight, idxLeft, idxUp, idxDown;
    let colRight, colLeft, colUp, colDown;
    let lumRight, lumLeft, lumUp, lumDown;

    while (currIdx < maxIdx) {
      currRowIdx = currIdx;
      maxRowIdx = currIdx + canvas.width;
      while (currIdx < maxRowIdx) {
        colOrig = colOut = getARGB(pixels, currIdx);
        idxLeft = currIdx - 1;
        idxRight = currIdx + 1;
        idxUp = currIdx - canvas.width;
        idxDown = currIdx + canvas.width;

        if (idxLeft < currRowIdx) {
          idxLeft = currIdx;
        }
        if (idxRight >= maxRowIdx) {
          idxRight = currIdx;
        }
        if (idxUp < 0) {
          idxUp = 0;
        }
        if (idxDown >= maxIdx) {
          idxDown = currIdx;
        }
        colUp = getARGB(pixels, idxUp);
        colLeft = getARGB(pixels, idxLeft);
        colDown = getARGB(pixels, idxDown);
        colRight = getARGB(pixels, idxRight);

        //compute luminance
        currLum = 77 * ((colOrig >> 16) & 0xff) + 151 * ((colOrig >> 8) & 0xff) + 28 * (colOrig & 0xff);
        lumLeft = 77 * ((colLeft >> 16) & 0xff) + 151 * ((colLeft >> 8) & 0xff) + 28 * (colLeft & 0xff);
        lumRight = 77 * ((colRight >> 16) & 0xff) + 151 * ((colRight >> 8) & 0xff) + 28 * (colRight & 0xff);
        lumUp = 77 * ((colUp >> 16) & 0xff) + 151 * ((colUp >> 8) & 0xff) + 28 * (colUp & 0xff);
        lumDown = 77 * ((colDown >> 16) & 0xff) + 151 * ((colDown >> 8) & 0xff) + 28 * (colDown & 0xff);

        if (lumLeft > currLum) {
          colOut = colLeft;
          currLum = lumLeft;
        }
        if (lumRight > currLum) {
          colOut = colRight;
          currLum = lumRight;
        }
        if (lumUp > currLum) {
          colOut = colUp;
          currLum = lumUp;
        }
        if (lumDown > currLum) {
          colOut = colDown;
          currLum = lumDown;
        }
        out[currIdx++] = colOut;
      }
    }

    setPixels(pixels, out);
  }
}
