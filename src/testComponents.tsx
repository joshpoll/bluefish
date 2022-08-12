import { rect, svg, text, row, blob, col, arrow, arrowRef, group, blobPaperJS, align } from './component';
import { Component } from './componentTypes';
import { background, boundaryLabel, padding, position, position2 } from './modifier';
import { Path, Point, PaperScope } from 'paper';
import { Size } from 'paper/dist/paper-core';

// /* { spacing: 5 } */

export const testRow = svg([
  row({ totalWidth: 300, alignment: 'top' }, [
    rect({ width: 100, height: 100, fill: 'firebrick' }),
    rect({ width: 50, height: 200, fill: 'cornflowerblue' }),
    blob(
      {
        seed: Math.random(),
        extraPoints: 8,
        randomness: 4,
        // size: 60,
        size: 100,
      },
      {
        fill: 'cornflowerblue',
        stroke: 'black',
        strokeWidth: 3,
      },
    ).mod(padding(15)),
    rect({ width: 50, height: 50, fill: 'coral' }),
  ]),
]);

export const testCol = svg([
  col({ totalHeight: 500, alignment: 'left' }, [
    rect({ width: 100, height: 100, fill: 'firebrick' }),
    rect({ width: 50, height: 200, fill: 'cornflowerblue' }),
    blob(
      {
        seed: Math.random(),
        extraPoints: 8,
        randomness: 4,
        // size: 60,
        size: 100,
      },
      {
        fill: 'cornflowerblue',
        stroke: 'black',
        strokeWidth: 3,
      },
    ).mod(padding(15)),
    rect({ width: 50, height: 50, fill: 'coral' }),
  ]),
]);

export const testComponent = svg([
  rect({ x: 10, y: 10, width: 100, height: 100, fill: 'firebrick' }),
  text('y = mx + 1', { x: 30, y: 200, fontSize: '20px' }),
]);

export const annotatedEquation = svg([
  text('FORMULA', { x: 60, y: 150, fontSize: 60, fill: 'gray' }),
  group([
    rect({ x: 10, y: 200, width: 400, height: 5, fill: 'gray' }),
    rect({ x: 10, y: 200, width: 5, height: 20, fill: 'gray' }),
    rect({ x: 10 + 400, y: 200, width: 5, height: 20, fill: 'gray' }),
  ]),
  text('y = mx + 1', { x: 30, y: 200, fontSize: '80px' }),
  row({ x: 10, y: 350, spacing: 10, alignment: 'bottom' }, [
    text('identifier', { fontSize: '20px' }).mod(padding({ left: 10, right: 10 })),
    text('expression', { fontSize: '20px' }),
    text('operator', { fontSize: '20px' }),
    text('numeric literal', { fontSize: '20px' }),
  ]),
  arrow(
    { from: { x: 50, y: 350 }, to: { x: 40, y: 300 } },
    { padStart: 0, padEnd: 0, arrowTail: false, arrowHead: false, stretch: 0 },
  ),
  arrow(
    { from: { x: 175, y: 350 }, to: { x: 220, y: 280 } },
    { padStart: 0, padEnd: 0, arrowTail: false, arrowHead: false, stretch: 0 },
  ),
  arrow(
    { from: { x: 250, y: 350 }, to: { x: 320, y: 280 } },
    { padStart: 0, padEnd: 0, arrowTail: false, arrowHead: false, stretch: 0 },
  ),
  arrow(
    { from: { x: 375, y: 350 }, to: { x: 380, y: 280 } },
    { padStart: 0, padEnd: 0, arrowTail: false, arrowHead: false, stretch: 0 },
  ),
]);

const X = text('X', { x: 128, y: 150, fontWeight: 'bold', fontSize: '20px' });
const XLabel = text('f^{-1}(N)\nlives here!', { fontSize: '20px' });

type BlobbySetOptions = {
  size: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
};

const blobbySet = (name: string, options: BlobbySetOptions) => {
  return blob(
    {
      seed: Math.random(),
      extraPoints: 8,
      randomness: 4,
      size: options.size,
    },
    {
      fill: options.fill,
      stroke: options.stroke,
      strokeWidth: options.strokeWidth,
    },
  ).mod(boundaryLabel(name, { dy: '-1.5%', fontSize: '20px', startOffset: '30%', method: 'align' }), padding(20));
};

