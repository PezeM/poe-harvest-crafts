import { getARGB, setPixels } from '../../constants/helpers';

export class ImageBlurService {
  private _blurRadius = 0;
  private _blurKernelSize = 0;
  private _blurKernel: Int32Array = new Int32Array();
  private _blurMult: Int32Array[] = [];

  constructor() {
    this.initializeProperties();
  }

  blurARGB(pixels: Uint8ClampedArray, canvas: HTMLCanvasElement, radius: number) {
    this.initializeProperties();
    const width = canvas.width;
    const height = canvas.height;
    const numPackedPixels = width * height;
    const argb = new Int32Array(numPackedPixels);
    for (let j = 0; j < numPackedPixels; j++) {
      argb[j] = getARGB(pixels, j);
    }
    let sum, cr, cg, cb, ca;
    let read, ri, ym, ymi, bk0;
    const a2 = new Int32Array(numPackedPixels);
    const r2 = new Int32Array(numPackedPixels);
    const g2 = new Int32Array(numPackedPixels);
    const b2 = new Int32Array(numPackedPixels);
    let yi = 0;
    this.buildBlurKernel(radius);
    let x, y, i;
    let bm;
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        cb = cg = cr = ca = sum = 0;
        read = x - this._blurRadius;
        if (read < 0) {
          bk0 = -read;
          read = 0;
        } else {
          if (read >= width) {
            break;
          }
          bk0 = 0;
        }
        for (i = bk0; i < this._blurKernelSize; i++) {
          if (read >= width) {
            break;
          }
          const c = argb[read + yi];
          bm = this._blurMult[i];
          ca += bm[(c & -16777216) >>> 24];
          cr += bm[(c & 16711680) >> 16];
          cg += bm[(c & 65280) >> 8];
          cb += bm[c & 255];
          sum += this._blurKernel[i];
          read++;
        }
        ri = yi + x;
        a2[ri] = ca / sum;
        r2[ri] = cr / sum;
        g2[ri] = cg / sum;
        b2[ri] = cb / sum;
      }
      yi += width;
    }
    yi = 0;
    ym = -this._blurRadius;
    ymi = ym * width;
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        cb = cg = cr = ca = sum = 0;
        if (ym < 0) {
          bk0 = ri = -ym;
          read = x;
        } else {
          if (ym >= height) {
            break;
          }
          bk0 = 0;
          ri = ym;
          read = x + ymi;
        }
        for (i = bk0; i < this._blurKernelSize; i++) {
          if (ri >= height) {
            break;
          }
          bm = this._blurMult[i];
          ca += bm[a2[read]];
          cr += bm[r2[read]];
          cg += bm[g2[read]];
          cb += bm[b2[read]];
          sum += this._blurKernel[i];
          ri++;
          read += width;
        }
        argb[x + yi] = ((ca / sum) << 24) | ((cr / sum) << 16) | ((cg / sum) << 8) | (cb / sum);
      }
      yi += width;
      ymi += width;
      ym++;
    }

    setPixels(pixels, argb);
  }

  private buildBlurKernel(r: number) {
    let radius = (r * 3.5) | 0;
    radius = radius < 1 ? 1 : radius < 248 ? radius : 248;

    if (this._blurRadius !== radius) {
      this._blurRadius = radius;
      this._blurKernelSize = (1 + this._blurRadius) << 1;
      this._blurKernel = new Int32Array(this._blurKernelSize);
      this._blurMult = new Array(this._blurKernelSize);
      for (let l = 0; l < this._blurKernelSize; l++) {
        this._blurMult[l] = new Int32Array(256);
      }

      let bm, bmi, bki;

      for (let i = 1, radiusi = radius - 1; i < radius; i++) {
        this._blurKernel[radius + i] = this._blurKernel[radiusi] = bki = radiusi * radiusi;
        bm = this._blurMult[radius + i];
        bmi = this._blurMult[radiusi--];
        for (let j = 0; j < 256; j++) {
          bm[j] = bmi[j] = bki * j;
        }
      }

      const bk = (this._blurKernel[radius] = radius * radius);
      bm = this._blurMult[radius];

      for (let k = 0; k < 256; k++) {
        bm[k] = bk * k;
      }
    }
  }

  private initializeProperties() {
    this._blurRadius = 0;
    this._blurKernelSize = 0;
    this._blurKernel = new Int32Array();
    this._blurMult = [];
  }
}
