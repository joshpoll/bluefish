import _ from 'lodash';
import { Layout, Measure } from '../bluefish';

const groupMeasurePolicy: Measure = (measurables, constraints) => {
  const placeables = measurables.map((measurable) => measurable.measure(constraints));
  placeables.forEach((placeable) => {
    placeable.placeUnlessDefined({ x: 0, y: 0 });
  });
  const width = _.max(_.map(placeables, 'measuredWidth')) ?? 0;
  const height = _.max(_.map(placeables, 'measuredHeight')) ?? 0;
  return { width, height };
};

export const Group = Layout(groupMeasurePolicy);
