import _ from 'lodash';
import { ComponentType, forwardRef, PropsWithChildren } from 'react';
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
    const placeables = measurables.map((measurable) => measurable.measure(constraints));

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
        : _.sumBy(placeables, (p) => p.height!) + options.spacing * (placeables.length - 1);

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

    const left = _.min(_.map(placeables, 'left')) ?? 0;
    const top = _.min(_.map(placeables, 'top')) ?? 0;

    return { left, top, width, height };
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

export const Col = LayoutFn((props: ColProps) => colMeasurePolicy(props));
