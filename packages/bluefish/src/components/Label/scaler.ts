import Bitmap, { BitmapType } from './Bitmap';

export type ScalerType = {
  (_: number): number;
  invert(_: number): number;
  bitmap(): BitmapType;
  ratio: number;
  padding: number;
  width: number;
  height: number;
};

export default function scaler(width: number, height: number, padding: number): ScalerType {
  const ratio = Math.max(1, Math.sqrt((width * height) / 1e6)),
    w = ~~((width + 2 * padding + ratio) / ratio),
    h = ~~((height + 2 * padding + ratio) / ratio),
    scale = (_: number) => ~~((_ + padding) / ratio);

  scale.invert = (_: number) => _ * ratio - padding;
  scale.bitmap = () => Bitmap(w, h);
  scale.ratio = ratio;
  scale.padding = padding;
  scale.width = width;
  scale.height = height;

  return scale;
}
