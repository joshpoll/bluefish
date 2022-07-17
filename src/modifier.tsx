// view modifiers (inspired by SwiftUI and Flutter) are components with a single child
// unlike other components, view modifiers may be chained after components in an extensible way

import { BBox, Component, Modifier, Position, SizeInterval } from './componentTypes';

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

type Padding = number | Partial<{ top: number; right: number; bottom: number; left: number }>;
type ElaboratedPadding = { top: number; right: number; bottom: number; left: number };

export const padding = (padding: Padding) => (component: Component) => {
  const elaboratedPadding: ElaboratedPadding =
    typeof padding === 'number'
      ? { top: padding, right: padding, bottom: padding, left: padding }
      : {
          top: padding.top ?? 0,
          right: padding.right ?? 0,
          bottom: padding.bottom ?? 0,
          left: padding.left ?? 0,
        };

  return new Modifier(
    component,
    (interval: SizeInterval, child: Component) => {
      // subtract padding from interval
      const { width, height } = interval;
      const { top, right, bottom, left } = elaboratedPadding;
      const newInterval = {
        width: { ub: width.ub - left - right, lb: width.lb - left - right },
        height: { ub: height.ub - top - bottom, lb: height.lb - left - right },
      };
      child.layout(newInterval);
      return {
        size: {
          width: child.size!.width + left + right,
          height: child.size!.height + top + bottom,
        },
        position: { x: elaboratedPadding.left, y: elaboratedPadding.top },
      };
    },
    (bbox: BBox, child: Component) => {
      // return <g transform={`translate(${bbox.x},${bbox.y})`}>
      //   {children[0].paint()}
      // </g>;
      return child.paint();
    },
  );
};
