// view modifiers (inspired by SwiftUI and Flutter) are components with a single child
// unlike other components, view modifiers may be chained after components in an extensible way

import { BBox, Component, Modifier, Position, SizeInterval } from './componentTypes';
import { nanoid } from 'nanoid';

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
      return <g transform={`translate(${bbox.x},${bbox.y})`}>{child.paint()}</g>;
    },
  );
};

export const background = (background: Component) => (component: Component) => {
  return new Component(
    [component, background],
    (interval: SizeInterval, children: Component[]) => {
      const [child, background] = children;
      child.layout(interval);
      background.layout({
        width: { ub: interval.width.ub, lb: child.size!.width },
        height: { ub: interval.height.ub, lb: child.size!.height },
      });
      return {
        size: {
          width: background.size!.width,
          height: background.size!.height,
        },
        positions: [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ],
      };
    },
    (bbox: BBox, children: Component[]) => {
      const [child, background] = children;
      return (
        <g transform={`translate(${bbox.x}, ${bbox.y})`}>
          {background.paint()}
          {child.paint()}
        </g>
      );
    },
  );
};

// type BracketOptions = {};

// export const bracket = (options: BracketOptions) => (component: Component) => {
//   return new Component(
//     [component, background],
//     (interval: SizeInterval, children: Component[]) => {
//       const [child, background] = children;
//       child.layout(interval);
//       background.layout({
//         width: { ub: interval.width.ub, lb: child.size!.width },
//         height: { ub: interval.height.ub, lb: child.size!.height },
//       });
//       return {
//         size: {
//           width: background.size!.width,
//           height: background.size!.height,
//         },
//         positions: [
//           { x: 0, y: 0 },
//           { x: 0, y: 0 },
//         ],
//       };
//     },
//     (bbox: BBox, children: Component[]) => {
//       const [child, background] = children;
//       return (
//         <g transform={`translate(${bbox.x}, ${bbox.y})`}>
//           {background.paint()}
//           {child.paint()}
//         </g>
//       );
//     },
//   );
// };

type BoundaryLabelOptions = Omit<React.SVGProps<SVGTextPathElement>, 'href'> & React.SVGProps<SVGTextElement>;

export const boundaryLabel = (label: string, options: BoundaryLabelOptions) => (component: Component) => {
  const id = nanoid();
  const labelComponent = new Component(
    [],
    (interval: SizeInterval, children: Component[]) => {
      return {
        size: {
          width: interval.width.lb,
          height: interval.height.lb,
        },
        positions: [],
      };
    },
    // TODO: this boundary information is a big hack!
    //  this is not the real boundary of the shape, we're just abusing it to send the boundary from
    //  the shape to the label
    (bbox: BBox, children: Component[], boundary?: string) => {
      return (
        <g>
          <defs>
            <path id={id} d={boundary}></path>
          </defs>
          <text dy={options.dy /* '-1.5%' */} fontSize={options.fontSize /* '20px' */}>
            <textPath
              href={`#${id}`}
              startOffset={options.startOffset /* '30%' */}
              method={options.method /* 'align' */}
            >
              {label}
            </textPath>
          </text>
        </g>
      );
    },
  );
  return new Component(
    [component, labelComponent],
    (interval: SizeInterval, children: Component[]) => {
      const [child, label] = children;
      child.layout(interval);
      console.log('setting label boundary', child.boundary);
      label.boundary = child.boundary;
      label.layout({
        width: { ub: interval.width.ub, lb: child.size!.width },
        height: { ub: interval.height.ub, lb: child.size!.height },
      });
      return {
        size: {
          width: label.size!.width,
          height: label.size!.height,
        },
        positions: [
          { x: 0, y: 0 },
          { x: 0, y: 0 },
        ],
      };
    },
    (bbox: BBox, children: Component[]) => {
      const [child, label] = children;
      console.log('painting label', label.boundary);
      return (
        <g transform={`translate(${bbox.x}, ${bbox.y})`}>
          {child.paint()}
          {label.paint()}
        </g>
      );
    },
  );
};
