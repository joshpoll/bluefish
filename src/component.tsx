import * as _ from 'lodash';
import { Constraint, solve } from './blue';
import { measureText } from './measureText';
import * as blobs2 from 'blobs/v2';
import { position } from './modifier';
import { BBox, Component, SizeInterval } from './componentTypes';
import { nanoid } from 'nanoid';
import * as reversePath from 'svg-path-reverse';
import { getArrow, ArrowOptions as PerfectArrowOptions, getBoxToBoxArrow } from 'perfect-arrows';

// export type Component = {
//   children: Component[],
//   layout: (children: Component[]) => Size,
//   paint: () => JSX.Element,
// }

// layout pass
// paint pass

// SVG rectangle
// SVG flex rectangle
// SVG canvas
// layout: width and height and return it
// paint: SVG
export const svg = (children: Component[]) =>
  new Component(
    children,
    (interval: SizeInterval, children: Component[]) => {
      children.map((c) => c.layout(interval));
      return {
        size: {
          width: interval.width.ub,
          height: interval.height.ub,
        },
        positions: children.map((c) => ({ x: 0, y: 0 })),
      };
    },
    (bbox: BBox, children: Component[]) => {
      return (
        <svg width={bbox.width} height={bbox.height}>
          {children.map((c) => c.paint())}
        </svg>
      );
    },
  );

type Rect = React.SVGProps<SVGRectElement> &
  Partial<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;

export const rect = (params: Rect) => {
  if (params.x === undefined || params.y === undefined) {
    return new Component(
      [],
      (interval: SizeInterval, children: Component[]) => {
        // return {
        //   width: interval.width.ub,
        //   height: interval.height.ub,
        // }
        return {
          size: { width: params.width ?? interval.width.lb, height: params.height ?? interval.width.lb },
          positions: [],
        };
      },
      (bbox: BBox, children: Component[]) => {
        return <rect {...params} x={bbox.x} y={bbox.y} width={bbox.width} height={bbox.height} />;
      },
    );
  } else {
    return new Component(
      [],
      (interval: SizeInterval, children: Component[]) => {
        // return {
        //   width: interval.width.ub,
        //   height: interval.height.ub,
        // }
        return {
          size: { width: params.width!, height: params.height! },
          positions: [],
        };
      },
      (bbox: BBox, children: Component[]) => {
        return <rect {...params} x={bbox.x} y={bbox.y} width={bbox.width} height={bbox.height} />;
      },
    ).mod(position({ x: params.x, y: params.y }));
  }
};

type Text = React.SVGProps<SVGTextElement> &
  Partial<{
    x: number;
    y: number;
  }>;

// TODO: use 'alphabetic' baseline in renderer? may need to figure out displacement again
// TODO: maybe use https://airbnb.io/visx/docs/text?
// TODO: maybe use alignmentBaseline="baseline" to measure the baseline as well?? need to add it as
// a guide
// TODO: very close to good alignment, but not quite there. Can I use more of the canvas
// measurements somehow?
export const text = (contents: string, params?: Text) => {
  if (params === undefined || params.x === undefined || params.y === undefined) {
    params = { fontFamily: 'sans-serif', fontSize: '12px', fontWeight: 'normal', ...params };
    const { fontStyle, fontWeight, fontSize, fontFamily } = params;
    const measurements = measureText(
      contents,
      `${fontStyle ?? ''} ${fontWeight ?? ''} ${fontSize ?? ''} ${fontFamily ?? ''}`,
    );
    console.log(contents, measurements);
    return new Component(
      [],
      (interval: SizeInterval, children: Component[]) => {
        return {
          size: { width: measurements.width, height: measurements.fontHeight },
          positions: [],
        };
      },
      (bbox: BBox, children: Component[]) => {
        return (
          <text {...params} x={bbox.x} y={bbox.y + bbox.height - measurements.fontDescent}>
            {contents}
          </text>
        );
      },
    );
  } else {
    params = { fontFamily: 'sans-serif', fontSize: '12px', fontWeight: 'normal', ...params };
    const { fontStyle, fontWeight, fontSize, fontFamily } = params;
    const measurements = measureText(
      contents,
      `${fontStyle ?? ''} ${fontWeight ?? ''} ${fontSize ?? ''} ${fontFamily ?? ''}`,
    );
    console.log(contents, measurements);
    return new Component(
      [],
      (interval: SizeInterval, children: Component[]) => {
        return {
          size: { width: measurements.width, height: measurements.fontHeight },
          positions: [],
        };
      },
      (bbox: BBox, children: Component[]) => {
        return (
          <text {...params} x={bbox.x} y={bbox.y + bbox.height - measurements.fontDescent}>
            {contents}
          </text>
        );
      },
    ).mod(position({ x: params.x!, y: params.y! }));
  }
};

