export interface IVector2 {
  x: number;
  y: number;
}

export interface IRectangle {
  width: number;
  height: number;
}

export type ImageDimension = IVector2 & IRectangle;
