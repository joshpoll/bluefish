import _ from 'lodash';
import { ComponentType, forwardRef, PropsWithChildren } from 'react';
import {
  Constraints,
  Measure,
  Placeable,
  Layout,
  useBluefishLayout,
  withBluefish,
  LayoutFn,
  withBluefishFn,
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
    const placeables = measurables.map((measurable) => measurable.measure(constraints)) as Placeable[];

    // alignment
    const width = _.max(_.map(placeables, 'measuredWidth')) ?? 0;

    switch (options.alignment) {
      case 'left':
        placeables.forEach((placeable) => {
          placeable.place({ x: 0 });
        });
        break;
      case 'center':
        placeables.forEach((placeable) => {
          placeable.place({ x: (width - placeable.measuredWidth) / 2 });
        });
        break;
      case 'right':
        placeables.forEach((placeable) => {
          placeable.place({ x: width - placeable.measuredWidth });
        });
    }

    // spacing
    const height =
      'totalHeight' in options
        ? options.totalHeight
        : _.sumBy(placeables, (p) => p.measuredHeight) + options.spacing * (placeables.length - 1);

    let spacing: number;
    if ('totalHeight' in options) {
      const occupiedHeight = _.sumBy(placeables, 'measuredHeight');
      spacing = (options.totalHeight - occupiedHeight) / (placeables.length - 1);
    } else {
      spacing = options.spacing;
    }

    let y = 0;
    placeables.forEach((placeable) => {
      placeable.place({ y });
      y += placeable.measuredHeight + spacing;
    });

    return { width, height };
  };

export const Col = forwardRef((props: PropsWithChildren<ColProps>, ref) => {
  const { x, y, width, height, children } = useBluefishLayout(
    colMeasurePolicy(props),
    { x: props.x, y: props.y },
    ref,
    props.children,
  );

  return <g transform={`translate(${x ?? 0}, ${y ?? 0})`}>{children}</g>;
});

export const ColHOC = withBluefishFn(colMeasurePolicy, (props) => {
  return <g transform={`translate(${props.x ?? 0}, ${props.y ?? 0})`}>{props.children}</g>;
});

export const ColLayout = LayoutFn((props: ColProps) => colMeasurePolicy(props));