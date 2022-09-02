import * as _ from 'lodash';
import { Constraint, solve } from './blue';
import { measureText } from './measureText';
import * as blobs2 from 'blobs/v2';
import { position } from './modifier';
import { BBox, Component, SizeInterval } from './componentTypes';
import { nanoid } from 'nanoid';
import * as reversePath from 'svg-path-reverse';
import { getArrow, ArrowOptions as PerfectArrowOptions, getBoxToBoxArrow } from 'perfect-arrows';
import { Path } from 'paper';

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
      const left = _.min(children.map((c) => c.position?.x ?? 0)) ?? 0;
      const right = _.max(children.map((c) => (c.position?.x ?? 0) + c.size!.width)) ?? 0;
      const top = _.min(children.map((c) => c.position?.y ?? 0)) ?? 0;
      const bottom = _.max(children.map((c) => (c.position?.y ?? 0) + c.size!.height)) ?? 0;
      // console.log('svg width', right - left);
      // console.log('svg height', bottom - top);
      // console.log(children.map((c) => c.position));
      // console.log(children.map((c) => c.size));
      return {
        size: {
          width: right - left,
          height: bottom - top,
          // width: interval.width.ub,
          // height: interval.height.ub,
        },
        // TODO: need a nicer way of doing this
        positions: children.map((c) => ({
          x: c.position ? (c.position.x ? undefined : 0) : 0,
          y: c.position ? (c.position.y ? undefined : 0) : 0,
        })),
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
        ownPosition: params.x === undefined || params.y === undefined ? undefined : { x: params.x, y: params.y },
      };
    },
    (bbox: BBox, children: Component[]) => {
      return <rect {...params} x={bbox.x} y={bbox.y} width={bbox.width} height={bbox.height} />;
    },
  );
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
        ownPosition:
          params === undefined || params.x === undefined || params.y === undefined
            ? undefined
            : { x: params.x, y: params.y },
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

export const blob_OLD = (blobOptions: blobs2.BlobOptions, svgOptions?: blobs2.SvgOptions | undefined): Component => {
  //   const path = blobPath(blobOptions);
  //   const reversedPath = reversePath.normalize(reversePath.reverse(path));
  return new Component(
    [],
    (interval: SizeInterval, children: Component[]) => {
      return {
        size: { width: blobOptions.size, height: blobOptions.size },
        positions: [],
        boundary: reversePath.normalize(reversePath.reverse(blobPath(blobOptions))),
      };
    },
    (bbox: BBox, children: Component[], boundary?: string) => {
      // translate blobElement by bbox.x and bbox.y
      return (
        <g transform={`translate(${bbox.x}, ${bbox.y})`}>
          <path {...svgOptions} d={boundary}></path>
          {/* {blobElement(blobOptions, svgOptions)} */}
        </g>
      );
    },
    // reversedPath,
  );
};

export const blob = (path: InstanceType<typeof Path>, svgOptions?: blobs2.SvgOptions): Component => {
  let blobPath = path.clone();
  blobPath.closed = true;
  // apply smoothing twice to make the curves a bit less sharp
  blobPath.smooth({ type: 'continuous' });
  blobPath.flatten(4);
  blobPath.smooth({ type: 'continuous' });

  //   const reversedPath = reversePath.normalize(reversePath.reverse(path));
  return new Component(
    [],
    (interval: SizeInterval, children: Component[]) => {
      const bounds = blobPath.strokeBounds;
      const boundary = (blobPath.exportSVG() as SVGElement).getAttribute('d') ?? '';
      return {
        size: { width: bounds.width, height: bounds.height },
        positions: [],
        // boundary: reversePath.normalize(reversePath.reverse(blobPath(blobOptions))),
        boundary: boundary,
        ownPosition: { x: bounds.x, y: bounds.y },
      };
    },
    (bbox: BBox, children: Component[], boundary?: string) => {
      // translate blobElement by bbox.x and bbox.y
      return (
        <g /*  transform={`translate(${bbox.x}, ${bbox.y})`} */>
          <path {...svgOptions} d={boundary}></path>
          {/* <rect x={bbox.x} y={bbox.y} width={bbox.width} height={bbox.height} stroke={'magenta'} fill={'none'}></rect> */}
        </g>
      );
    },
  );
};

