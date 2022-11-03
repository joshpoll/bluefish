import { Canvg, presets } from 'canvg';

const preset = presets.offscreen();

type RasterizeOptions = {
  width: number;
  height: number;
  // quality: number;
  // type: 'image/jpeg' | 'image/png';
};

// TODO: not totally sure what we should return. for now just returning the most flexible thing
export async function rasterize(element: SVGElement, options: RasterizeOptions): Promise<OffscreenCanvas> {
  const canvas = new OffscreenCanvas(options.width, options.height);
  const ctx = canvas.getContext('2d');
  const svg = element.outerHTML;
  const v = await Canvg.from(ctx!, svg, preset);
  await v.render();
  return canvas;

  // return canvas.transferToImageBitmap();
  // return canvas.convertToBlob();
  // const blob = await canvas.convertToBlob();
  // const buffer = await blob.arrayBuffer();
  // return new Uint8ClampedArray(buffer);
  // const pngUrl = URL.createObjectURL(blob);
  // setPngUrl(pngUrl);
}
