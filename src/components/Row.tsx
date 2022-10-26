import _ from 'lodash';
import { ComponentType, forwardRef, PropsWithChildren } from 'react';
import { Constraints, Measure, Placeable, Layout, useBluefishLayout, withBluefish, LayoutFn } from '../bluefish';
import { NewBBoxClass } from '../NewBBox';

export type VerticalAlignment = 'top' | 'middle' | 'bottom';

export type RowProps = ({ spacing: number } | { totalWidth: number } | { spacing: number; totalWidth: number }) & {
  x?: number;
  y?: number;
  alignment: VerticalAlignment;
};

const rowMeasurePolicy =
  (options: RowProps): Measure =>
  (measurables, constraints: Constraints) => {
    console.log('[row] measure policy called', options);
    let placeables;
    if ('totalWidth' in options && 'spacing' in options) {
      // width is completely determined by the totalWidth and spacing, so update the constraints
      placeables = measurables.map((measurable) =>
        measurable.measure({
          ...constraints,
          width: (options.totalWidth - options.spacing * (measurables.length - 1)) / measurables.length,
        }),
      );
    } else {
      placeables = measurables.map((measurable) => measurable.measure(constraints));
    }

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
    if ('spacing' in options) {
      spacing = options.spacing;
    } else {
      const occupiedWidth = _.sumBy(placeables, 'width');
      spacing = (options.totalWidth - occupiedWidth) / (placeables.length - 1);
    }

    if ('totalWidth' in options && 'spacing' in options) {
      placeables.forEach((placeable, index) => {
        placeable.width = (width - spacing * (placeables.length - 1)) / placeables.length;
      });
    }

    console.log('[row] width', width);
    console.log('[row] spacing', spacing);

    let x = 0;
    placeables.forEach((placeable) => {
      console.log('[row] placing before', placeable.left);
      placeable.left = x;
      console.log('[row] placing after', placeable.left);
      x += placeable.width! + spacing;
    });

    const left = _.min(_.map(placeables, 'left')) ?? 0;
    const top = _.max(_.map(placeables, 'top')) ?? 0;

    return { left, top, width, height };
  };

export const Row = LayoutFn((props: RowProps) => rowMeasurePolicy(props));
Row.displayName = 'Row';
