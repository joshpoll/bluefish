// view modifiers (inspired by SwiftUI and Flutter) are components with a single child
// unlike other components, view modifiers may be chained after components in an extensible way

import { BBox, Component, Layout, Paint, Position, Size, SizeInterval } from './component';

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

export const position = (position: Position) => (component: Component) =>
  new Modifier(
    component,
    (interval: SizeInterval, child: Component) => {
      child.layout(interval);
      return {
        size: {
          width: interval.width.ub,
          height: interval.height.ub,
        },
        position,
      };
    },
    (bbox: BBox, child: Component) => {
      // return <g transform={`translate(${bbox.x},${bbox.y})`}>
      //   {children[0].paint()}
      // </g>;
      return child.paint();
    },
  );
