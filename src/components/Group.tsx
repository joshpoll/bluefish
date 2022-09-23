import _ from 'lodash';
import { Layout, Measure, NewPlaceable } from '../bluefish';

const groupMeasurePolicy: Measure = (measurables, constraints) => {
  const placeables = measurables.map((measurable) => {
    console.log('[set to] name', measurable.name);
    const placeable = measurable.measure(constraints);
    return placeable;
  }) as NewPlaceable[];
  placeables.forEach((placeable) => {
    if (placeable.left === undefined) {
      console.log('placeable.left set to before', placeable.left);
      placeable.left = 0;
      console.log('placeable.left set to after', placeable.left);
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