type AlignOptions =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'left'
  | 'center'
  | 'right'
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight';

export const align = (options: AlignOptions, children: Component[]) =>
  new Component(
    children,
    (interval: SizeInterval, children: Component[]) => {
      const first = children[0];
      first.layout(interval);
      if (first.position === undefined) {
        first.position = {};
        if (first.position.x === undefined) {
          first.position.x = 0;
        }
        if (first.position.y === undefined) {
          first.position.y = 0;
        }
      }
      const second = children[1];
      second.layout(interval);
      switch (options) {
        case 'topLeft':
          return {
            size: {
              width: Math.max(first.size!.width, second.size!.width),
              height: Math.max(first.size!.height, second.size!.height),
            },
            positions: [{}, { x: first.position!.x, y: first.position!.y }],
          };
        case 'top':
          return {
            size: {
              width: Math.max(first.size!.width, second.size!.width),
              height: Math.max(first.size!.height, second.size!.height),
            },
            positions: [
              {},
              { x: first.position!.x! + first.size!.width / 2 - second.size!.width / 2, y: first.position!.y },
            ],
          };
        case 'topRight':
          return {
            size: {
              width: Math.max(first.size!.width, second.size!.width),
              height: Math.max(first.size!.height, second.size!.height),
            },
            positions: [{}, { x: first.position!.x! + first.size!.width - second.size!.width, y: first.position!.y }],
          };
        case 'left':
          return {
            size: {
              width: Math.max(first.size!.width, second.size!.width),
              height: Math.max(first.size!.height, second.size!.height),
            },
            positions: [
              {},
              { x: first.position!.x, y: first.position!.y! + first.size!.height / 2 - second.size!.height / 2 },
            ],
          };
        case 'center':
          console.log('debug center', first.position, first.size, second.size, {
            x: first.position!.x! + first.size!.width / 2 - second.size!.width / 2,
            y: first.position!.y! + first.size!.height / 2 - second.size!.height / 2,
          });
          return {
            size: {
              width: Math.max(first.size!.width, second.size!.width),
              height: Math.max(first.size!.height, second.size!.height),
            },
            positions: [
              {},
              {
                x: first.position!.x! + first.size!.width / 2 - second.size!.width / 2,
                y: first.position!.y! + first.size!.height / 2 - second.size!.height / 2,
              },
            ],
          };
        case 'right':
          return {
            size: {
              width: Math.max(first.size!.width, second.size!.width),
              height: Math.max(first.size!.height, second.size!.height),
            },
            positions: [
              {},
              {
                x: first.position!.x! + first.size!.width - second.size!.width,
                y: first.position!.y! + first.size!.height / 2 - second.size!.height / 2,
              },
            ],
          };
        case 'bottomLeft':
          return {
            size: {
              width: Math.max(first.size!.width, second.size!.width),
              height: Math.max(first.size!.height, second.size!.height),
            },
            positions: [{}, { x: first.position!.x, y: first.position!.y! + first.size!.height - second.size!.height }],
          };
        case 'bottom':
          return {
            size: {
              width: Math.max(first.size!.width, second.size!.width),
              height: Math.max(first.size!.height, second.size!.height),
            },
            positions: [
              {},
              {
                x: first.position!.x! + first.size!.width / 2 - second.size!.width / 2,
                y: first.position!.y! + first.size!.height - second.size!.height,
              },
            ],
          };
        case 'bottomRight':
          return {
            size: {
              width: Math.max(first.size!.width, second.size!.width),
              height: Math.max(first.size!.height, second.size!.height),
            },
            positions: [
              {},
              {
                x: first.position!.x! + first.size!.width - second.size!.width,
                y: first.position!.y! + first.size!.height - second.size!.height,
              },
            ],
          };
      }
    },
    (bbox: BBox, children: Component[]) => {
      return <g transform={`translate(${bbox.x},${bbox.y})`}>{children.map((c) => c.paint())}</g>;
    },
  );

