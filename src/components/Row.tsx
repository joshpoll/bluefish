import _ from 'lodash';
import { ComponentType, forwardRef, PropsWithChildren } from 'react';
import { Constraints, Measure, Placeable, Layout, useGXMLayout, withGXM, LayoutFn } from '../bluefish';

export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export type RowProps = ({ spacing: number } | { totalWidth: number }) & {
  x?: number;
  y?: number;
  alignment: VerticalAlignment;
};

const rowMeasurePolicy =
  (options: RowProps): Measure =>
  (measurables, constraints: Constraints) => {
    const placeables = measurables.map((measurable) => measurable.measure(constraints)) as Placeable[];

    // alignment
    const height = _.max(_.map(placeables, 'measuredHeight')) ?? 0;

    switch (options.alignment) {
      case 'top':
        placeables.forEach((placeable) => {
          placeable.place({ y: 0 });
        });
        break;
      case 'middle':
        placeables.forEach((placeable) => {
          placeable.place({ y: (height - placeable.measuredHeight) / 2 });
        });
        break;
      case 'bottom':
        placeables.forEach((placeable) => {
          placeable.place({ y: height - placeable.measuredHeight });
        });
        break;
    }

    // spacing
    const width = 'totalWidth' in options ? options.totalWidth : _.sumBy(placeables, 'measuredWidth');

    let spacing: number;
    if ('totalWidth' in options) {
      const occupiedWidth = _.sumBy(placeables, 'measuredWidth');
      spacing = (options.totalWidth - occupiedWidth) / (placeables.length - 1);
    } else {
      spacing = options.spacing;
    }

    let x = 0;
    placeables.forEach((placeable) => {
      placeable.place({ x });
      x += placeable.measuredWidth + spacing;
    });

    return { width, height };
  };

export const Row = LayoutFn((props: RowProps) => rowMeasurePolicy(props));
