import { Path, Point, PaperScope } from 'paper';

export function blob() {
  const myPath = new Path();
  myPath.add(new Point(50, 75));
  myPath.add(new Point(50, 25));
  myPath.add(new Point(150, 25));
  myPath.add(new Point(150, 75));
  myPath.add(new Point(100, 70));

  console.log('segments', (myPath.exportSVG() as SVGElement).getAttribute('d'), myPath.segments);

  myPath.closed = true;

  console.log('segments (closed)', (myPath.exportSVG() as SVGElement).getAttribute('d'), myPath.segments);

  myPath.smooth({ type: 'continuous' });

  console.log('segments (closed, smoothed)', (myPath.exportSVG() as SVGElement).getAttribute('d'), myPath.segments);
}
// static variables
export namespace blob {
  // setup paper canvas
  const canvas = document.createElement('canvas');
  const paperScope = new PaperScope();
  paperScope.setup(canvas);
}

/* 
TODO:
1. make a paperjs blob component based on this that just renders the same shape every time
2. modify the component so that we start with a rectangle of specified dimension then add some
   points to it using `insert`. (no randomness)
3. add some randomness
4. do bbox computations correctly. is there a way to control the size?
*/
