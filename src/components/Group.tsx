import _ from 'lodash';
import { PropsWithChildren } from 'react';
import { Layout, Measure, NewPlaceable, withBluefish } from '../bluefish';
import { NewBBox } from '../NewBBox';

const groupMeasurePolicy: Measure = (measurables, constraints) => {
  const placeables = measurables.map((measurable, idx) => {
    // console.log('[set to] name', measurable.name);
    console.log(`measurable ${idx}`, measurable);
    const placeable = measurable.measure(constraints);
    console.log(`placed measurable ${idx}`, placeable);
    return placeable;
  });
  placeables.forEach((placeable, idx) => {
    console.log(`placeable ${idx}`, placeable);
    if (placeable.left === undefined) {
      console.log('placeable.left set to before', placeable.left);
      placeable.left = 0;
      console.log('placeable.left set to after', placeable.left);
    }
    if (placeable.top === undefined) {
      placeable.top = 0;
    }
    console.log(`group after: placed placeable ${idx}`, placeable);
  });

  // TODO: might need to preserve "natural" position so I can figure out what the translation should be.

  const left = _.min(_.map(placeables, 'left')) ?? 0;
  const top = _.min(_.map(placeables, 'top')) ?? 0;
  const right = _.max(_.map(placeables, 'right')) ?? 0;
  const bottom = _.max(_.map(placeables, 'bottom')) ?? 0;
  console.log('asdfs', 'left', _.map(placeables, 'left'), _.min(_.map(placeables, 'left')));
  console.log('asdfs', 'group bbox', { left, top, right, bottom });
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
  // const width = _.max(_.map(placeables, 'width')) ?? 0;
  // const height = _.max(_.map(placeables, 'height')) ?? 0;
  // return { width, height };
};

export const Group = Layout(groupMeasurePolicy);

// export const Group = withBluefish(groupMeasurePolicy, (props: PropsWithChildren<{ $bbox?: Partial<NewBBox> }>) => {
//   return <g transform={`translate(${props.$bbox?.left ?? 0}, ${props.$bbox?.top ?? 0})`}>{props.children}</g>;
// });