type VerticalAlignment = 'top' | 'middle' | 'bottom';

type RowOptions = ({ spacing: number } | { totalWidth: number }) & {
  x?: number;
  y?: number;
  alignment: VerticalAlignment;
};

export const row = (options: RowOptions, children: Component[]) =>
  new Component(
    children,
    (interval: SizeInterval, children: Component[]) => {
      children.map((c) => c.layout(interval));
      const width = children.reduce((acc, c) => acc + c.size!.width, 0);
      const height = children.reduce((acc, c) => Math.max(acc, c.size!.height), -Infinity);
      // const top = children.reduce((acc, c) => Math.min(acc, c.position!.y), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, c.position!.y + c.size!.height), -Infinity);
      // const top = children.reduce((acc, c) => Math.min(acc, 0), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, 0 + c.size!.height), -Infinity);
      let yPos: number[];
      switch (options.alignment) {
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
          ownPosition: options.x === undefined || options.y === undefined ? undefined : { x: options.x, y: options.y },
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
          ownPosition: options.x === undefined || options.y === undefined ? undefined : { x: options.x, y: options.y },
        };
      } else {
        throw new Error('never');
      }
    },
    (bbox: BBox, children: Component[]) => {
      return <g transform={`translate(${bbox.x},${bbox.y})`}>{children.map((c) => c.paint())}</g>;
    },
  );

// TODO: width and height probably have to be dynamically computed?? this is getting a bit complicated...
export const vAlign = (
  options: {
    alignment: VerticalAlignment;
    y?: number;
  },
  children: Component[],
) =>
  new Component(
    children,
    (interval: SizeInterval, children: Component[]) => {
      children.map((c) => c.layout(interval));
      const width = children.reduce((acc, c) => acc + c.size!.width, 0);
      const height = children.reduce((acc, c) => Math.max(acc, c.size!.height), -Infinity);
      // const top = children.reduce((acc, c) => Math.min(acc, c.position!.y), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, c.position!.y + c.size!.height), -Infinity);
      // const top = children.reduce((acc, c) => Math.min(acc, 0), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, 0 + c.size!.height), -Infinity);
      let yPos: number[];
      switch (options.alignment) {
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

      return {
        size: {
          width,
          height,
        },
        positions: yPos.map((y) => ({ y })),
        // TODO: these casts are totally unsafe!
        ownPosition: { x: undefined as any as number, y: options.y as number },
      };
    },
    // TODO: this doesn't make sense anymore, because it's going to paint children twice if they've
    // already been painted. Maybe if a child has already been painted we can just return a fragment
    // the second time? Or maybe return a DOM ref somehow? Maybe assign parents during layout pass?
    (bbox: BBox, children: Component[]) => {
      return <g transform={`translate(${bbox.x},${bbox.y})`}>{children.map((c) => c.paint())}</g>;
    },
  );

export const hSpace = (
  options: ({ spacing: number } | { totalWidth: number }) & { x?: number },
  children: Component[],
) =>
  new Component(
    children,
    (interval: SizeInterval, children: Component[]) => {
      children.map((c) => c.layout(interval));
      const width = children.reduce((acc, c) => acc + c.size!.width, 0);
      const height = children.reduce((acc, c) => Math.max(acc, c.size!.height), -Infinity);
      // const top = children.reduce((acc, c) => Math.min(acc, c.position!.y), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, c.position!.y + c.size!.height), -Infinity);
      // const top = children.reduce((acc, c) => Math.min(acc, 0), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, 0 + c.size!.height), -Infinity);

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
              },
              ...acc,
            ],
            [{ x: 0 }],
          )
          .reverse();
        return {
          size: {
            width,
            // height: bottom - top,
            height,
          },
          positions,
          ownPosition: { x: options.x as number, y: undefined as any as number },
        };
      } else if ('totalWidth' in options) {
        const occupiedWidth = children.reduce((width, c) => width + c.size!.width, 0);
        const spacing = (options.totalWidth - occupiedWidth) / (children.length - 1);
        const positions = initial
          .reduce(
            (acc, c, i) => [
              {
                x: acc[0].x + c.size!.width + spacing,
              },
              ...acc,
            ],
            [{ x: 0 }],
          )
          .reverse();
        return {
          size: {
            width,
            // height: bottom - top,
            height,
          },
          positions,
          ownPosition: { x: options.x as number, y: undefined as any as number },
        };
      } else {
        throw new Error('never');
      }
    },
    (bbox: BBox, children: Component[]) => {
      return <g transform={`translate(${bbox.x},${bbox.y})`}>{children.map((c) => c.paint())}</g>;
    },
  );