const blobElement = (blobOptions: blobs2.BlobOptions, svgOptions?: blobs2.SvgOptions | undefined): JSX.Element => {
  const id = nanoid();
  console.log(blobs2.svgPath(blobOptions));
  const path = blobs2.svgPath(blobOptions);
  const reversedPath = reversePath.normalize(reversePath.reverse(path));
  return (
    <>
      <path {...svgOptions} d={path}></path>
      <defs>
        <path id={id} {...svgOptions} d={reversedPath}></path>
      </defs>
      <text dy={'-1.5%'} fontSize={'20px'}>
        <textPath href={`#${id}`} startOffset={'30%'} method={'align'}>
          Lebesgue measurable sets
        </textPath>
      </text>
    </>
  );
};

const blobPath = (blobOptions: blobs2.BlobOptions): string => {
  const path = blobs2.svgPath(blobOptions);
  return path;
};

// export const boundaryLabel = (component: Component) => {
//   const id = nanoid();
//   return new Component(
//     [],
//     (interval: SizeInterval, children: Component[]) => {},
//     (bbox: BBox, children: Component[]) => {
//       return (
//         <g transform={`translate(${bbox.x}, ${bbox.y})`}>
//           <defs>
//             <path id={id} d={path}></path>
//           </defs>
//           <text dy={'-1.5%'} fontSize={'20px'}>
//             <textPath href={`#${id}`} startOffset={'30%'} method={'align'}>
//               Lebesgue measurable sets
//             </textPath>
//           </text>
//         </g>
//       );
//     },
//   );
// };

export const blob = (blobOptions: blobs2.BlobOptions, svgOptions?: blobs2.SvgOptions | undefined): Component => {
  //   const path = blobPath(blobOptions);
  //   const reversedPath = reversePath.normalize(reversePath.reverse(path));
  return new Component(
    [],
    (interval: SizeInterval, children: Component[]) => {
      return {
        size: { width: blobOptions.size, height: blobOptions.size },
        positions: [],
      };
    },
    (bbox: BBox, children: Component[]) => {
      // translate blobElement by bbox.x and bbox.y
      return (
        <g transform={`translate(${bbox.x}, ${bbox.y})`}>
          {/* <path {...svgOptions} d={path}></path> */}
          {blobElement(blobOptions, svgOptions)}
        </g>
      );
    },
    // reversedPath,
  );
};

type VerticalAlignment = 'top' | 'middle' | 'bottom';

type RowOptions = ({ spacing: number } | { totalWidth: number }) & { x?: number; y?: number };

