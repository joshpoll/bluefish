import _ from 'lodash';
import { forwardRef } from 'react';
import { Measure, Constraints, Placeable, LayoutFn, NewPlaceable } from '../bluefish';
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

export type Align2AuxProps = { alignments: [VerticalAlignment | undefined, HorizontalAlignment | undefined][] } & {
  x?: number;
  y?: number;
};

export const splitAlignment = (
  alignment: Alignment2D | Alignment1D,
): [VerticalAlignment | undefined, HorizontalAlignment | undefined] => {
  let verticalAlignment: VerticalAlignment | undefined;
  let horizontalAlignment: HorizontalAlignment | undefined;
  switch (alignment) {
    case 'topLeft':
    case 'topCenter':
    case 'topRight':
      verticalAlignment = 'top';
      break;
    case 'centerLeft':
    case 'center':
    case 'centerRight':
      verticalAlignment = 'center';
      break;
    case 'bottomLeft':
    case 'bottomCenter':
    case 'bottomRight':
      verticalAlignment = 'bottom';
      break;
  }

  switch (alignment) {
    case 'topLeft':
    case 'centerLeft':
    case 'bottomLeft':
      horizontalAlignment = 'left';
      break;
    case 'topCenter':
    case 'center':
    case 'bottomCenter':
      horizontalAlignment = 'center';
      break;
    case 'topRight':
    case 'centerRight':
    case 'bottomRight':
      horizontalAlignment = 'right';
      break;
  }

  return [verticalAlignment, horizontalAlignment];
};

type Align2Props =
  | { [K in Alignment2D]?: React.CElement<any, any> | React.CElement<any, any>[] }
  | { [K in Alignment1DHorizontal]?: React.CElement<any, any> | React.CElement<any, any>[] }
  | { [K in Alignment1DVertical]?: React.CElement<any, any> | React.CElement<any, any>[] };

export const Align2 = forwardRef(function Align2(props: Align2Props, ref: any) {
  const children = Object.entries(props).flatMap(([alignment, child]) => {
    if (Array.isArray(child)) {
      return child.map((c) => ({ alignment: alignment as Alignment2D, child: c }));
    } else {
      return { alignment: alignment as Alignment2D, child };
    }
  });

  const alignments = children.map((c) => c.alignment).map(splitAlignment);

  return (
    <Align2Aux ref={ref} alignments={alignments}>
      {children.map((c) => c.child)}
    </Align2Aux>
  );
});

const isLeftFixed = (placeable: NewBBoxClass): boolean => {
  return placeable.left !== undefined && placeable.coord !== undefined && placeable.coord.translate?.x !== undefined;
};

const isTopFixed = (placeable: NewBBoxClass): boolean => {
  return placeable.top !== undefined && placeable.coord !== undefined && placeable.coord.translate?.y !== undefined;
};

const isRightFixed = (placeable: NewBBoxClass): boolean => {
  return placeable.right !== undefined && placeable.coord !== undefined && placeable.coord.translate?.x !== undefined;
};

const isBottomFixed = (placeable: NewBBoxClass): boolean => {
  return placeable.bottom !== undefined && placeable.coord !== undefined && placeable.coord.translate?.y !== undefined;
};

const isWidthFixed = (placeable: NewBBoxClass): boolean => {
  return placeable.width !== undefined && placeable.coord !== undefined && placeable.coord.scale?.x !== undefined;
};

const isHeightFixed = (placeable: NewBBoxClass): boolean => {
  return placeable.height !== undefined && placeable.coord !== undefined && placeable.coord.scale?.y !== undefined;
};

