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
  positions: Position[];
  boundary?: string;
};

export class Component {
  children: Component[];
  _layout: Layout;
  _paint: Paint;
  size?: Size;
  position?: Position;
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
    const { size, positions, boundary } = this._layout(interval, this.children);
    // set our size
    this.size = size;
    // set our children's positions
    this.children.map((c, i) => (c.position = positions[i]));
    // set our boundary
    // TODO: big hack to allow us to override the boundary
    this.boundary = this.boundary ?? boundary;
    return { size, positions, boundary };
  }

  paint() {
    return this._paint({ ...this.size!, ...this.position! }, this.children, this.boundary);
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
