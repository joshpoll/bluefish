\todo[inline]{This type is a bit of a lie... But a useful one for exposition purposes.}
\begin{minted}[fontsize=\small]{typescript}
type Node<Props> = {
  id?: string;
  name?: Name;
  props: Props;
  children: (Node<any> | Ref<any>)[]; // TODO: is this right?
  // available after layout
  constraints?: Constraints;
  // properties filled in over time by layout functions
  bbox: BBox;
  boundary?: PaperJS.Path;
  // available after rendering
  domRef: SVGElement | null;
  transformStack?: CoordinateTransform[];
  layout: (props, constraints, children: BBox[]) => BBox;
  render: (props, bbox, boundary, children: DOM[]) => DOM;
};

type Constraints = { width?: number; height?: number };

type BBox = {
  left?: number;
  top?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
  coord?: CoordinateTransform;
}

type CoordinateTransform = {
  translate?: { x?: number; y?: number };
  scale?: { x?: number; y?: number };
}

type Ref<Props> = {
  id?: string;
  name?: Name;
  props: Props;
  // available after measure
  constraints?: Constraints;
  // properties filled in over time by measure functions
  coord: CoordinateTransform;
  bbox: BBox;
  // available after rendering
  domRef: SVGElement | null;
  transformStack?: CoordinateTransform[];
  // TODO: are the properties above necessary for exposition?
  // I don't even remember if they're on this datatype...
  select: Select;
  ref?: Node<Props>;
}

type Select = {
  name: Name;
  path: string[];
}
\end{minted}