const alignMeasurePolicy =
  (options: Align2AuxProps): Measure =>
  (measurables, constraints: Constraints) => {
    console.log('[align2] entering alignment node');
    // const [mov, fix] = measurables.map((measurable) => measurable.measure(constraints));
    const placeables = measurables.map((measurable) => measurable.measure(constraints));

    // find components that have a fixed position
    let fixedXComponents = placeables.filter(isLeftFixed);
    let firstFixedXIndex = placeables.findIndex(isLeftFixed);
    let fixedYComponents = placeables.filter(isTopFixed);
    let firstFixedYIndex = placeables.findIndex(isTopFixed);

    console.log(
      '[align2]',
      _.zip(
        measurables.map((m) => m.name),
        options.alignments,
        placeables.map((p) =>
          JSON.stringify({
            left: p.left,
            top: p.top,
            width: p.width,
            height: p.height,
            right: p.right,
            bottom: p.bottom,
          }),
        ),
      ),
    );
    console.log('[align2] fixedXY', fixedXComponents, firstFixedXIndex, fixedYComponents, firstFixedYIndex);

    if (fixedXComponents.length === 0) {
      placeables[0].left = 0;
      fixedXComponents = [placeables[0]];
      firstFixedXIndex = 0;
    }

    if (fixedYComponents.length === 0) {
      placeables[0].top = 0;
      fixedYComponents = [placeables[0]];
      firstFixedYIndex = 0;
    }

    console.log('[align2] fixedXY after', fixedXComponents, firstFixedXIndex, fixedYComponents, firstFixedYIndex);

    // if (fixedXComponents.length > 0) {
    //   // throw if there are multiple fixed x components and they don't all have the same x
    //   const fixedX = fixedXComponents[0].left;
    //   if (fixedXComponents.some((placeable) => placeable.left !== fixedX)) {
    //     throw new Error(
    //       `I expected all fixed x components to have the same x. Instead, I found: ${fixedXComponents
    //         .map((placeable, i) => `${measurables[i].name} at ${placeable.left}`)
    //         .join(', ')}`,
    //     );
    //   }
    // }

    // if (fixedYComponents.length > 0) {
    //   // throw if there are multiple fixed y components and they don't all have the same y
    //   const fixedY = fixedYComponents[0].top;
    //   if (fixedYComponents.some((placeable) => placeable.top !== fixedY)) {
    //     throw new Error(
    //       `I expected all fixed y components to have the same y. Instead, I found: ${fixedYComponents
    //         .map((placeable, i) => `${measurables[i].name} at ${placeable.top}`)
    //         .join(', ')}`,
    //     );
    //   }
    // }

    const fixXAnchorPlaceable = fixedXComponents[0];
    const fixVerticalAlignment = options.alignments[firstFixedXIndex][0];
    const fixYAnchorPlaceable = fixedYComponents[0];
    const fixHorizontalAlignment = options.alignments[firstFixedYIndex][1];
    let fixAnchor: { x?: number; y?: number } = {};

    console.log(
      '[align2] XAnchor',
      JSON.stringify({
        left: fixXAnchorPlaceable.left,
        width: fixXAnchorPlaceable.width,
        right: fixXAnchorPlaceable.right,
      }),
    );

    console.log(
      '[align2] YAnchor',
      JSON.stringify({
        top: fixYAnchorPlaceable.top,
        height: fixYAnchorPlaceable.height,
        bottom: fixYAnchorPlaceable.bottom,
      }),
    );

    if (fixHorizontalAlignment === 'left') {
      fixAnchor.x = fixXAnchorPlaceable.left;
    } else if (fixHorizontalAlignment === 'center') {
      if (fixXAnchorPlaceable.width === undefined) {
        throw new Error('cannot center align horizontally without width');
      }
      fixAnchor.x = fixXAnchorPlaceable.left! + fixXAnchorPlaceable.width / 2;
    } else if (fixHorizontalAlignment === 'right') {
      fixAnchor.x = fixXAnchorPlaceable.right;
    }

    if (fixVerticalAlignment === 'top') {
      fixAnchor.y = fixYAnchorPlaceable.top;
    } else if (fixVerticalAlignment === 'center') {
      if (fixYAnchorPlaceable.height === undefined) {
        throw new Error('cannot center align vertically without height');
      }
      fixAnchor.y = fixYAnchorPlaceable.top! + fixYAnchorPlaceable.height / 2;
    } else if (fixVerticalAlignment === 'bottom') {
      fixAnchor.y = fixYAnchorPlaceable.bottom;
    }

    console.log('[align2] fixAnchor', fixAnchor);

    for (const i in _.zip(options.alignments, placeables)) {
      let [alignment, placeable] = _.zip(options.alignments, placeables)[i];
      const [verticalAlignment, horizontalAlignment] = alignment ?? [undefined, undefined];

      placeable = placeable!;

      // if we're visiting a fixed component, skip it
      // if (placeable.left !== undefined && placeable.top !== undefined) {
      //   continue;
      // }

      try {
        if (horizontalAlignment !== undefined) {
          switch (horizontalAlignment) {
            case 'left':
              if (!isLeftFixed(placeable)) {
                placeable.left = fixAnchor.x;
              } else {
                // check that the left is the same as the fixed anchor
                if (placeable.left !== fixAnchor.x) {
                  throw new Error(
                    `I expected ${'a component'} to have the same left as the fixed anchor (${
                      fixAnchor.x
                    }), but it was ${placeable.left} instead`,
                  );
                }
              }
              break;
            case 'center':
              if (placeable.width === undefined) {
                throw new Error('cannot center align horizontally without width');
              }
              if (!isLeftFixed(placeable)) {
                placeable.left = fixAnchor.x! - placeable.width! / 2;
              } else {
                if (placeable.left! + placeable.width! / 2 !== fixAnchor.x) {
                  throw new Error(
                    `I expected ${'a component'} to have the same horizontal center as the fixed anchor (${
                      fixAnchor.x
                    }), but it was ${placeable.left! + placeable.width! / 2} instead`,
                  );
                }
              }
              break;
            case 'right':
              if (!isRightFixed(placeable)) {
                placeable.right = fixAnchor.x;
              } else {
                if (placeable.right !== fixAnchor.x) {
                  throw new Error(
                    `I expected ${'a component'} to have the same right as the fixed anchor (${
                      fixAnchor.x
                    }), but it was ${placeable.right} instead`,
                  );
                }
                break;
              }
          }

          if (verticalAlignment !== undefined) {
            switch (verticalAlignment) {
              case 'top':
                if (!isTopFixed(placeable)) {
                  placeable.top = fixAnchor.y;
                } else {
                  if (placeable.top !== fixAnchor.y) {
                    throw new Error(
                      `I expected ${'a component'} to have the same top as the fixed anchor (${
                        fixAnchor.y
                      }), but it was ${placeable.top} instead`,
                    );
                  }
                }
                break;
              case 'center':
                if (placeable.height === undefined) {
                  throw new Error('cannot center align vertically without height');
                }
                if (!isTopFixed(placeable)) {
                  placeable.top = fixAnchor.y! - placeable.height! / 2;
                } else {
                  if (placeable.top! + placeable.height! / 2 !== fixAnchor.y) {
                    throw new Error(
                      `I expected ${'a component'} to have the same vertical center as the fixed anchor (${
                        fixAnchor.y
                      }), but it was ${placeable.top! + placeable.height! / 2} instead`,
                    );
                  }
                }
                break;
              case 'bottom':
                if (!isBottomFixed(placeable)) {
                  placeable.bottom = fixAnchor.y;
                } else {
                  if (placeable.bottom !== fixAnchor.y) {
                    throw new Error(
                      `I expected ${'a component'} to have the same bottom as the fixed anchor (${
                        fixAnchor.y
                      }), but it was ${placeable.bottom} instead`,
                    );
                  }
                }
                break;
            }
          }
        }
      } catch (e) {
        // continue;
        throw e;
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

    console.log(
      '[align2] bbox',
      JSON.stringify({
        left,
        right,
        top,
        bottom,
        width,
        height,
      }),
    );

    return {
      left,
      top,
      right,
      bottom,
      width,
      height,
    };
  };

export const Align2Aux = LayoutFn((props: Align2AuxProps) => alignMeasurePolicy(props));
Align2Aux.displayName = 'Align2Aux';
