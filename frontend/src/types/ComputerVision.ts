export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
  match: boolean;
};

export type OCRBox = {
  rectangle: Rectangle;
  text: string;
};