const XFloating = text('X', { fontWeight: 'bold', fontSize: '20px' });

export const annotatedDiagram = svg([
  col({ spacing: 0, alignment: 'center' }, [
    blobbySet('Lebesgue measurable sets', {
      size: 200,
      fill: 'rgb(225, 248, 226)',
      stroke: 'black',
      strokeWidth: 2,
    }),
    XLabel,
  ]),
  row({ x: 40, y: 65, spacing: 10, alignment: 'middle' }, [
    // blob(
    //   {
    //     seed: Math.random(),
    //     extraPoints: 8,
    //     randomness: 4,
    //     size: 75,
    //   },
    //   {
    //     fill: 'rgb(175, 234, 179)',
    //     stroke: 'black',
    //     strokeWidth: 2,
    //   },
    // ),
    blobbySet('Borel sets', { size: 75, fill: 'rgb(175, 234, 179)', stroke: 'black', strokeWidth: 2 }),
    XFloating,
  ]),
  arrowRef(
    { from: { ref: XLabel, port: 'n' }, to: { ref: XFloating, port: 's' } },
    { padStart: 10, padEnd: 20, flip: true },
  ),
]);

export const testArrow = svg([arrow({ from: { x: 64, y: 64 }, to: { x: 128, y: 96 } })]);

const formula = 'y = mx + 1'.split(' ');
const formulaText = formula.map((symbol) => text(symbol, { fontSize: '80px' }));

const labels = ['identifier', 'expression', 'operator', 'numeric literal'];
const labelText = labels.map((label) => text(label, { fontSize: '20px' }));

const labelToFormula = [
  { label: labelText[0], formula: formulaText[0] },
  { label: labelText[1], formula: formulaText[2] },
  { label: labelText[2], formula: formulaText[3] },
  { label: labelText[3], formula: formulaText[4] },
];
const labelToFormulaArrows = labelToFormula.map(({ label, formula }) =>
  arrowRef(
    { from: { ref: label, port: 'n' }, to: { ref: formula, port: 's' } },
    { padStart: 0, padEnd: 0, arrowTail: false, arrowHead: false, stretch: 0 },
  ),
);

export const annotatedEquationRef = svg([
  text('FORMULA', { x: 60, y: 150, fontSize: 60, fill: 'gray' }),
  group([
    rect({ x: 10, y: 200, width: 400, height: 5, fill: 'gray' }),
    rect({ x: 10, y: 200, width: 5, height: 20, fill: 'gray' }),
    rect({ x: 10 + 400, y: 200, width: 5, height: 20, fill: 'gray' }),
  ]),
  row({ x: 30, y: 200, spacing: 20, alignment: 'middle' }, formulaText),
  row({ x: 10, y: 350, spacing: 10, alignment: 'bottom' }, labelText),
  group(labelToFormulaArrows),
]);

namespace BertinHotel {
  export const cw = 50;
}

const data = [20, 10, 30];

export const bertinHotel = svg([
  row(
    { spacing: 0, alignment: 'bottom' },
    data.map((d) => rect({ width: BertinHotel.cw, height: d * 2, fill: 'white', stroke: 'black' })),
  ).mod(padding(10)),
]);

// export const annotatedDiagramSeparated = svg([
//   col({ spacing: 40, alignment: 'center' }, [blobbySet('Lebesgue measurable sets'), XLabel]),
//   row({ spacing: 10, alignment: 'middle' }, [
//     blob(
//       {
//         seed: Math.random(),
//         extraPoints: 8,
//         randomness: 4,
//         size: 75,
//       },
//       {
//         fill: 'rgb(175, 234, 179)',
//         stroke: 'black',
//         strokeWidth: 2,
//       },
//     ).mod(position({ x: 50, y: 75 })),
//     X,
//   ]),
//   group(
//     [{ from: XLabel, to: X }].map(({ from, to }) =>
//       arrowRef(
//         { from: { ref: from, port: 'n' }, to: { ref: to, port: 's' } },
//         { padStart: 10, padEnd: 10, flip: true },
//       ),
//     ),
//   ),
// ]);

// advantage of the "everything is a component" approach! since everything's the same type we can
// compose forever. also we never need to consider relations directly, since they are just groups of
// objects with relations between them
type Relations<T> = (components: { [key in keyof T]: Component }) => Component | Component[];