// TODO: based on this representation, maybe it makes sense for the *group* to own the children
// rather than either of hSpace and vAlign. Basically, by the time we hit the group, the children
// had better be defined, but they are allowed to not be totally defined lower down in the tree.
// This a relaxation of the tree structure that still actually preserves the tree somehow.
// It also specializes into the original tree structure when nothing weird is going on. Plus it
// behaves exactly like the monolithic row component to outside observers if the group owns the
// children.
// One downside/tradeoff to this approach is a bit of nonlocality maybe. If A currently owns a child
// and then I add B that also owns the child, then ownership is transferred from A to A & B's LCA.
// How does this feature interface with layered/staged layouts? Maybe it's easier to just have a
// vertical and a horizontal owner per pass? I can't think of multi-owner situations in a single
// pass that don't have this property, because the only way the owners can't interfere is if they
// are controlling different dimensions. If the owners _do_ interfere then they must necessarily be
// ordered and so belong in different passes. This doesn't happen in this case, because we have one
// horizontal and one vertical owner.
// At the end of the day, a component can only have one DOM owner at a time. So how do we serialize
// the owner? Maybe arbitrarily pick horizontal or vertical owner. Maybe arbitrarily pick the first
// owner we encounter during layout, which might give users a bit more control, but maybe it's less
// predictable than always knowing e.g. the horizontal owner is the DOM owner. Though that does
// introduce an asymmetry/bias between horizontal and vertical axes that can be avoided by choosing
// the first one we encounter.
export const rowComp = (options: RowOptions, children: Component[]) =>
  group([hSpace(options, children), vAlign(options, children)]);

type HorizontalAlignment = 'left' | 'center' | 'right';

type ColOptions = ({ spacing: number } | { totalHeight: number }) & {
  x?: number;
  y?: number;
  alignment: HorizontalAlignment;
};

export const col = (options: ColOptions, children: Component[]) =>
  new Component(
    children,
    (interval: SizeInterval, children: Component[]) => {
      children.map((c) => c.layout(interval));
      const width = _.min(children.map((c) => c.size!.width)) ?? 0;
      const height =
        'totalHeight' in options
          ? options.totalHeight
          : _.sumBy(children, (c) => c.size!.height) + options.spacing * (children.length - 1);
      // const top = children.reduce((acc, c) => Math.min(acc, c.position!.y), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, c.position!.y + c.size!.height), -Infinity);
      // const top = children.reduce((acc, c) => Math.min(acc, 0), Infinity);
      // const bottom = children.reduce((acc, c) => Math.max(acc, 0 + c.size!.height), -Infinity);
      let xPos: number[];
      switch (options.alignment) {
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
          ownPosition: { x: options.x as number, y: options.y as number },
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
          ownPosition: options.x === undefined || options.y === undefined ? undefined : { x: options.x, y: options.y },
        };
      } else {
        throw new Error('never');
      }
    },
    (bbox: BBox, children: Component[]) => {
      return <g transform={`translate(${bbox.x},${bbox.y})`}>{children.map((c) => c.paint())}</g>;
    },
  );

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

