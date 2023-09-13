import _ from 'lodash';
import { ComponentType, forwardRef, PropsWithChildren } from 'react';
import { NewBBoxClass } from '../NewBBox';
import {
  Constraints,
  Measure,
  Placeable,
  useBluefishLayoutInternal,
  withBluefish,
  NewPlaceable,
  useBluefishLayout,
} from '../bluefish';

export type PaddingProps = { left: number; right: number; top: number; bottom: number } | { all: number };

const paddingMeasurePolicy =
  (options: PaddingProps): Measure =>
  (measurables, constraints: Constraints) => {
    //console.log('paddingMeasurePolicy', measurables, constraints);
    if (measurables.length !== 1) {
      throw new Error('Padding must have exactly one child');
    }

    const { left, right, top, bottom } =
      'all' in options ? { left: options.all, right: options.all, top: options.all, bottom: options.all } : options;
    const childConstraints = {
      width: constraints.width ? constraints.width - left - right : undefined,
      height: constraints.height ? constraints.height - top - bottom : undefined,
    };
    const placeables = measurables.map((measurable) => measurable.measure(childConstraints));

    // let bboxLeft = 0;
    // if (placeables[0].left === undefined) {
    placeables[0].left = left;
    // } else {
    //   bboxLeft = placeables[0].left - left;
    // }

    // let bboxTop = 0;
    // if (placeables[0].top === undefined) {
    placeables[0].top = top;
    // } else {
    //   bboxTop = placeables[0].top - top;
    // }

    return {
      left: 0,
      top: 0,
      // left: bboxLeft,
      // top: bboxTop,
      width: placeables[0].width! + left + right,
      height: placeables[0].height! + top + bottom,
      // coord: {
      //   translate: { x: bboxLeft, y: bboxTop },
      // },
    };
  };

export const Padding = withBluefish((props: PropsWithChildren<PaddingProps>) => {
  const { id, domRef, bbox, children } = useBluefishLayout({}, props, paddingMeasurePolicy(props));

  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})`}
    >
      {children}
    </g>
  );
});
