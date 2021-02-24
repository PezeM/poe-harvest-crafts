export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getARGB = (data: Uint8ClampedArray, i: number): number => {
  const offset = i * 4;
  return (
    ((data[offset + 3] << 24) & 0xff000000) | ((data[offset] << 16) & 0x00ff0000) | ((data[offset + 1] << 8) & 0x0000ff00) | (data[offset + 2] & 0x000000ff)
  );
};


export const setPixels = (pixels: Uint8ClampedArray, data: Int32Array): void => {
  let offset = 0;

  for (let i = 0, al = pixels.length; i < al; i++) {
    offset = i * 4;
    pixels[offset] = (data[i] & 0x00ff0000) >>> 16;
    pixels[offset + 1] = (data[i] & 0x0000ff00) >>> 8;
    pixels[offset + 2] = data[i] & 0x000000ff;
    pixels[offset + 3] = (data[i] & 0xff000000) >>> 24;
  }
};

export const isDevMode = (): boolean => process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
