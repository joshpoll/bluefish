import _ from 'lodash';
import { Layout, Measure, NewPlaceable } from '../bluefish';

const groupMeasurePolicy: Measure = (measurables, constraints) => {
  const placeables = measurables.map((measurable) => measurable.measure(constraints)) as NewPlaceable[];
  placeables.forEach((placeable) => {
    if (placeable.left === undefined) {
      placeable.left = 0;
    }
    if (placeable.top === undefined) {
      placeable.top = 0;
    }
  });
  const width = _.max(_.map(placeables, 'width')) ?? 0;
  const height = _.max(_.map(placeables, 'height')) ?? 0;
  return { width, height };
};

export const Group = Layout(groupMeasurePolicy);
