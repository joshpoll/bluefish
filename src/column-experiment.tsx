import * as _ from 'lodash';
import { Measure } from './grafik';
import { Layout } from './react-experiment';

export type ColumnProps = {
  modifier: any;
};

const measurePolicy: Measure = (measurables, constraints) => {
  const placeables = measurables.map((measurable) => measurable.measure(constraints));
  // TODO: make proper interface for placeable with width and height (not measuredWidth and measuredHeight)
  const height = _.sumBy(placeables, 'measuredHeight');
  const width = _.max(_.map(placeables, 'measuredWidth')) ?? 0;

  let y = 0;
  placeables.forEach((placeable) => {
    placeable.place({ x: 0, y });
    y += placeable.measuredHeight;
  });

  return { width, height };
};

export const Column = (props: ColumnProps, children: any[]) => {
  return <Layout measure={measurePolicy}>{children}</Layout>;
};
