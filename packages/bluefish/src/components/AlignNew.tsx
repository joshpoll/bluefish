import _ from 'lodash';
import { forwardRef, PropsWithChildren } from 'react';
import {
  Symbol,
  Measure,
  Constraints,
  Placeable,
  NewPlaceable,
  withBluefish,
  useBluefishLayout,
  PropsWithBluefish,
} from '../bluefish';
import { NewBBoxClass } from '../NewBBox';

export type Alignment2D =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'centerLeft'
  | 'center'
  | 'centerRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

// generate a union of single-key objects using Alignment2D as the keys
export type Alignment2DObjs = { [K in Alignment2D]: { [k in K]: boolean } }[Alignment2D];

export type VerticalAlignment = 'top' | 'center' | 'bottom';
export type HorizontalAlignment = 'left' | 'center' | 'right';

export type Alignment1DHorizontal = 'left' | 'centerHorizontally' | 'right';
export type Alignment1DVertical = 'top' | 'centerVertically' | 'bottom';

export type Alignment1D = Alignment1DHorizontal | Alignment1DVertical;

export type Alignment1DObjs = { [K in Alignment1D]: { [k in K]: boolean } }[Alignment1D];

export type AlignAuxProps = { alignments: [VerticalAlignment | undefined, HorizontalAlignment | undefined][] } & {
  x?: number;
  y?: number;
};

export const splitAlignment = (
  alignment: Alignment2D | Alignment1D,
): [VerticalAlignment | undefined, HorizontalAlignment | undefined] => {
  let verticalAlignment: VerticalAlignment | undefined;
  let horizontalAlignment: HorizontalAlignment | undefined;
  switch (alignment) {
    case 'top':
    case 'topLeft':
    case 'topCenter':
    case 'topRight':
      verticalAlignment = 'top';
      break;
    case 'centerVertically':
    case 'centerLeft':
    case 'center':
    case 'centerRight':
      verticalAlignment = 'center';
      break;
    case 'bottom':
    case 'bottomLeft':
    case 'bottomCenter':
    case 'bottomRight':
      verticalAlignment = 'bottom';
      break;
  }

  switch (alignment) {
    case 'left':
    case 'topLeft':
    case 'centerLeft':
    case 'bottomLeft':
      horizontalAlignment = 'left';
      break;
    case 'centerHorizontally':
    case 'topCenter':
    case 'center':
    case 'bottomCenter':
      horizontalAlignment = 'center';
      break;
    case 'right':
    case 'topRight':
    case 'centerRight':
    case 'bottomRight':
      horizontalAlignment = 'right';
      break;
  }

  return [verticalAlignment, horizontalAlignment];
};

// type AlignProps =
//   | { [K in Alignment2D]?: React.CElement<any, any> | React.CElement<any, any>[] }
//   | { [K in Alignment1DHorizontal]?: React.CElement<any, any> | React.CElement<any, any>[] }
//   | { [K in Alignment1DVertical]?: React.CElement<any, any> | React.CElement<any, any>[] };
type AlignProps = PropsWithBluefish<{
  x?: number;
  y?: number;
  alignment?: Alignment2D | Alignment1D;
}>;

