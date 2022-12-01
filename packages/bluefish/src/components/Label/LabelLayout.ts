import { baseBitmaps, markBitmaps } from './bitmaps';
import scaler from './scaler';
import placeLabel from './placeLabel';
import { BitmapType } from './Bitmap';
import { measureText } from './measureText';
import { NewBBoxClass } from '../../NewBBox';

// 8-bit representation of anchors
const TOP = 0x0,
  MIDDLE = 0x4,
  BOTTOM = 0x8,
  LEFT = 0x0,
  CENTER = 0x1,
  RIGHT = 0x2;

// Mapping from text anchor to number representation
const anchorCode = {
  'top-left': TOP + LEFT,
  top: TOP + CENTER,
  'top-right': TOP + RIGHT,
  left: MIDDLE + LEFT,
  middle: MIDDLE + CENTER,
  right: MIDDLE + RIGHT,
  'bottom-left': BOTTOM + LEFT,
  bottom: BOTTOM + CENTER,
  'bottom-right': BOTTOM + RIGHT,
};

export const Output = ['x', 'y', 'opacity', 'align', 'baseline'] as const;

export const Anchors = [
  'top-left',
  'left',
  'bottom-left',
  'top',
  'bottom',
  'top-right',
  'right',
  'bottom-right',
] as const;

/* ONLY POINT LABELS */

/* TODO: maybe, for consistency, use actual bluefish bbox here instead of calculating on the fly */
const boundary = (d: SVGElement): number[] => {
  // const bbox = d.getBoundingClientRect();
  // getBoundingClientRect() returns the wrong thing! using getBBox() instead
  const bbox = (d as SVGGraphicsElement).getBBox();
  // console.log(`[bbox] ${d.textContent} @ (${d.getAttribute('x')}, ${d.getAttribute('y')})`,
  // JSON.stringify(bbox));

  // console.log('boundary for', d);

  // // TODO: this isn't really right either...
  // const measurements = measureText(d.textContent!, `${d.getAttribute('font-size')} ${d.getAttribute('font-family')}`);
  // const bbox = {
  //   left: parseFloat(d.getAttribute('x')!),
  //   top: parseFloat(d.getAttribute('y')!) - measurements.fontDescent,
  //   width: measurements.width,
  //   height: measurements.fontHeight,
  //   right: parseFloat(d.getAttribute('x')!) + measurements.width,
  //   bottom: parseFloat(d.getAttribute('y')!) - measurements.fontDescent + measurements.fontHeight,
  // };

  // TODO: this might be wrong...
  // if (bbox.left === undefined) bbox.left = 0;
  // if (bbox.top === undefined) bbox.top = 0;
  // if (bbox.right === undefined) bbox.right = 0;
  // if (bbox.bottom === undefined) bbox.bottom = 0;

  return [bbox.x, bbox.x + bbox.width / 2, bbox.x + bbox.width, bbox.y, bbox.y + bbox.height / 2, bbox.y + bbox.height];
};

export default function labelLayout({
  texts,
  size,
  compare,
  offset,
  anchor,
  avoidElements,
  avoidRefElements,
  // lineAnchor,
  // markIndex,
  padding,
}: {
  texts: { label: NewBBoxClass; ref: SVGElement }[];
  size: [number, number];
  compare: ((a: any, b: any) => number) | undefined;
  offset: number[];
  anchor: readonly (keyof typeof anchorCode)[];
  avoidElements: SVGElement[];
  avoidRefElements: boolean;
  /* lineAnchor: any, markIndex: number, */ padding: number;
}) {
  // early exit for empty data
  if (!texts.length) return texts;

  const positions = Math.max(offset.length, anchor.length),
    offsets = getOffsets(offset, positions),
    anchors = getAnchors(anchor, positions),
    // marktype = markType(texts[0]),
    // grouptype = marktype === 'group' && texts[0].items[markIndex].marktype,
    // isGroupArea = grouptype === 'area',
    // boundary = markBoundary(marktype, /* grouptype, lineAnchor, markIndex */),
    $ = scaler(size[0], size[1], padding);

  // prepare text mark data for placing
  const data = texts
    // .map((d) => d.label)
    .map((d) => ({
      datum: d.label,
      opacity: 0,
      boundary: boundary(d.ref),
    }));

  console.log('data', data);

  let bitmaps: [BitmapType, BitmapType | undefined];
  // sort labels in priority order, if comparator is provided
  if (compare) {
    data.sort((a: any, b: any) => compare(a.datum, b.datum));
  }

  // flag indicating if label can be placed inside its base mark
  let labelInside = false;
  for (let i = 0; i < anchors.length && !labelInside; ++i) {
    // label inside if anchor is at center
    // label inside if offset to be inside the mark bound
    labelInside = anchors[i] === 0x5 || offsets[i] < 0;
  }

  // extract data information from base mark when base mark is to be avoided
  // base mark is implicitly avoided if it is a group area
  if (avoidRefElements) {
    avoidElements = texts.map((d) => d.ref).concat(avoidElements);
  }

  console.log('avoidElements', avoidElements);
  // generate bitmaps for layout calculation
  bitmaps = avoidElements.length
    ? markBitmaps($, avoidElements, labelInside /* , isGroupArea */)
    : baseBitmaps($, avoidRefElements !== undefined ? data : undefined);

  console.log('bitmaps', bitmaps);

  // generate label placement function
  // TODO: I'm not sure how this works if bitmap is not set...
  const place = placeLabel($, bitmaps!, anchors, offsets);

  // place all labels
  // data.forEach((d) => d.datum.setAttribute('opacity', `${+place(d)}`));
  data.forEach((d) => place({ bbox: d.datum, boundary: d.boundary }));

  return data;
}

function getOffsets(_: any, count: number) {
  const offsets = new Float64Array(count),
    n = _.length;
  for (let i = 0; i < n; ++i) offsets[i] = _[i] || 0;
  for (let i = n; i < count; ++i) offsets[i] = offsets[n - 1];
  return offsets;
}

function getAnchors(_: any, count: number) {
  const anchors = new Int8Array(count),
    n = _.length;
  for (let i = 0; i < n; ++i) anchors[i] |= anchorCode[_[i] as keyof typeof anchorCode];
  for (let i = n; i < count; ++i) anchors[i] = anchors[n - 1];
  return anchors;
}