export const row = (options: RowOptions, alignment: VerticalAlignment, children: Component[]) =>
  new Component(
    children,
    (interval: SizeInterval, children: Component[]) => {
      children.map((c) => c.layout(interval));
      const width = children.reduce((acc, c) => acc + c.size!.width, 0);
      const height = children.reduce((acc, c) => Math.max(c.size!.height), -Infinity);
      // const top = children.reduce((acc, c) => Math.min(acc, c.position!.y), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, c.position!.y + c.size!.height), -Infinity);
      // const top = children.reduce((acc, c) => Math.min(acc, 0), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, 0 + c.size!.height), -Infinity);
      let yPos: number[];
      switch (alignment) {
        case 'top':
          yPos = Array(children.length).fill(0);
          break;
        case 'middle':
          yPos = children.map((c) => c.size!.height / 2);
          yPos = yPos.map((y) => Math.max(...yPos) - y);
          break;
        case 'bottom':
          yPos = children.map((c) => c.size!.height);
          yPos = yPos.map((y) => Math.max(...yPos) - y);
          break;
      }
      // 0: 0
      // 1: 0 + width_0 + spacing
      // 2: 0 + width_0 + spacing + width_1 + spacing
      // ...
      const initial = _.initial(children);
      if ('spacing' in options) {
        const positions = initial
          .reduce(
            (acc, c, i) => [
              {
                x: acc[0].x + c.size!.width + options.spacing,
                y: yPos[i + 1],
              },
              ...acc,
            ],
            [{ x: 0, y: yPos[0] }],
          )
          .reverse();
        return {
          size: {
            width,
            // height: bottom - top,
            height,
          },
          positions,
        };
      } else if ('totalWidth' in options) {
        const occupiedWidth = children.reduce((width, c) => width + c.size!.width, 0);
        const spacing = (options.totalWidth - occupiedWidth) / (children.length - 1);
        const positions = initial
          .reduce(
            (acc, c, i) => [
              {
                x: acc[0].x + c.size!.width + spacing,
                y: yPos[i + 1],
              },
              ...acc,
            ],
            [{ x: 0, y: yPos[0] }],
          )
          .reverse();
        return {
          size: {
            width,
            // height: bottom - top,
            height,
          },
          positions,
        };
      } else {
        throw new Error('never');
      }
    },
    (bbox: BBox, children: Component[]) => {
      return <g transform={`translate(${bbox.x},${bbox.y})`}>{children.map((c) => c.paint())}</g>;
    },
  ).mod(position({ x: options.x ?? 0, y: options.y ?? 0 }));

type HorizontalAlignment = 'left' | 'center' | 'right';

type ColOptions = ({ spacing: number } | { totalHeight: number }) & { x?: number; y?: number };

export const col = (options: ColOptions, alignment: HorizontalAlignment, children: Component[]) =>
  new Component(
    children,
    (interval: SizeInterval, children: Component[]) => {
      children.map((c) => c.layout(interval));
      const width = children.reduce((acc, c) => Math.max(acc, c.size!.width), -Infinity);
      const height = children.reduce((acc, c) => acc + c.size!.height, 0);
      // const top = children.reduce((acc, c) => Math.min(acc, c.position!.y), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, c.position!.y + c.size!.height), -Infinity);
      // const top = children.reduce((acc, c) => Math.min(acc, 0), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, 0 + c.size!.height), -Infinity);
      let xPos: number[];
      switch (alignment) {
        case 'left':
          xPos = Array(children.length).fill(0);
          break;
        case 'center':
          xPos = children.map((c) => c.size!.width / 2);
          xPos = xPos.map((x) => Math.max(...xPos) - x);
          break;
        case 'right':
          xPos = children.map((c) => c.size!.width);
          xPos = xPos.map((x) => Math.max(...xPos) - x);
          break;
      }
      // 0: 0
      // 1: 0 + width_0 + spacing
      // 2: 0 + width_0 + spacing + width_1 + spacing
      // ...
      const initial = _.initial(children);
      if ('spacing' in options) {
        const positions = initial
          .reduce(
            (acc, c, i) => [
              {
                x: xPos[i + 1],
                y: acc[0].y + c.size!.height + options.spacing,
              },
              ...acc,
            ],
            [{ x: xPos[0], y: 0 }],
          )
          .reverse();
        return {
          size: {
            width,
            // height: bottom - top,
            height,
          },
          positions,
        };
      } else if ('totalHeight' in options) {
        const occupiedHeight = children.reduce((height, c) => height + c.size!.height, 0);
        const spacing = (options.totalHeight - occupiedHeight) / (children.length - 1);
        const positions = initial
          .reduce(
            (acc, c, i) => [
              {
                x: xPos[i + 1],
                y: acc[0].y + c.size!.height + spacing,
              },
              ...acc,
            ],
            [{ x: xPos[0], y: 0 }],
          )
          .reverse();
        return {
          size: {
            width,
            // height: bottom - top,
            height,
          },
          positions,
        };
      } else {
        throw new Error('never');
      }
    },
    (bbox: BBox, children: Component[]) => {
      return <g transform={`translate(${bbox.x},${bbox.y})`}>{children.map((c) => c.paint())}</g>;
    },
  ).mod(position({ x: options.x ?? 0, y: options.y ?? 0 }));

