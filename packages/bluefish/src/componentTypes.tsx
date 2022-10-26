export type Size = {
  width: number;
  height: number;
};

export type Interval = {
  lb: number;
  ub: number;
};

export type SizeInterval = {
  width: Interval;
  height: Interval;
};

export type Position = {
  x: number;
  y: number;
};

export type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Paint = (bbox: BBox, children: Component[], boundary?: string) => JSX.Element;
export type Layout = (
  interval: SizeInterval,
  children: Component[],
) => {
  size: Size;
  ownPosition?: Position;
  positions: Partial<Position>[];
  boundary?: string;
};

export class Component {
  children: Component[];
  _layout: Layout;
  _paint: Paint;
  size?: Size;
  position?: Partial<Position>;
  //   boundary path (string type for now, but could refine later. check tldraw for details/inspiration/libraries)
  boundary?: string;
  parent?: Component;

  constructor(children: Component[], layout: Layout, paint: Paint, boundary?: string) {
    this.children = children;
    children.map((c) => (c.parent = this));
    this._layout = layout;
    this._paint = paint;
    this.boundary = boundary;
  }

  layout(interval: SizeInterval) {
    const { size, positions, boundary, ownPosition } = this._layout(interval, this.children);
    // set our size
    this.size = size;
    // set our position
    this.position = ownPosition;
    // set our children's positions
    // this.children.map((c, i) => (c.position = positions[i]));

    // set our children's positions if we the new positions are defined
    positions.forEach((p, i) => {
      if ((p.x !== undefined || p.y !== undefined) && this.children[i].position === undefined) {
        this.children[i].position = {};
      }
      if (p.x !== undefined) {
        this.children[i].position!.x = p.x;
      }
      if (p.y !== undefined) {
        this.children[i].position!.y = p.y;
      }
    });
    // set our children's positions iff they are not already set
    this.children.forEach((c, i) => {
      if (c.position === undefined) {
        c.position = positions[i];
      }
    });
    // set our boundary
    // TODO: big hack to allow us to override the boundary
    this.boundary = this.boundary ?? boundary;
    return { size, positions, boundary };
  }

  paint() {
    // TODO: remove any
    return this._paint({ ...this.size!, ...this.position! } as any, this.children, this.boundary);
    // return (
    //   <>
    //     <rect
    //       x1={this.position?.x ?? 0}
    //       y1={this.position?.y ?? 0}
    //       x2={(this.position?.x ?? 0) + (this.size!.width ?? 0)}
    //       y2={(this.position?.y ?? 0) + (this.size!.height ?? 0)}
    //       stroke="magenta"
    //     ></rect>
    //     {this._paint({ ...this.size!, ...this.position! } as any, this.children, this.boundary)}
    //   </>
    // );
  }

  mod(...modify: ((component: Component) => Component)[]): Component {
    return modify.reduce((c: Component, m) => m(c), this);
  }
}

export type ModifierPaint = (bbox: BBox, child: Component) => JSX.Element;
export type ModifierLayout = (
  interval: SizeInterval,
  child: Component,
) => {
  size: Size;
  position: Position;
};

const modifierPaintToPaint = (modifierPaint: ModifierPaint): Paint => {
  return (bbox: BBox, children: Component[]) => {
    return modifierPaint(bbox, children[0]);
  };
};

const modifierLayoutToLayout = (modifierLayout: ModifierLayout): Layout => {
  return (interval: SizeInterval, children: Component[]) => {
    const { size, position } = modifierLayout(interval, children[0]);
    return {
      size,
      positions: [position],
    };
  };
};

export class Modifier extends Component {
  constructor(child: Component, layout: ModifierLayout, paint: ModifierPaint) {
    super([child], modifierLayoutToLayout(layout), modifierPaintToPaint(paint));
  }
}

export type ModifierFn = (component: Component) => Modifier;
