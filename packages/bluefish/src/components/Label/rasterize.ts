import { Canvg, presets, RenderingContext2D } from 'canvg';

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

export async function draw(context: RenderingContext2D, element: SVGElement): Promise<void> {
  const svg = element.outerHTML;
  console.log('svg', svg);
  const v = await Canvg.from(context, svg, preset);
  await v.render();
}

export async function drawAll(context: RenderingContext2D, elements: SVGElement[]): Promise<void> {
  const svgs = elements.map((e) => e.outerHTML);
  const v = await Canvg.from(context, `<g>${svgs.join('\n')}</g>`, preset);
  await v.render();
}
