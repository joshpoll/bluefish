export type Size = {
  width: number,
  height: number,
}

export type Interval = {
  lb: number,
  ub: number,
}

export type SizeInterval = {
  width: Interval,
  height: Interval,
}

export type Position = {
  x: number,
  y: number,
}

export type BBox = {
  x: number,
  y: number,
  width: number,
  height: number,
}

// export type Component = {
//   children: Component[],
//   layout: (children: Component[]) => Size,
//   paint: () => JSX.Element,
// }

export type Paint = (bbox: BBox, children: Component[]) => JSX.Element
export type Layout = (interval: SizeInterval, children: Component[]) => {
  size: Size,
  positions: Position[],
}

export class Component {
  children: Component[];
  _layout: Layout;
  _paint: Paint;
  size?: Size;
  position?: Position;

  constructor(children: Component[], layout: Layout, paint: Paint) {
    this.children = children;
    this._layout = layout;
    this._paint = paint;
  }

  layout(interval: SizeInterval) {
    const { size, positions } = this._layout(interval, this.children);
    // set our size
    this.size = size;
    // set our children's positions
    this.children.map((c, i) => c.position = positions[i]);
    return { size, positions }
  }

  paint() {
    return this._paint({ ...this.size!, ...this.position! }, this.children);
  }

}

// layout pass
// paint pass

// SVG rectangle
// SVG flex rectangle
// SVG canvas
// layout: width and height and return it
// paint: SVG
const svg = (children: Component[]) => new Component(children, (interval: SizeInterval, children: Component[]) => {
  children.map(c => c.layout(interval))
  return {
    size: {
      width: interval.width.ub,
      height: interval.height.ub,
    },
    positions: children.map(c => ({ x: 0, y: 0 })),
  }
},
  (bbox: BBox, children: Component[]) => {
    return <svg width={bbox.width} height={bbox.height}>
      {children.map((c) => c.paint())}
    </svg>
  });

const rect = (size: Size) => new Component([], (interval: SizeInterval, children: Component[]) => {
  // return {
  //   width: interval.width.ub,
  //   height: interval.height.ub,
  // }
  return {
    size,
    positions: [],
  }
},
  (bbox: BBox, children: Component[]) => {
    return <rect x={bbox.x} y={bbox.y} width={bbox.width} height={bbox.height} />
  });

const position = (position: Position, component: Component) => new Component([component], (interval: SizeInterval, children: Component[]) => {
  children.map(c => c.layout(interval))
  return {
    size: {
      width: interval.width.ub,
      height: interval.height.ub,
    },
    positions: [position],
  }
}, (bbox: BBox, children: Component[]) => {
  return <g transform={`translate(${bbox.x},${bbox.y})`}>
    {children[0].paint()}
  </g>;
})

export const testComponent = svg([
  position({ x: 10, y: 10 }, rect({ width: 100, height: 100 })),
  position({ x: 30, y: 200 }, rect({ width: 50, height: 200 })),
]);

export const render = (component: Component): JSX.Element => {
  const sizeInterval: SizeInterval = {
    width: { lb: 500, ub: 500 },
    height: { lb: 500, ub: 500 },
  };
  component.layout(sizeInterval);
  return component.paint();
}