export const AlignNew = withBluefish(function Align(props: AlignProps) {
  const { id, domRef, children, bbox } = useBluefishLayout({}, props, alignMeasurePolicy(props));

  // return <AlignAux alignments={alignments}>{children.map((c) => c.child)}</AlignAux>;
  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox!.coord?.translate?.x ?? 0}, ${bbox!.coord?.translate?.y ?? 0})`}
    >
      {children}
    </g>
  );
});

// COMBAK: this implementation is brittle. a more robust implementation would probably be to use some
// version of the blue constraint solver here to locally propagate the equality constraints
const alignMeasurePolicy =
  (options: AlignProps): Measure =>
  (measurables, constraints: Constraints) => {
    // basically we have two giant equalities to solve here: the horizontal and vertical axes
    // each component defines what horizontal and vertical alignment it wants (if any)
    // it's our job to propagate values to all of them.

    // first we identify all the components that have a fixed position
    // then we propagate the fixed position to all the other components
    // fin.

    const placeables = measurables.map((measurable) => measurable.measure(constraints));

    const alignments: [VerticalAlignment | undefined, HorizontalAlignment | undefined][] = measurables
      .map((m) => m.guidePrimary ?? options.alignment)
      .map((alignment) => (alignment !== undefined ? splitAlignment(alignment) : [undefined, undefined]));

    const verticalPlaceables = _.zip(placeables, alignments).filter(([placeable, alignment]) => {
      if (alignment === undefined) {
        return false;
      }
      const [verticalAlignment, horizontalAlignment] = alignment;
      return verticalAlignment !== undefined;
    });

    const horizontalPlaceables = _.zip(placeables, alignments).filter(([placeable, alignment]) => {
      if (alignment === undefined) {
        return false;
      }
      const [verticalAlignment, horizontalAlignment] = alignment;
      return horizontalAlignment !== undefined;
    });

    const verticalValue =
      verticalPlaceables
        .map(([placeable, alignment]) => {
          const [verticalAlignment, horizontalAlignment] = alignment!;
          if (verticalAlignment === 'top') {
            return placeable!.top;
          } else if (verticalAlignment === 'center') {
            if (placeable!.top === undefined || placeable!.height === undefined) {
              return undefined;
            }
            return placeable!.top + placeable!.height / 2;
          } else if (verticalAlignment === 'bottom') {
            return placeable!.bottom;
          } else {
            return undefined;
          }
        })
        .filter((v) => v !== undefined)[0] ?? 0;

    console.log(
      '[AlignNew] potential vertical values',
      options.alignment,
      measurables.map((m) => m.name?.symbol?.description),
      verticalPlaceables
        .map(([placeable, alignment]) => {
          const [verticalAlignment, horizontalAlignment] = alignment!;
          if (verticalAlignment === 'top') {
            return placeable!.top;
          } else if (verticalAlignment === 'center') {
            if (placeable!.top === undefined || placeable!.height === undefined) {
              return undefined;
            }
            return placeable!.top + placeable!.height / 2;
          } else if (verticalAlignment === 'bottom') {
            return placeable!.bottom;
          } else {
            return undefined;
          }
        })
        .filter((v) => v !== undefined),
    );

    const horizontalValue =
      horizontalPlaceables
        .map(([placeable, alignment]) => {
          const [verticalAlignment, horizontalAlignment] = alignment!;
          if (horizontalAlignment === 'left') {
            return placeable!.left;
          } else if (horizontalAlignment === 'center') {
            if (placeable!.left === undefined || placeable!.width === undefined) {
              return undefined;
            }
            return placeable!.left + placeable!.width / 2;
          } else if (horizontalAlignment === 'right') {
            return placeable!.right;
          } else {
            return undefined;
          }
        })
        .filter((v) => v !== undefined)[0] ?? 0;

    // console.log('[AlignNew] verticalValue', verticalValue);
    // console.log('[AlignNew] horizontalValue', horizontalValue);

    for (const [placeable, alignment] of verticalPlaceables) {
      // console.log('[AlignNew] placeable', placeable);
      // console.log('[AlignNew] alignment', alignment);
      const [verticalAlignment, horizontalAlignment] = alignment!;
      if (verticalAlignment === 'top') {
        placeable!.top = verticalValue;
      } else if (verticalAlignment === 'center') {
        if (placeable!.height === undefined) {
          continue;
        }
        placeable!.top = verticalValue - placeable!.height / 2;
      } else if (verticalAlignment === 'bottom') {
        placeable!.bottom = verticalValue;
      }
    }

    for (const [placeable, alignment] of horizontalPlaceables) {
      // console.log('[AlignNew] placeable', placeable);
      // console.log('[AlignNew] alignment', alignment);
      const [verticalAlignment, horizontalAlignment] = alignment!;
      if (horizontalAlignment === 'left') {
        placeable!.left = horizontalValue;
      } else if (horizontalAlignment === 'center') {
        if (placeable!.width === undefined) {
          continue;
        }
        placeable!.left = horizontalValue - placeable!.width / 2;
      } else if (horizontalAlignment === 'right') {
        placeable!.right = horizontalValue;
      }
    }

    // left is the minimimum of the lefts of all placeables. however, if any left is undefined,
    // short circuit and return undefined.
    const left = _.map(placeables, 'left').some((l) => l === undefined) ? undefined : _.min(_.map(placeables, 'left'));
    const right = _.map(placeables, 'right').some((r) => r === undefined)
      ? undefined
      : _.max(_.map(placeables, 'right'));
    const top = _.map(placeables, 'top').some((t) => t === undefined) ? undefined : _.min(_.map(placeables, 'top'));
    const bottom = _.map(placeables, 'bottom').some((b) => b === undefined)
      ? undefined
      : _.max(_.map(placeables, 'bottom'));

    const width = right === undefined || left === undefined ? undefined : right - left;
    const height = bottom === undefined || top === undefined ? undefined : bottom - top;

    return {
      coord: {
        translate: {
          x: options.x,
          y: options.y,
        },
      },
      left,
      top,
      right,
      bottom,
      width,
      height,
    };
  };
