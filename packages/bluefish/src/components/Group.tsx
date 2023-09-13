import _ from 'lodash';
import { PropsWithChildren } from 'react';
import { Measure, NewPlaceable, PropsWithBluefish, useBluefishLayout, withBluefish } from '../bluefish';
import { NewBBox } from '../NewBBox';

const groupMeasurePolicy =
  (props: { positionChildren?: boolean; x?: number; y?: number }): Measure =>
  (measurables, constraints) => {
    const placeables = measurables.map((measurable, idx) => {
      // console.log('[set to] name', measurable.name);
      // console.log(`measurable ${idx}`, measurable);
      const placeable = measurable.measure(constraints);
      // console.log(`placed measurable ${idx}`, placeable);
      return placeable;
    });
    if (props.positionChildren) {
      placeables.forEach((placeable, idx) => {
        // console.log(`placeable ${idx}`, placeable);
        if (placeable.left === undefined) {
          // console.log('placeable.left set to before', placeable.left);
          placeable.left = 0;
          // console.log('placeable.left set to after', placeable.left);
        }
        if (placeable.top === undefined) {
          placeable.top = 0;
        }
        // console.log(`group after: placed placeable ${idx}`, placeable);
      });
    }

    // TODO: might need to preserve "natural" position so I can figure out what the translation should be.

    const left = _.min(_.map(placeables, 'left')) ?? 0;
    const top = _.min(_.map(placeables, 'top')) ?? 0;
    const right = _.max(_.map(placeables, 'right')) ?? 0;
    const bottom = _.max(_.map(placeables, 'bottom')) ?? 0;
    //console.log('asdfs', 'left', _.map(placeables, 'left'), _.min(_.map(placeables, 'left')));
    //console.log('asdfs', 'group bbox', { left, top, right, bottom });
    return {
      left,
      top,
      right,
      bottom,
      width: right - left,
      height: bottom - top,
      coord: {
        translate: {
          x: props.x ? props.x - left : undefined,
          y: props.y ? props.y - top : undefined,
        },
      },
    };
    // const width = _.max(_.map(placeables, 'width')) ?? 0;
    // const height = _.max(_.map(placeables, 'height')) ?? 0;
    // return { width, height };
  };

export const Group = withBluefish(
  (
    props: PropsWithBluefish<
      {
        positionChildren?: boolean;
        debug?: boolean;
        x?: number;
        y?: number;
      } & React.SVGProps<SVGGElement>
    >,
  ) => {
    const { id, domRef, bbox, children } = useBluefishLayout({}, props, groupMeasurePolicy(props));
    const { name, x, y, ...rest } = props;

    return (
      <g
        {...rest}
        id={id}
        ref={domRef}
        transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})`}
      >
        {children}
        {/* <rect x={bbox?.left} y={bbox?.top} width={bbox?.width} height={bbox?.height} fill="none" stroke="magenta" /> */}
      </g>
    );
  },
);
Group.displayName = 'Group';
