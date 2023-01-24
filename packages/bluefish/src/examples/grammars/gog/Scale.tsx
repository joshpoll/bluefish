import _ from 'lodash';
import { PropsWithChildren } from 'react';
import { Measure, useBluefishLayout } from '../../../bluefish';
import { NewBBoxClass } from '../../../NewBBox';
import { Scale as ScaleType } from './Plot';

export type ScaleProps = {
  xScale?: ScaleType;
  yScale?: ScaleType;
} & {
  left?: boolean;
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  width?: boolean;
  height?: boolean;
};

const scaleMeasurePolicy =
  (props: ScaleProps): Measure =>
  (measurables, constraints) => {
    const placeables = measurables.map((measurable, idx) => {
      // scale the constraints using the props
      // TODO: this isn't right...
      // const { xScale, yScale } = props;
      const { width, height } = constraints;

      // reify scales
      // TODO: this is an interesting copilot suggestion
      // const xScale = props.xScale ?? { type: 'linear', domain: [0, 1], range: [0, width] };
      const xScale = props.xScale ? props.xScale({ width: width!, height: height! }) : (x: number) => x;
      const yScale = props.yScale ? props.yScale({ width: width!, height: height! }) : (y: number) => y;

      const placeable: NewBBoxClass = measurable.measure({
        ...constraints,
        width: xScale(width!),
        height: yScale(height!),
      });
      console.log('placeable before', placeable.width, placeable.height);

      // scale the placeable using the props
      // TODO: we're actually scaling the width and height multiple times here, but it should work
      // for now...
      if (placeable.left !== undefined) {
        placeable.left = props.left !== false ? xScale(placeable.left) : placeable.left;
      } else {
        placeable.left = 0;
      }
      if (placeable.top !== undefined) {
        placeable.top = props.top !== false ? yScale(placeable.top) : placeable.top;
      } else {
        placeable.top = 0;
      }
      placeable.width = placeable.width
        ? props.width !== false
          ? xScale(placeable.width)
          : placeable.width
        : props.width !== false
        ? xScale(width!)
        : width!;
      console.log('placeable height', placeable.height, yScale ? yScale(placeable.height) : undefined);
      placeable.height = placeable.height
        ? props.height !== false
          ? yScale(placeable.height)
          : placeable.height
        : props.height !== false
        ? yScale(height!)
        : height!;
      // placeable.height = placeable.height ? yScale(placeable.height) : yScale(height!);

      console.log('placeable height is now', placeable.height);
      if (placeable.right !== undefined && (placeable.left !== undefined || placeable.width !== undefined)) {
        placeable.right = props.right !== false ? xScale(placeable.right) : placeable.right;
      }
      if (placeable.bottom !== undefined && (placeable.top !== undefined || placeable.height !== undefined)) {
        placeable.bottom = props.bottom !== false ? yScale(placeable.bottom) : placeable.bottom;
      }

      return placeable;
    });

    const placeable = placeables[0];
    console.log(
      'placeable after',
      JSON.stringify({
        left: placeable.left,
        top: placeable.top,
        right: placeable.right,
        bottom: placeable.bottom,
        width: placeable.width,
        height: placeable.height,
      }),
    );

    return {
      left: placeable.left,
      top: placeable.top,
      width: placeable.width,
      height: placeable.height,
      right: placeable.right,
      bottom: placeable.bottom,
    };
  };

export const Scale = (props: PropsWithChildren<ScaleProps>) => {
  const { id, domRef, bbox, children } = useBluefishLayout({}, props, scaleMeasurePolicy(props));

  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})`}
    >
      {children}
    </g>
  );
};
