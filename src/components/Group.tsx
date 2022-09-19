import { Layout, Measure } from '../bluefish';

const groupMeasurePolicy: Measure = (measurables, constraints) => {
  const placeables = measurables.map((measurable) => measurable.measure(constraints));
  placeables.forEach((placeable) => {
    placeable.placeUnlessDefined({ x: 0, y: 0 });
  });
  return { width: constraints.width, height: constraints.height };
};

export const Group = Layout(groupMeasurePolicy);
