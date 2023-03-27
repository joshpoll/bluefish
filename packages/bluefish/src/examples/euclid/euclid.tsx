// Byrne's diagram

import { Constraints, Measure, useBluefishLayout, useName, withBluefish } from '../../bluefish';
import { Align, Circle, Connector, Group, Padding, Ref } from '../../main';
import { Distribute } from '../../components/Distribute';
import { AlignNew } from '../../components/AlignNew';
import { PaperScope } from 'paper/dist/paper-core';

/* 
operators TODO:
- Square: easy way is to read the first two points and then compute the positions of the last two
  (could definitely generalize that but good enough for now..)
- Perpendicular: the most robust way is to somehow accumulate constraints and then solve when we
  have enough of them...
- Intersect: compute intersection of two input boundaries, then make a new component labeled "point"
- Hidden: set visibility to hidden on the child/children
- PerpendicularBisector
*/

export const Point = withBluefish((props: any) => {
  // TODO: incorporate labels? maybe just punt to PointLabel?
  return <Circle r={5} fill={props.fill ?? 'black'} />;
});

// TODO: this component doesn't work because distribute doesn't use centers...
// maybe circles should have no extent? idk
export const Offset = withBluefish((props: any) => {
  return (
    <Group>
      {props.children}
      <Distribute spacing={props.horizontal} direction="horizontal">
        <Ref select={props.children[0]} />
        <Ref select={props.children[1]} />
      </Distribute>
      <Distribute spacing={props.vertical} direction="vertical">
        <Ref select={props.children[0]} />
        <Ref select={props.children[1]} />
      </Distribute>
    </Group>
  );
});

// export const Perpendicular = withBluefish((props: any) => {});

const squareMeasurePolicy = (options: any): Measure => {
  const canvas = document.createElement('canvas');
  const paperScope = new PaperScope();
  paperScope.setup(canvas);
  return (measurables, constraints: Constraints) => {
    const placeables = measurables.map((measurable) => measurable.measure(constraints));

    // assume there are exactly four placeables
    const [a, b, c, d] = placeables;

    // TODO: this is a bit brittle, but it's good enough for now
    // assume the first two points have already been positioned, and the last two are to be positioned
    // based on the first two
    // get the centers of a and b
    const aCenter = {
      x: a!.left! + a!.width! / 2,
      y: a!.top! + a!.height! / 2,
    };
    const bCenter = {
      x: b!.left! + b!.width! / 2,
      y: b!.top! + b!.height! / 2,
    };

    // compute the vector from a to b
    const ab = {
      x: bCenter.x - aCenter.x,
      y: bCenter.y - aCenter.y,
    };

    if (options.flip) {
      ab.x = -ab.x;
      ab.y = -ab.y;
    }

    // compute the positions of c and d
    const cCenter = {
      x: aCenter.x - ab.y,
      y: aCenter.y + ab.x,
    };

    const dCenter = {
      x: bCenter.x - ab.y,
      y: bCenter.y + ab.x,
    };

    // set the positions of c and d
    c.left = cCenter.x - c!.width! / 2;
    c.top = cCenter.y - c!.height! / 2;
    d.left = dCenter.x - d!.width! / 2;
    d.top = dCenter.y - d!.height! / 2;

    // create a new Paper path between the points
    const path = new paperScope.Path();
    path.add(new paperScope.Point(aCenter.x, aCenter.y));
    path.add(new paperScope.Point(bCenter.x, bCenter.y));
    path.add(new paperScope.Point(dCenter.x, dCenter.y));
    path.add(new paperScope.Point(cCenter.x, cCenter.y));

    const bounds = path.bounds;

    return {
      // left: Math.min(a!.left!, b!.left!, c!.left!, d!.left!),
      // top: Math.min(a!.top!, b!.top!, c!.top!, d!.top!),
      // width: Math.max(a!.left! + a!.width!, b!.left! + b!.width!, c!.left! + c!.width!, d!.left! + d!.width!),
      // height: Math.max(a!.top! + a!.height!, b!.top! + b!.height!, c!.top! + c!.height!, d!.top!
      // + d!.height!),
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
      boundary: path,
    };
  };
};

