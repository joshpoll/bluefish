import * as _ from 'lodash';
import { Constraint, solve } from './blue';
import { measureText } from './measureText';

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

// export type Component = {
//   children: Component[],
//   layout: (children: Component[]) => Size,
//   paint: () => JSX.Element,
// }

export type Paint = (bbox: BBox, children: Component[]) => JSX.Element;
export type Layout = (
  interval: SizeInterval,
  children: Component[],
) => {
  size: Size;
  positions: Position[];
};

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
    this.children.map((c, i) => (c.position = positions[i]));
    return { size, positions };
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
const svg = (children: Component[]) =>
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

const rect = (params: Rect) =>
  new Component(
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
  );

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
const text = (contents: string, params?: Text) => {
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
};

const position = (position: Position, component: Component) =>
  new Component(
    [component],
    (interval: SizeInterval, children: Component[]) => {
      children.map((c) => c.layout(interval));
      return {
        size: {
          width: interval.width.ub,
          height: interval.height.ub,
        },
        positions: [position],
      };
    },
    (bbox: BBox, children: Component[]) => {
      // return <g transform={`translate(${bbox.x},${bbox.y})`}>
      //   {children[0].paint()}
      // </g>;
      return children[0].paint();
    },
  );

type VerticalAlignment = 'top' | 'middle' | 'bottom';

type RowOptions = { spacing: number } | { totalWidth: number };

const row = (options: RowOptions, alignment: VerticalAlignment, children: Component[]) =>
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

// /* { spacing: 5 } */

export const testRow = svg([
  row({ totalWidth: 300 }, 'top', [
    rect({ width: 100, height: 100, fill: 'firebrick' }),
    rect({ width: 50, height: 200, fill: 'cornflowerblue' }),
    rect({ width: 50, height: 50, fill: 'coral' }),
  ]),
]);

export const testComponent = svg([
  position({ x: 10, y: 10 }, rect({ width: 100, height: 100, fill: 'firebrick' })),
  position({ x: 30, y: 200 }, text('y = mx + 1', { fontSize: '20px' })),
]);

export const annotatedEquation = svg([
  position({ x: 60, y: 50 }, text('FORMULA', { fontSize: 60, fill: 'gray' })),
  position({ x: 10, y: 100 }, rect({ width: 400, height: 5, fill: 'gray' })),
  position({ x: 10, y: 100 }, rect({ width: 5, height: 20, fill: 'gray' })),
  position({ x: 10 + 400, y: 100 }, rect({ width: 5, height: 20, fill: 'gray' })),
  position({ x: 30, y: 200 }, text('y = mx + 1', { fontSize: '80px' })),
  position(
    { x: 10, y: 350 },
    row({ spacing: 10 }, 'bottom', [
      text('identifier', { fontSize: '20px' }),
      text('expression', { fontSize: '20px' }),
      text('operator', { fontSize: '20px' }),
      text('numeric literal', { fontSize: '20px' }),
    ]),
  ),
]);

export const render = (component: Component): JSX.Element => {
  const sizeInterval: SizeInterval = {
    width: { lb: 500, ub: 500 },
    height: { lb: 500, ub: 500 },
  };
  component.layout(sizeInterval);
  return component.paint();
};
