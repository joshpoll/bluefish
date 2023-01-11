import _ from 'lodash';
import { forwardRef, PropsWithChildren } from 'react';
import { Symbol, Measure, Constraints, Placeable, NewPlaceable, withBluefish, useBluefishLayout } from '../bluefish';
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

type AlignProps =
  | { [K in Alignment2D]?: React.CElement<any, any> | React.CElement<any, any>[] }
  | { [K in Alignment1DHorizontal]?: React.CElement<any, any> | React.CElement<any, any>[] }
  | { [K in Alignment1DVertical]?: React.CElement<any, any> | React.CElement<any, any>[] };

export const Align = withBluefish(function Align(props: AlignProps & { symbol?: Symbol }) {
  const { symbol: _, ...rest } = props;
  const children = Object.entries(rest).flatMap(([alignment, child]) => {
    if (Array.isArray(child)) {
      return child.map((c) => ({ alignment: alignment as Alignment2D, child: c }));
    } else {
      return { alignment: alignment as Alignment2D, child };
    }
  });

  const alignments = children.map((c) => c.alignment).map(splitAlignment);

  return <AlignAux alignments={alignments}>{children.map((c) => c.child)}</AlignAux>;
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

// COMBAK: this implementation is brittle. a more robust implementation would probably be to use some
// version of the blue constraint solver here to locally propagate the equality constraints
const alignMeasurePolicy =
  (options: AlignAuxProps): Measure =>
  (measurables, constraints: Constraints) => {
    console.log('[align2] entering alignment node');
    // const [mov, fix] = measurables.map((measurable) => measurable.measure(constraints));
    const placeables = measurables.map((measurable) => measurable.measure(constraints));

    // find components that have a fixed position
    let fixedLeftComponents = placeables.filter(isLeftFixed);
    let firstFixedLeftIndex = placeables.findIndex(isLeftFixed);

    let fixedTopComponents = placeables.filter(isTopFixed);
    let firstFixedTopIndex = placeables.findIndex(isTopFixed);

    let fixedRightComponents = placeables.filter(isRightFixed);
    let firstFixedRightIndex = placeables.findIndex(isRightFixed);

    let fixedBottomComponents = placeables.filter(isBottomFixed);
    let firstFixedBottomIndex = placeables.findIndex(isBottomFixed);

    console.log(
      '[align2]',
      _.zip(
        measurables.map((m) => m.symbol?.symbol.description),
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
    console.log('[align2] fixedXY', fixedLeftComponents, firstFixedLeftIndex, fixedTopComponents, firstFixedTopIndex);

    if (fixedLeftComponents.length === 0) {
      placeables[0].left = 0;
      fixedLeftComponents = [placeables[0]];
      firstFixedLeftIndex = 0;
    }

    if (fixedTopComponents.length === 0) {
      placeables[0].top = 0;
      fixedTopComponents = [placeables[0]];
      firstFixedTopIndex = 0;
    }

    if (fixedRightComponents.length === 0) {
      placeables[0].right = 0;
      fixedRightComponents = [placeables[0]];
      firstFixedRightIndex = 0;
    }

    if (fixedBottomComponents.length === 0) {
      placeables[0].bottom = 0;
      fixedBottomComponents = [placeables[0]];
      firstFixedBottomIndex = 0;
    }

    console.log(
      '[align2] fixedXY after',
      fixedLeftComponents,
      firstFixedLeftIndex,
      fixedTopComponents,
      firstFixedTopIndex,
    );

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

    const fixLeftAnchorPlaceable = fixedLeftComponents[0];
    const fixLeftHorizontalAlignment = options.alignments[firstFixedLeftIndex][1];

    const fixTopAnchorPlaceable = fixedTopComponents[0];
    const fixTopVerticalAlignment = options.alignments[firstFixedTopIndex][0];

    const fixRightAnchorPlaceable = fixedRightComponents[0];
    const fixRightHorizontalAlignment = options.alignments[firstFixedRightIndex][1];

    const fixBottomAnchorPlaceable = fixedBottomComponents[0];
    const fixBottomVerticalAlignment = options.alignments[firstFixedBottomIndex][0];

    let fixAnchor: { x?: number; y?: number } = {};

    console.log(
      '[align2] LeftAnchor',
      JSON.stringify({
        left: fixLeftAnchorPlaceable.left,
        width: fixLeftAnchorPlaceable.width,
        right: fixLeftAnchorPlaceable.right,
      }),
    );

    console.log(
      '[align2] TopAnchor',
      JSON.stringify({
        top: fixTopAnchorPlaceable.top,
        height: fixTopAnchorPlaceable.height,
        bottom: fixTopAnchorPlaceable.bottom,
      }),
    );

    console.log(
      '[align2] RightAnchor',
      JSON.stringify({
        left: fixRightAnchorPlaceable.left,
        width: fixRightAnchorPlaceable.width,
        right: fixRightAnchorPlaceable.right,
      }),
    );

    console.log(
      '[align2] BottomAnchor',
      JSON.stringify({
        top: fixBottomAnchorPlaceable.top,
        height: fixBottomAnchorPlaceable.height,
        bottom: fixBottomAnchorPlaceable.bottom,
      }),
    );

    // console.log('[align2] alignments', options.alignments);

    if (fixLeftHorizontalAlignment === 'left') {
      fixAnchor.x = fixLeftAnchorPlaceable.left;
    } else if (fixLeftHorizontalAlignment === 'center' && fixLeftAnchorPlaceable.width !== undefined) {
      fixAnchor.x = fixLeftAnchorPlaceable.left! + fixLeftAnchorPlaceable.width / 2;
    } else if (fixRightHorizontalAlignment === 'center' && fixRightAnchorPlaceable.width !== undefined) {
      fixAnchor.x = fixRightAnchorPlaceable.right! - fixRightAnchorPlaceable.width / 2;
    } else if (fixRightHorizontalAlignment === 'right') {
      fixAnchor.x = fixRightAnchorPlaceable.right;
    }

    if (fixTopVerticalAlignment === 'top') {
      fixAnchor.y = fixTopAnchorPlaceable.top;
    } else if (fixTopVerticalAlignment === 'center' && fixTopAnchorPlaceable.height !== undefined) {
      fixAnchor.y = fixTopAnchorPlaceable.top! + fixTopAnchorPlaceable.height / 2;
    } else if (fixBottomVerticalAlignment === 'center' && fixBottomAnchorPlaceable.height !== undefined) {
      fixAnchor.y = fixBottomAnchorPlaceable.bottom! - fixBottomAnchorPlaceable.height / 2;
    } else if (fixBottomVerticalAlignment === 'bottom') {
      fixAnchor.y = fixBottomAnchorPlaceable.bottom;
    }

    console.log('[align2] fixAnchor', fixAnchor);

    for (const i in _.zip(options.alignments, placeables)) {
      let [alignment, placeable] = _.zip(options.alignments, placeables)[i];
      const [verticalAlignment, horizontalAlignment] = alignment ?? [undefined, undefined];

      placeable = placeable!;

      try {
        if (horizontalAlignment !== undefined) {
          switch (horizontalAlignment) {
            case 'left':
              placeable.left = fixAnchor.x;
              // if (!isLeftFixed(placeable)) {
              //   placeable.left = fixAnchor.x;
              // } else {
              //   // check that the left is the same as the fixed anchor
              //   if (placeable.left !== fixAnchor.x) {
              //     throw new Error(
              //       `I expected ${'a component'} to have the same left as the fixed anchor (${
              //         fixAnchor.x
              //       }), but it was ${placeable.left} instead`,
              //     );
              //   }
              // }
              break;
            case 'center':
              if (placeable.width === undefined) {
                throw new Error('cannot center align horizontally without width');
              }
              placeable.left = fixAnchor.x! - placeable.width! / 2;
              // if (!isLeftFixed(placeable)) {
              //   placeable.left = fixAnchor.x! - placeable.width! / 2;
              // } else {
              //   if (placeable.left! + placeable.width! / 2 !== fixAnchor.x) {
              //     throw new Error(
              //       `I expected ${'a component'} to have the same horizontal center as the fixed anchor (${
              //         fixAnchor.x
              //       }), but it was ${placeable.left! + placeable.width! / 2} instead`,
              //     );
              //   }
              // }
              break;
            case 'right':
              console.log(
                '[align2] right',
                JSON.stringify({
                  left: placeable.left,
                  width: placeable.width,
                  right: placeable.right,
                }),
              );
              placeable.right = fixAnchor.x;
            // if (!isRightFixed(placeable)) {
            //   placeable.right = fixAnchor.x;
            // } else {
            //   if (placeable.right !== fixAnchor.x) {
            //     throw new Error(
            //       `I expected ${'a component'} to have the same right as the fixed anchor (${
            //         fixAnchor.x
            //       }), but it was ${placeable.right} instead`,
            //     );
            //   }
            //   break;
            // }
          }

          if (verticalAlignment !== undefined) {
            switch (verticalAlignment) {
              case 'top':
                placeable.top = fixAnchor.y;
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
                placeable.top = fixAnchor.y! - placeable.height! / 2;
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
                placeable.bottom = fixAnchor.y;
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

export const AlignAux = withBluefish((props: PropsWithChildren<AlignAuxProps>) => {
  const { domRef, children, bbox } = useBluefishLayout({}, props, alignMeasurePolicy(props));

  return (
    <g ref={domRef} transform={`translate(${bbox!.coord?.translate?.x ?? 0}, ${bbox!.coord?.translate?.y ?? 0})`}>
      {children}
    </g>
  );
});
AlignAux.displayName = 'AlignAux';