// TODO: need to be able to set children's positions before returning so we can correctly compute our bbox size
export const group = (components: Component[]): Component =>
  new Component(
    components,
    (interval: SizeInterval, children: Component[]) => {
      children.map((c) => c.layout(interval));
      const width = children.reduce((acc, c) => Math.max(acc, c.size!.width), -Infinity);
      const height = children.reduce((acc, c) => Math.max(acc, c.size!.height), -Infinity);
      return {
        size: {
          width,
          height,
        },
        positions: children.map((c) => ({
          x: c.position ? (c.position.x ? undefined : 0) : 0,
          y: c.position ? (c.position.y ? undefined : 0) : 0,
        })),
      };
    },
    (bbox: BBox, children: Component[]) => {
      return <g transform={`translate(${bbox.x}, ${bbox.y})`}>{children.map((c) => c.paint())}</g>;
    },
  );

// // TODO: this suggests that children should be records, not arrays
// const group = (components: Record<string, Component>, relations: Record<`${string}->${string}`, Constraint[]>) =>
//   new Component(
//     Object.values(components),
//     (interval: SizeInterval, children: Component[]) => {
//       children.map((c) => c.layout(interval));
//       // COMBAK: for now we assume that the constraints form a single connected component and no
//       // child has a pre-defined position
//       const constraints = Object.values(relations).flat();
//       const solution = solve(constraints);
//       // COMBAK: for now we assume that variables are named as 'foo.<dimension>'
//       const positions = Object.keys(components).map((node) => ({
//         x: solution[`${node}.x`],
//         y: solution[`${node}.y`],
//       }));
//       const left = Math.min(...positions.map((p) => p.x));
//       const top = Math.min(...positions.map((p) => p.y));
//       const right = Math.max(...positions.map((p, i) => p.x + children[i].size!.width));
//       const bottom = Math.max(...positions.map((p, i) => p.y + children[i].size!.height));
//       const width = right - left;
//       const height = bottom - top;
//       return {
//         size: {
//           width,
//           height,
//         },
//         positions,
//       };

//       // TODO: this is all good stuff for generalizing to connected components
//       /* //   compute connected components of components and relations
//       const edges = Object.keys(relations).map((r) => r.split('->') as [string, string]);
//       const connectedComponents = computeConnectedComponents(Object.keys(components), edges);
//       // find any components that already have specified positions.
//       let isXFixed: boolean[] = [];
//       let isYFixed: boolean[] = [];
//       for (const i in connectedComponents) {
//         for (const node of connectedComponents[i]) {
//           if (components[node].position !== undefined) {
//             if (components[node].position!.x !== undefined) {
//               isXFixed[i] = true;
//             }
//             if (components[node].position!.y !== undefined) {
//               isYFixed[i] = true;
//             }
//           }
//         }
//       }
//       // now we solve each connected component
//       // for each dimension,
//       for (const i in isXFixed) {
//         // if a component is fixed then its constraints must be completely solvable
//         if (isXFixed[i]) {
//           // TODO: compute constraints
//           const constraints: any[] = [];
//           const solution = solve(constraints);
//           // TODO: update components with solution
//         } else {
//           // if a component is not fixed then we can set some default values
//           // in fact, one default value is enough, so we arbitrarily choose the first node in the component
//         }
//       } */
//     },
//     (bbox: BBox, children: Component[]) => {
//       // COMBAK: translation? local vs. global coordinates?
//       return <g transform={`translate(${bbox.x},${bbox.y})`}>{children.map((c) => c.paint())}</g>;
//     },
//   );

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
        fromOffset.x += fromChild.position!.x!;
        fromOffset.y += fromChild.position!.y!;
        fromChild = fromChild.parent;
      }
      let toChild: Component | undefined = params.to.ref;
      let toOffset: { x: number; y: number } = { x: 0, y: 0 };
      while (toChild !== undefined && toChild.position !== undefined) {
        toOffset.x += toChild.position!.x!;
        toOffset.y += toChild.position!.y!;
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
        fromOffset.x += fromChild.position!.x!;
        fromOffset.y += fromChild.position!.y!;
        fromChild = fromChild.parent;
      }
      let toChild: Component | undefined = params.to.ref;
      let toOffset: { x: number; y: number } = { x: 0, y: 0 };
      while (toChild !== undefined && toChild.position !== undefined) {
        toOffset.x += toChild.position!.x!;
        toOffset.y += toChild.position!.y!;
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