/* inflex - "flex" - inflex - "flex" - inflex */
/* assumption: inflex sizes are known */
/* assumption: "flex" sizes are one of (i) fixed known size, (ii) fixed unknown size, with known
total row width (d3 bandwidth), (iii) fixed array known size, (iv) fixed array unknown sizes (flex
factors), with known total row width */
/* flex - "inflex" - flex - "inflex" - flex */
/* two of three must be known: object (array), spatial-relation (array), total width */
const rowIntercalate = (
  spacing: number /* absolute spacing */ | number[] /* defined flex(?) spacing */ | undefined /* infer equal spacing */,
  width: number | undefined,
  children: Component[],
) =>
  new Component(
    children,
    (interval: SizeInterval, children: Component[]) => {
      children.map((c) => c.layout(interval));
      const width = children.reduce((acc, c) => acc + c.size!.width, 0);
      const height = children.reduce((acc, c) => Math.max(c.size!.height), -Infinity);
      // const top = children.reduce((acc, c) => Math.min(acc, c.position!.y), -Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, c.position!.y + c.size!.height), Infinity);
      // 0: 0
      // 1: 0 + width_0 + spacing
      // 2: 0 + width_0 + spacing + width_1 + spacing
      // ...
      const initial = _.initial(children);
      const positions = initial
        .reduce(
          (acc, c) => [
            {
              // x: acc[0].x + c.size!.width + spacing,
              x: 0 /* TODO */,
              y: 0,
            },
            ...acc,
          ],
          [{ x: 0, y: 0 }],
        )
        .reverse();
      return {
        size: {
          width,
          // height: bottom - top,
          height,
        },
        positions,
      };
    },
    (bbox: BBox, children: Component[]) => {
      return <g transform={`translate(${bbox.x},${bbox.y})`}>{children.map((c) => c.paint())}</g>;
    },
  );

const computeConnectedComponents = (nodes: string[], edges: [string, string][]): string[][] => {
  // compute connected components of nodes and edges
  // thank you Copilot! (90% generated by Copilot)
  let components: string[][] = [];
  let visited: { [key: string]: boolean } = {};
  const visit = (node: string) => {
    if (visited[node]) {
      return;
    }
    visited[node] = true;
    const component: string[] = [];
    const stack: string[] = [node];
    while (stack.length > 0) {
      const n = stack.pop()!;
      component.push(n);
      edges
        .filter(([u, v]) => u === n || v === n)
        .forEach(([u, v]) => {
          if (!visited[u]) {
            stack.push(u);
          }
          if (!visited[v]) {
            stack.push(v);
          }
        });
    }
    components.push(component);
  };
  nodes.forEach(visit);
  return components;
};