const group2 = <T extends Component[] | Record<string, Component>>(
  components: T,
  relations?: Relations<T>,
): Component => {
  return null as any;
};

group2(
  [
    rect({ width: 400, height: 5, fill: 'gray' }),
    rect({ width: 5, height: 20, fill: 'gray' }),
    rect({ width: 5, height: 20, fill: 'gray' }),
  ],
  ([left, middle, right]) => [
    row({ spacing: 5, alignment: 'middle' }, [left, middle]),
    row({ spacing: 5, alignment: 'middle' }, [middle, right]),
    arrowRef({ from: { ref: left, port: 'w' }, to: { ref: right, port: 'e' } }),
  ],
);

// group2 basically provides an eta-expanded interface.
// tho it's not quite eta expansion... maybe it has some other name...
// f(x) ~> (\x -> f(x)) x
// the benefit here is using the second notation we can more easily do the following
// (\x -> f(x)) x ~> (\x -> [f(x), g(x)]) x
// we would otherwise have to make a new local binding for x, which would probably have to be
// hoisted out of the function definition entirely, which could be very far away. Here, the lambda
// abstraction is acting as a local let binding.
// eta-expanded form has another benefit, which is that we can send the function other things we
// want i.e. we can intercept between the user giving us a value and actually applying it.
// export const annotatedDiagramSeparatedGroup2 = svg([
//   group2([blobbySet('Lebesgue measurable sets'), XLabel], ([set, label]) =>
//     col({ spacing: 40, alignment: 'center' }, [set, label]),
//   ),
//   row({ spacing: 10, alignment: 'middle' }, [
//     blob(
//       {
//         seed: Math.random(),
//         extraPoints: 8,
//         randomness: 4,
//         size: 75,
//       },
//       {
//         fill: 'rgb(175, 234, 179)',
//         stroke: 'black',
//         strokeWidth: 2,
//       },
//     ).mod(position({ x: 50, y: 75 })),
//     X,
//   ]),
//   group2(
//     {
//       from: XLabel,
//       to: X,
//     },
//     ({ from, to }) =>
//       arrowRef(
//         { from: { ref: from, port: 'n' }, to: { ref: to, port: 's' } },
//         { padStart: 10, padEnd: 10, flip: true },
//       ),
//   ),
// ]);

const canvas = document.createElement('canvas');
const paperScope = new PaperScope();
paperScope.setup(canvas);
const dims = {
  x: 50,
  y: 25,
  width: 200,
  height: 100,
};
let myPath = new Path.Rectangle(new Point(dims.x, dims.y), new Size(dims.width, dims.height));
// const myPath = new Path();
// myPath.add(new Point(50, 75));
// myPath.add(new Point(50, 25));
// myPath.add(new Point(150, 25));
// myPath.add(new Point(150, 75));
myPath.insert(4, new Point(dims.x + dims.width / 2, dims.y + dims.height - (dims.height * 5) / 50));

const dims2 = {
  x: 50 + 16,
  y: 50 + 16,
  width: 100,
  height: 50,
};
let myPath2 = new Path.Rectangle(new Point(dims2.x, dims2.y), new Size(dims2.width, dims2.height));
myPath2.insert(2, new Point(dims2.x + dims2.width / 2, dims2.y + (dims2.height * 5) / 50));
myPath2.insert(5, new Point(dims2.x + dims2.width / 2, dims2.y + dims2.height - (dims2.height * 5) / 50));

export const blobPaperJSTest = svg([
  blobPaperJS(myPath, { fill: 'rgb(225, 248, 226)', stroke: 'black', strokeWidth: 1 }).mod(
    boundaryLabel('Lebesgue measurable sets', { dy: '-1.5%', fontSize: '16px', startOffset: '20%', method: 'align' }),
    padding(16),
  ),
  blobPaperJS(myPath2, { fill: 'rgb(175, 234, 179)', stroke: 'black', strokeWidth: 1 }).mod((blob) =>
    //   center([blob, text('Borel sets')]),
    align('center', [blob, text('Borel sets')]),
  ),
  text('Borel sets', { x: dims2.x + 15, y: dims2.y + dims2.height / 2 - 8, fontWeight: 'bold', fontSize: '14px' }),
]);
