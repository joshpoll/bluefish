import _ from 'lodash';
import { Children, PropsWithChildren } from 'react';
import { Measure, NewPlaceable, useBluefishLayout, withBluefish } from '../bluefish';
import { PropsWithBluefish } from '../main';
import { NewBBox } from '../NewBBox';
import { PaddingProps } from './Padding';

/**
 * A contain component. Takes the syntax
 *
 * <Contain padding={...}>
 *      <Container/>
 *      <Containee/>
 * </Contain>
 */

export type ContainerProps = PropsWithBluefish<{
  padding?: PaddingProps;
}>;

const containMeasurePolicy =
  (options?: PaddingProps): Measure =>
  (measurables, constraints) => {
    const placeables = measurables.map((measurable, idx) => {
      const placeable = measurable.measure(constraints);
      return placeable;
    });
    if (placeables.length !== 2) {
      throw Error('Expected 2 children to contain element, but got ' + placeables.length + ' children');
    }

    console.log('padding placeables', placeables, placeables[0].left, placeables[1].left);

    const { paddingLeft, paddingRight, paddingTop, paddingBottom } =
      options === undefined
        ? { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }
        : 'all' in options
        ? { paddingLeft: options.all, paddingRight: options.all, paddingTop: options.all, paddingBottom: options.all }
        : {
            paddingLeft: options.left ?? 0,
            paddingRight: options.right ?? 0,
            paddingTop: options.top ?? 0,
            paddingBottom: options.bottom ?? 0,
          };

    if (placeables[0].left === undefined) placeables[0].left = placeables[1].left! - paddingLeft;
    else placeables[1].left = placeables[0].left + paddingLeft;

    if (placeables[0].top === undefined) placeables[0].top = placeables[1].top! - paddingTop;
    else placeables[1].top = placeables[0].top + paddingTop;

    if (placeables[0].right === undefined) placeables[0].right = placeables[1].right! + paddingRight;
    else placeables[1].right = placeables[0].right - paddingRight;

    if (placeables[0].bottom === undefined) placeables[0].bottom = placeables[1].bottom! + paddingBottom;
    else placeables[1].bottom = placeables[0].bottom - paddingBottom;

    const left = _.min(placeables.map((placeable) => placeable.left));
    const top = _.min(placeables.map((placeable) => placeable.top));
    const right = _.max(placeables.map((placeable) => placeable.right));
    const bottom = _.max(placeables.map((placeable) => placeable.bottom));

    return {
      left,
      top,
      right,
      bottom,
      width: left !== undefined && right !== undefined ? right - left : undefined,
      height: bottom !== undefined && top !== undefined ? bottom - top : undefined,
    };
  };

export const Contain = withBluefish((props: ContainerProps) => {
  const { id, domRef, bbox, children } = useBluefishLayout({}, props, containMeasurePolicy(props.padding));

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

Contain.displayName = 'Contain';