// TODO: this suggests that children should be records, not arrays
const group = (components: Record<string, Component>, relations: Record<`${string}->${string}`, Constraint[]>) =>
  new Component(
    Object.values(components),
    (interval: SizeInterval, children: Component[]) => {
      children.map((c) => c.layout(interval));
      // COMBAK: for now we assume that the constraints form a single connected component and no
      // child has a pre-defined position
      const constraints = Object.values(relations).flat();
      const solution = solve(constraints);
      // COMBAK: for now we assume that variables are named as 'foo.<dimension>'
      const positions = Object.keys(components).map((node) => ({
        x: solution[`${node}.x`],
        y: solution[`${node}.y`],
      }));
      const left = Math.min(...positions.map((p) => p.x));
      const top = Math.min(...positions.map((p) => p.y));
      const right = Math.max(...positions.map((p, i) => p.x + children[i].size!.width));
      const bottom = Math.max(...positions.map((p, i) => p.y + children[i].size!.height));
      const width = right - left;
      const height = bottom - top;
      return {
        size: {
          width,
          height,
        },
        positions,
      };

      // TODO: this is all good stuff for generalizing to connected components
      /* //   compute connected components of components and relations
      const edges = Object.keys(relations).map((r) => r.split('->') as [string, string]);
      const connectedComponents = computeConnectedComponents(Object.keys(components), edges);
      // find any components that already have specified positions.
      let isXFixed: boolean[] = [];
      let isYFixed: boolean[] = [];
      for (const i in connectedComponents) {
        for (const node of connectedComponents[i]) {
          if (components[node].position !== undefined) {
            if (components[node].position!.x !== undefined) {
              isXFixed[i] = true;
            }
            if (components[node].position!.y !== undefined) {
              isYFixed[i] = true;
            }
          }
        }
      }
      // now we solve each connected component
      // for each dimension,
      for (const i in isXFixed) {
        // if a component is fixed then its constraints must be completely solvable
        if (isXFixed[i]) {
          // TODO: compute constraints
          const constraints: any[] = [];
          const solution = solve(constraints);
          // TODO: update components with solution
        } else {
          // if a component is not fixed then we can set some default values
          // in fact, one default value is enough, so we arbitrarily choose the first node in the component
        }
      } */
    },
    (bbox: BBox, children: Component[]) => {
      // COMBAK: translation? local vs. global coordinates?
      return <g transform={`translate(${bbox.x},${bbox.y})`}>{children.map((c) => c.paint())}</g>;
    },
  );

export const render = (component: Component): JSX.Element => {
  const sizeInterval: SizeInterval = {
    width: { lb: 500, ub: 500 },
    height: { lb: 500, ub: 500 },
  };
  component.layout(sizeInterval);
  return component.paint();
};

type Arrow = {
  from: { x: number; y: number };
  to: { x: number; y: number };
};

type ArrowOptions = PerfectArrowOptions & { arrowTail?: boolean; arrowHead?: boolean };

