import { draw, drawAll } from './rasterize';
import { ScalerType } from './scaler';
import { BitmapType } from './Bitmap';
// bit mask for getting first 2 bytes of alpha value
const ALPHA_MASK = 0xff000000;

// alpha value equivalent to opacity 0.0625
const INSIDE_OPACITY_IN_ALPHA = 0x10000000;
const INSIDE_OPACITY = 0.0625;

export function baseBitmaps($: ScalerType, data: any[] | undefined): [BitmapType, BitmapType | undefined] {
  const bitmap = $.bitmap();
  // when there is no base mark but data points are to be avoided
  (data || []).forEach((d) => bitmap.set($(d.boundary[0]), $(d.boundary[3])));
  return [bitmap, undefined];
}

export function markBitmaps(
  $: ScalerType,
  avoidMarks: SVGElement[],
  labelInside: any /* , isGroupArea: any */,
): [BitmapType, BitmapType] {
  // create canvas
  const width = $.width,
    height = $.height,
    border = labelInside /*  || isGroupArea */,
    canvas = document.createElement('canvas');

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  const scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
  canvas.width = width * scale;
  canvas.height = height * scale;

  // canvas.width = width;
  // canvas.height = height;

  // document.body.appendChild(canvas);

  const context = canvas.getContext('2d')!;

  context.scale(scale, scale);

  // render all marks to be avoided into canvas
  // TODO: add back border???
  // avoidMarks.forEach(item => draw(context, item/* , border */));
  drawAll(context, avoidMarks);
  // avoidMarks.forEach(item => rasterizeWithContext(item, context, { width, height }));

  document.body.appendChild(canvas);

  // get canvas buffer, create bitmaps
  const buffer = new Uint32Array(context.getImageData(0, 0, width, height).data.buffer),
    layer1 = $.bitmap(),
    layer2 = border && $.bitmap();

  // populate bitmap layers
  let x, y, u, v, alpha;
  for (y = 0; y < height; ++y) {
    for (x = 0; x < width; ++x) {
      alpha = buffer[y * width + x] & ALPHA_MASK;
      if (alpha) {
        u = $(x);
        v = $(y);
        /* if (!isGroupArea) */ layer1.set(u, v); // update interior bitmap
        if (border && alpha ^ INSIDE_OPACITY_IN_ALPHA) layer2.set(u, v); // update border bitmap
      }
    }
  }

  return [layer1, layer2];
}

// function draw(context: any, items: any, interior: any) {
//   if (!items.length) return;
//   const type = items[0].mark.marktype;

//   if (type === 'group') {
//     items.forEach((group: any) => {
//       group.items.forEach((mark: any) => draw(context, mark.items, interior));
//     });
//   } else {
//     if (interior) {
//       items.forEach((item: any) => {
//         draw(context, prepare(item));
//       });
//     }
//     Marks[type].draw(context, { items: interior ? items.map(prepare) : items });
//   }
// }

// /**
//  * Prepare item before drawing into canvas (setting stroke and opacity)
//  * @param {object} source item to be prepared
//  * @returns prepared item
//  */
// function prepare(/* source */item: any) {
//   // const item = rederive(source, {});

//   if (item.stroke) {
//     item.strokeOpacity = 1;
//   }

//   if (item.fill) {
//     item.fillOpacity = INSIDE_OPACITY;
//     item.stroke = '#000';
//     item.strokeOpacity = 1;
//     item.strokeWidth = 2;
//   }

//   return item;
// }
