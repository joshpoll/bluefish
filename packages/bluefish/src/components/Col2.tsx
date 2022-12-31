import _ from 'lodash';
import { ComponentType, forwardRef, PropsWithChildren, useContext } from 'react';
import { NewBBoxClass } from '../NewBBox';
import {
  Constraints,
  Measure,
  Placeable,
  Layout,
  useBluefishLayout,
  withBluefish,
  LayoutFn,
  withBluefishFn,
  NewPlaceable,
  useBluefishLayout2,
  withBluefish3,
  RefContext,
} from '../bluefish';

export type HorizontalAlignment = 'left' | 'center' | 'right';

export type ColProps = ({ spacing: number } | { totalHeight: number }) & {
  x?: number;
  y?: number;
  alignment: HorizontalAlignment;
};

const colMeasurePolicy =
  (options: ColProps): Measure =>
  (measurables, constraints: Constraints) => {
    console.log('[colMeasurePolicy2] inputs', options, measurables, constraints);
    const placeables = measurables.map((measurable) => measurable.measure(constraints));
    console.log('[colMeasurePolicy2] placeables', placeables);

    // alignment
    const width = _.max(_.map(placeables, 'width')) ?? 0;

    switch (options.alignment) {
      case 'left':
        placeables.forEach((placeable) => {
          placeable.left = 0;
        });
        break;
      case 'center':
        placeables.forEach((placeable) => {
          placeable.left = (width - placeable.width!) / 2;
        });
        break;
      case 'right':
        placeables.forEach((placeable) => {
          placeable.left = width - placeable.width!;
        });
    }

    // spacing
    const height =
      'totalHeight' in options
        ? options.totalHeight
        : _.sumBy(placeables, 'height') + options.spacing * (placeables.length - 1);

    let spacing: number;
    if ('spacing' in options) {
      spacing = options.spacing;
    } else {
      const occupiedHeight = _.sumBy(placeables, 'height');
      spacing = (options.totalHeight - occupiedHeight) / (placeables.length - 1);
    }

    if ('totalHeight' in options && 'spacing' in options) {
      placeables.forEach((placeable, index) => {
        placeable.height = (height - spacing * (placeables.length - 1)) / placeables.length;
      });
    }

    let y = 0;
    placeables.forEach((placeable) => {
      console.log('placing', placeable, `${placeable.top} -> ${y}`);
      placeable.top = y;
      console.log('placeable.top', placeable.top);
      console.log('placed', placeable, 'y', y);
      y += placeable.height! + spacing;
      console.log('y', y);
    });

    return {
      left: _.minBy(placeables, 'left')?.left ?? 0,
      top: 0,
      width,
      height,
    };
  };

// export const Col = forwardRef((props: PropsWithChildren<ColProps>, ref) => {
//   const { x, y, width, height, children } = useBluefishLayout(
//     colMeasurePolicy(props),
//     { x: props.x, y: props.y },
//     ref,
//     props.children,
//   );

//   return <g transform={`translate(${x ?? 0}, ${y ?? 0})`}>{children}</g>;
// });

// export const ColHOC = withBluefishFn(colMeasurePolicy, (props) => {
//   return <g transform={`translate(${props.x ?? 0}, ${props.y ?? 0})`}>{props.children}</g>;
// });

export const Col = withBluefish3((props: PropsWithChildren<ColProps>) => {
  const { domRef, bbox, children } = useBluefishLayout2({}, props, colMeasurePolicy(props));

  return (
    <g ref={domRef} transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})`}>
      {children}
    </g>
  );
});
Col.displayName = 'Col';