export const arrow = (params: Arrow, options?: ArrowOptions) => {
  const { from, to } = params;
  const arrowTail = options?.arrowTail ?? true;
  const arrowHead = options?.arrowHead ?? true;
  const arrow = getArrow(from.x, from.y, to.x, to.y, options);

  const [sx, sy, cx, cy, ex, ey, ae, as, ec] = arrow;

  const endAngleAsDegrees = ae * (180 / Math.PI);

  return new Component(
    [],
    (interval: SizeInterval, children: Component[]) => {
      return {
        size: {
          width: Math.abs(ex - sx),
          height: Math.abs(ey - sy),
        },
        positions: [],
      };
    },
    (bbox: BBox, children: Component[]) => {
      return (
        <g stroke="#000" fill="#000" strokeWidth={3}>
          {arrowTail ? <circle cx={sx} cy={sy} r={4} /> : <></>}
          <path d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`} fill="none" />
          {arrowHead ? (
            <polygon points="0,-6 12,0, 0,6" transform={`translate(${ex},${ey}) rotate(${endAngleAsDegrees})`} />
          ) : (
            <></>
          )}
        </g>
      );
    },
  );
};

type Port = 'ne' | 'nw' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w';

type ArrowRef = {
  from: { ref: Component; port: Port };
  to: { ref: Component; port: Port };
};

const bboxToPoint = (bbox: { x: number; y: number; width: number; height: number }, port: Port) => {
  switch (port) {
    case 'ne':
      return { x: bbox.x + bbox.width, y: bbox.y };
    case 'nw':
      return { x: bbox.x, y: bbox.y };
    case 'se':
      return { x: bbox.x + bbox.width, y: bbox.y + bbox.height };
    case 'sw':
      return { x: bbox.x, y: bbox.y + bbox.height };
    case 'n':
      return { x: bbox.x + bbox.width / 2, y: bbox.y };
    case 's':
      return { x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height };
    case 'e':
      return { x: bbox.x + bbox.width, y: bbox.y + bbox.height / 2 };
    case 'w':
      return { x: bbox.x, y: bbox.y + bbox.height / 2 };
    default:
      throw new Error(`Unknown port: ${port}`);
  }
};

// assumes components were already laid out
// TODO: how do I get rid of the duplication in the two functions?
// TODO: hack uses fixed translation that only works for the one example
export const arrowRef = (params: ArrowRef, options?: ArrowOptions) => {
  const from = params.from.ref;
  const to = params.to.ref;

  return new Component(
    [],
    (interval: SizeInterval, children: Component[]) => {
      let fromChild: Component | undefined = params.from.ref;
      let fromOffset: { x: number; y: number } = { x: 0, y: 0 };
      while (fromChild !== undefined && fromChild.position !== undefined) {
        fromOffset.x += fromChild.position!.x;
        fromOffset.y += fromChild.position!.y;
        fromChild = fromChild.parent;
      }
      let toChild: Component | undefined = params.to.ref;
      let toOffset: { x: number; y: number } = { x: 0, y: 0 };
      while (toChild !== undefined && toChild.position !== undefined) {
        toOffset.x += toChild.position!.x;
        toOffset.y += toChild.position!.y;
        toChild = toChild.parent;
      }

      const fromBBox = {
        x: fromOffset.x,
        y: fromOffset.y,
        width: from.size!.width,
        height: from.size!.height,
      };
      const toBBox = {
        x: toOffset.x,
        y: toOffset.y,
        width: to.size!.width,
        height: to.size!.height,
      };

      const fromPoint = bboxToPoint(fromBBox, params.from.port);
      const toPoint = bboxToPoint(toBBox, params.to.port);

      const arrow = getArrow(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y, options);

      const [sx, sy, cx, cy, ex, ey, ae, as, ec] = arrow;

      return {
        size: {
          width: Math.abs(ex - sx),
          height: Math.abs(ey - sy),
        },
        positions: [],
      };
    },
    (bbox: BBox, children: Component[]) => {
      let fromChild: Component | undefined = params.from.ref;
      let fromOffset: { x: number; y: number } = { x: 0, y: 0 };
      while (fromChild !== undefined && fromChild.position !== undefined) {
        fromOffset.x += fromChild.position!.x;
        fromOffset.y += fromChild.position!.y;
        fromChild = fromChild.parent;
      }
      let toChild: Component | undefined = params.to.ref;
      let toOffset: { x: number; y: number } = { x: 0, y: 0 };
      while (toChild !== undefined && toChild.position !== undefined) {
        toOffset.x += toChild.position!.x;
        toOffset.y += toChild.position!.y;
        toChild = toChild.parent;
      }

      const fromBBox = {
        x: fromOffset.x,
        y: fromOffset.y,
        width: from.size!.width,
        height: from.size!.height,
      };
      const toBBox = {
        x: toOffset.x,
        y: toOffset.y,
        width: to.size!.width,
        height: to.size!.height,
      };

      const arrowTail = options?.arrowTail ?? true;
      const arrowHead = options?.arrowHead ?? true;

      const fromPoint = bboxToPoint(fromBBox, params.from.port);
      const toPoint = bboxToPoint(toBBox, params.to.port);

      const arrow = getArrow(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y, options);

      const [sx, sy, cx, cy, ex, ey, ae, as, ec] = arrow;

      const endAngleAsDegrees = ae * (180 / Math.PI);

      console.log('toBBox', toBBox);
      console.log('fromBBox', fromBBox);

      return (
        <g stroke="#000" fill="#000" strokeWidth={3}>
          {arrowTail ? <circle cx={sx} cy={sy} r={4} /> : <></>}
          <path d={`M${sx},${sy} Q${cx},${cy} ${ex},${ey}`} fill="none" />
          {arrowHead ? (
            <polygon points="0,-6 12,0, 0,6" transform={`translate(${ex},${ey}) rotate(${endAngleAsDegrees})`} />
          ) : (
            <></>
          )}
        </g>
      );
    },
  );
};
