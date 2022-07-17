import { rect, svg, text, row, blob } from './component';
import { padding } from './modifier';

// /* { spacing: 5 } */

export const testRow = svg([
  row({ totalWidth: 300 }, 'top', [
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
  row({ x: 10, y: 350, spacing: 10 }, 'bottom', [
    text('identifier', { fontSize: '20px' }).mod(padding({ left: 10, right: 10 })),
    text('expression', { fontSize: '20px' }),
    text('operator', { fontSize: '20px' }),
    text('numeric literal', { fontSize: '20px' }),
  ]),
]);

export const annotatedDiagram = svg([
  blob(
    {
      seed: Math.random(),
      extraPoints: 8,
      randomness: 4,
      size: 200,
    },
    {
      fill: 'cornflowerblue',
      stroke: 'black',
      strokeWidth: 3,
    },
  ).mod(padding(15)),
]);
