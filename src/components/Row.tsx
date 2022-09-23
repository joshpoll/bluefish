import _ from 'lodash';
import { ComponentType, forwardRef, PropsWithChildren } from 'react';
import { Constraints, Measure, Placeable, Layout, useBluefishLayout, withBluefish, LayoutFn } from '../bluefish';
import { NewBBoxClass } from '../NewBBox';

export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export type RowProps = ({ spacing: number } | { totalWidth: number }) & {
  x?: number;
  y?: number;
  alignment: VerticalAlignment;
};

const rowMeasurePolicy =
  (options: RowProps): Measure =>
  (measurables, constraints: Constraints) => {
    const placeables = measurables.map((measurable) => measurable.measure(constraints)) as NewBBoxClass[];

    // alignment
    const height = _.max(_.map(placeables, 'height')) ?? 0;

    switch (options.alignment) {
      case 'top':
        placeables.forEach((placeable) => {
          placeable.top = 0;
        });
        break;
      case 'middle':
        placeables.forEach((placeable) => {
          placeable.top = (height - placeable.height!) / 2;
        });
        break;
      case 'bottom':
        placeables.forEach((placeable) => {
          placeable.top = height - placeable.height!;
        });
        break;
    }

    // spacing
    const width = 'totalWidth' in options ? options.totalWidth : _.sumBy(placeables, 'width');

    let spacing: number;
    if ('totalWidth' in options) {
      const occupiedWidth = _.sumBy(placeables, 'width');
      spacing = (options.totalWidth - occupiedWidth) / (placeables.length - 1);
    } else {
      spacing = options.spacing;
    }

    let x = 0;
    placeables.forEach((placeable) => {
      placeable.left = x;
      x += placeable.width! + spacing;
    });

    return { width, height };
  };

export const Row = LayoutFn((props: RowProps) => rowMeasurePolicy(props));
