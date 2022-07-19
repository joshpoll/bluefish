import { rect, svg, text, row, blob, col, arrow, arrowRef } from './component';
import { background, padding, position } from './modifier';

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
  rect({ x: 10, y: 200, width: 400, height: 5, fill: 'gray' }),
  rect({ x: 10, y: 200, width: 5, height: 20, fill: 'gray' }),
  rect({ x: 10 + 400, y: 200, width: 5, height: 20, fill: 'gray' }),
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

export const annotatedDiagram = svg([
  col({ spacing: 40, alignment: 'center' }, [
    blob(
      {
        seed: Math.random(),
        extraPoints: 8,
        randomness: 4,
        size: 200,
      },
      {
        fill: 'rgb(225, 248, 226)',
        stroke: 'black',
        strokeWidth: 2,
      },
    ).mod(padding(20)),
    text('f^{-1}(N)\nlives here!', { fontSize: '20px' }),
  ]),
  blob(
    {
      seed: Math.random(),
      extraPoints: 8,
      randomness: 4,
      size: 75,
    },
    {
      fill: 'rgb(175, 234, 179)',
      stroke: 'black',
      strokeWidth: 2,
    },
  ).mod(position({ x: 50, y: 75 })),
  arrow({ from: { x: 150, y: 275 }, to: { x: 128, y: 150 } }, { padStart: 0, padEnd: 40 }),
  text('X', { fontWeight: 'bold', fontSize: '20px' }).mod(position({ x: 128, y: 150 })),
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
  rect({ x: 10, y: 200, width: 400, height: 5, fill: 'gray' }),
  rect({ x: 10, y: 200, width: 5, height: 20, fill: 'gray' }),
  rect({ x: 10 + 400, y: 200, width: 5, height: 20, fill: 'gray' }),
  row({ x: 30, y: 200, spacing: 20, alignment: 'middle' }, formulaText),
  row({ x: 10, y: 350, spacing: 10, alignment: 'bottom' }, labelText),
  ...labelToFormulaArrows,
]);
