import { BitmapType } from './Bitmap';
import { ScalerType } from './scaler';
import { NewBBoxClass } from '../../NewBBox';

// type Boundary = [number, number, number, number, number, number];
type Boundary = number[];

const Aligns = ['right', 'center', 'left'],
  Baselines = ['bottom', 'middle', 'top'];

export default function placeLabel(
  $: ScalerType,
  bitmaps: [BitmapType, BitmapType | undefined],
  anchors: any,
  offsets: any,
) {
  const width = $.width,
    height = $.height,
    bm0 = bitmaps[0],
    bm1 = bitmaps[1],
    n = offsets.length;

  return function (d: { boundary: number[]; bbox: NewBBoxClass }) {
    const boundary = d.boundary;
    const bbox = d.bbox;
    // textHeight = d.datum.fontSize;
    // textHeight = d.datum.getAttribute('font-size');
    // textHeight = +window.getComputedStyle(d.datum).fontSize.slice(0, -2);

    // console.log('d', d);
    // console.log('datum attributes', d.datum.attributes);
    // console.log('datum computed style', window.getComputedStyle(d.datum));
    // console.log('datum computed style', window.getComputedStyle(d.datum).fontSize);
    // console.log('datum computed style', window.getComputedStyle(d.datum).fontSize.slice(0, -2));
    // console.log('boundary', boundary, boundary[2] < 0, boundary[5] < 0, boundary[0] > width, boundary[3] > height);
    // console.log('textHeight', textHeight);
    // console.log('offsets', offsets.length, offsets);

    // can not be placed if the mark is not visible in the graph bound
    if (boundary[2] < 0 || boundary[5] < 0 || boundary[0] > width || boundary[3] > height) {
      return false;
    }

    let /* textWidth = 0, */
      dx: number,
      dy: number,
      isInside,
      sizeFactor,
      insideFactor,
      x1: number,
      x2: number,
      y1: number,
      y2: number,
      xc: number,
      yc: number,
      _x1: number,
      _x2: number,
      _y1: number,
      _y2: number;

    // for each anchor and offset
    for (let i = 0; i < n; ++i) {
      // this masks for the last two bits of the anchor code, which represent the horizontal alignment
      dx = (anchors[i] & 0x3) - 1;
      // this masks for the first two bits of the anchor code, which represent the vertical alignment
      dy = ((anchors[i] >>> 0x2) & 0x3) - 1;

      isInside = (dx === 0 && dy === 0) || offsets[i] < 0;
      sizeFactor = dx && dy ? Math.SQRT1_2 : 1;
      insideFactor = offsets[i] < 0 ? -1 : 1;

      x1 = boundary[1 + dx] + offsets[i] * dx * sizeFactor;
      yc = boundary[4 + dy] + (insideFactor * bbox.height! * dy) / 2 + offsets[i] * dy * sizeFactor;
      y1 = yc - bbox.height! / 2;
      y2 = yc + bbox.height! / 2;

      _x1 = $(x1);
      _y1 = $(y1);
      _y2 = $(y2);

      // if (!textWidth) {
      //   // to avoid finding width of text label,
      //   if (!test(_x1, _x1, _y1, _y2, bm0, bm1, x1, x1, y1, y2, boundary, isInside)) {
      //     // skip this anchor/offset option if we fail to place a label with 1px width
      //     continue;
      //   } else {
      //     // Otherwise, find the label width
      //     // textWidth = textMetrics.width(d.datum, d.datum.text);
      //     // grabbing approximation from vega textMetrics
      //     textWidth = ~~(0.8 * d.datum.textContent!.length * textHeight);
      //   }
      // }

      xc = x1 + (insideFactor * bbox.width! * dx) / 2;
      x1 = xc - bbox.width! / 2;
      x2 = xc + bbox.width! / 2;

      // TODO: this is weird b/c we're scaling x twice
      _x1 = $(x1);
      _x2 = $(x2);

      if (test(_x1, _x2, _y1, _y2, bm0, bm1, x1, x2, y1, y2, boundary, isInside)) {
        // place label if the position is placeable

        const x = !dx ? xc : dx * insideFactor < 0 ? x2 : x1;
        const y = !dy ? yc : dy * insideFactor < 0 ? y2 : y1;
        const align = Aligns[dx * insideFactor + 1];
        const baseline = Baselines[dy * insideFactor + 1];

        if (align === 'right') {
          bbox.right = x;
        } else if (align === 'center') {
          bbox.left = x - bbox.width! / 2;
        } else if (align === 'left') {
          bbox.left = x;
        }

        if (baseline === 'bottom') {
          bbox.bottom = y;
        } else if (baseline === 'middle') {
          bbox.top = y - bbox.height! / 2;
        } else if (baseline === 'top') {
          bbox.top = y;
        }

        bm0.setRange(_x1, _y1, _x2, _y2);
        return true;
      }
    }

    return false;
  };
}

// Test if a label with the given dimensions can be added without overlap
function test(
  _x1: number,
  _x2: number,
  _y1: number,
  _y2: number,
  bm0: BitmapType,
  bm1: BitmapType | undefined,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  boundary: Boundary,
  isInside: boolean,
) {
  console.log('test', _x1, _x2, _y1, _y2, bm0, bm1, x1, x2, y1, y2, boundary, isInside);
  // console.log('test computed values', bm0.outOfBounds(_x1, _y1, _x2, _y2), bm1?.getRange(_x1, _y1, _x2, _y2), !isInMarkBound(x1, y1, x2, y2, boundary), bm0.getRange(_x1, _y1, _x2, _y2));
  return !(
    bm0.outOfBounds(_x1, _y1, _x2, _y2) ||
    (isInside && bm1
      ? bm1.getRange(_x1, _y1, _x2, _y2) || !isInMarkBound(x1, y1, x2, y2, boundary)
      : bm0.getRange(_x1, _y1, _x2, _y2))
  );
}

function isInMarkBound(x1: number, y1: number, x2: number, y2: number, boundary: Boundary) {
  return boundary[0] <= x1 && x2 <= boundary[2] && boundary[3] <= y1 && y2 <= boundary[5];
}