export const Square = withBluefish((props: any) => {
  // const { name, ...rest } = props;
  const { id, domRef, children, bbox, boundary } = useBluefishLayout({}, props, squareMeasurePolicy(props));

  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox!.coord?.translate?.x ?? 0}, ${bbox!.coord?.translate?.y ?? 0})`}
    >
      {children}
      <path d={boundary?.pathData} fill={props.fill ?? 'none'} />
    </g>
  );
});

export const Euclid = withBluefish((props: any) => {
  const a = useName('a');
  const b = useName('b');
  const c = useName('c');
  const bc = useName('bc');
  const d = useName('d');
  const e = useName('e');
  const square3 = useName('square3');
  const f = useName('f');
  const g = useName('g');
  const h = useName('h');
  const k = useName('k');
  const l = useName('l');

  return (
    <Padding all={20}>
      <Group>
        <Point name={a} fill="none" />
        <Point name={b} fill="none" />
        <Point name={c} fill="none" />
        <Offset horizontal={30} vertical={-30}>
          <Ref select={a} />
          <Ref select={b} />
        </Offset>
        {/* <AlignNew alignment="centerHorizontally">
        <Ref select={b} />
        <Ref select={c} />
      </AlignNew> */}
        {/* kind of a hack here b/c align works only on cartesian coordinates */}
        {/* <Perpendicular>
        <Ref select={a} />
        <Ref select={b} />
        <Ref select={c} />
      </Perpendicular> */}
        {/* TODO: just eyeballing the perpendicular for now... LOL */}
        <Offset horizontal={30} vertical={45}>
          <Ref select={b} />
          <Ref select={c} />
        </Offset>
        <Connector stroke="yellow" strokeWidth="3">
          <Ref select={a} />
          <Ref select={b} />
        </Connector>
        <Connector name={bc} stroke="blue" strokeWidth="3">
          <Ref select={b} />
          <Ref select={c} />
        </Connector>
        <Connector stroke="red" strokeWidth="3">
          <Ref select={c} />
          <Ref select={a} />
        </Connector>
        {/* triangle is complete! */}
        <Square flip fill="black">
          <Ref select={a} />
          <Ref select={b} />
          <Point name={f} fill="none" />
          <Point name={g} fill="none" />
        </Square>
        {/* <Connector stroke="black" strokeWidth="3">
          <Ref select={a} />
          <Ref select={f} />
        </Connector>
        <Connector stroke="black" strokeWidth="3">
          <Ref select={f} />
          <Ref select={g} />
        </Connector>
        <Connector stroke="black" strokeWidth="3">
          <Ref select={g} />
          <Ref select={b} />
        </Connector> */}
        <Square flip fill="blue">
          <Ref select={c} />
          <Ref select={a} />
          <Point name={h} fill="none" />
          <Point name={k} fill="none" />
        </Square>
        {/* <Connector stroke="black" strokeWidth="3">
          <Ref select={c} />
          <Ref select={h} />
        </Connector>
        <Connector stroke="black" strokeWidth="3">
          <Ref select={h} />
          <Ref select={k} />
        </Connector>
        <Connector stroke="black" strokeWidth="3">
          <Ref select={k} />
          <Ref select={a} />
        </Connector> */}
        <Square name={square3} flip fill="red">
          <Ref select={b} />
          <Ref select={c} />
          <Point name={e} fill="none" />
          <Point name={d} fill="none" />
        </Square>
        {/* <Connector stroke="black" strokeWidth="3">
          <Ref select={b} />
          <Ref select={e} />
        </Connector>
        <Connector stroke="black" strokeWidth="3">
          <Ref select={e} />
          <Ref select={d} />
        </Connector>
        <Connector stroke="black" strokeWidth="3">
          <Ref select={d} />
          <Ref select={c} />
        </Connector> */}
        {/* squares are complete! */}
        {/* <Intersect name={l} label={'L'}>
        <Hidden>
          <Connector>
            <Ref select={d} />
            <Ref select={e} />
          </Connector>
        </Hidden>
        <Hidden>
          <PerpendicularBisector>
            <Ref select={a} />
            <Ref select={bc} />
          </PerpendicularBisector>
        </Hidden>
      </Intersect>
      <Connector strokeDasharray={4}>
        <Ref select={a} />
        <Ref select={l} />
      </Connector> */}
      </Group>
    </Padding>
  );
});

{
  /* <Point name={a} label={'A'} />
<Point name={b} label={'B'} />
<Point name={c} label={'C'} />
<Offset vertical={10} horizontal={-5}>
  <Ref select={a} />
  <Ref select={b} />
</Offset>
<Align alignment="centerHorizontally">
  <Ref select={b} />
  <Ref select={c} />
</Align>
// kind of a hack here b/c align works only on cartesian coordinates
<Perpendicular>
  <Ref select={a} />
  <Ref select={b} />
  <Ref select={c} />
</Perpendicular>
<Connector>
  <Ref select={a} />
  <Ref select={b} />
</Connector>
<Connector name={bc}>
  <Ref select={b} />
  <Ref select={c} />
</Connector>
<Connector>
  <Ref select={c} />
  <Ref select={a} />
</Connector>
// triangle is complete!
<Square>
  <Ref select={a} />
  <Ref select={b} />
  <Point name={f} label={'F'} />
  <Point name={g} label={'G'} />
</Square>
<Square>
  <Ref select={c} />
  <Ref select={a} />
  <Point name={h} label={'H'} />
  <Point name={k} label={'K'} />
</Square>
<Square name={square3}>
  <Ref select={b} />
  <Ref select={c} />
  <Point name={e} label={'E'} />
  <Point name={d} label={'D'} />
</Square>
// squares are complete!
<Intersect label={'L'}>
  <Hidden>
    <Connector>
      <Ref select={d} />
      <Ref select={e} />
    </Connector>
  </Hidden>
  <Hidden>
    <PerpendicularBisector>
      <Ref select={a} />
      <Ref select={bc} />
    </PerpendicularBisector>
  </Hidden>
</Intersect>
<Connector style="dashed">
  <Ref select={a} />
  <Ref select={l} />
</Connector>

// TODO: somehow create a local scope so all these creations get registered???
const a = point('A');
const b = point('B');
const c = point('C');
offset(10, -5, a, b);
align('centerHorizontally', b, c);
perpendicular(a, b, c);
connector(a, b);
const bc = connector(b, c);
connector(c, a);
// triangle is complete!
const square1 = square(a, b, point('F'), point('G'));
const square2 = square(c, a, point('H'), point('K'));
const square3 = square(b, c, point('E'), point('D'));
// squares are complete!
const l = intersect('L', hide(connector(d, e)), hide(perpendicularBisector(a, bc)));
connector('dashed', a, l);

// every time a constructor is called, append a new element to the array
// and return the element
// if an element is referenced, create a reference to the element

 */
}
