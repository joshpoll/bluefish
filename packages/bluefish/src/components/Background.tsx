import _ from 'lodash';
import { Children, PropsWithChildren } from 'react';
import { Measure, NewPlaceable, useBluefishLayout, withBluefish } from '../bluefish';
import { NewBBox } from '../NewBBox';

/**
 * A background component. Takes the syntax
 *
 * <Background>
 *      <Foreground Element/>
 *      <Background Element/>
 * </Background>
 *
 * Where Foreground Element is the element to be placed in the foreground and Background Element is the
 * element to be placed in the background.
 */

const backgroundMeasurePolicy: Measure = (measurables, constraints) => {
  const placeables = measurables.map((measurable, idx) => {
    const placeable = measurable.measure(constraints);
    return placeable;
  });
  if (placeables.length !== 2) {
    throw Error('Expected 2 children to background element');
  }

  // assign bbox of background to surround foreground
  placeables[1].left = placeables[0].left;
  placeables[1].top = placeables[0].top;
  placeables[1].right = placeables[0].right;
  placeables[1].bottom = placeables[0].bottom;

  const left = placeables[0].left ?? undefined;
  const top = placeables[0].top ?? undefined;
  const right = placeables[1].right ?? undefined;
  const bottom = placeables[1].bottom ?? undefined;
  return {
    left,
    top,
    right,
    bottom,
    width: left !== undefined && right !== undefined ? right - left : undefined,
    height: bottom !== undefined && top !== undefined ? bottom - top : undefined,
  };
};

export const Background = withBluefish((props: PropsWithChildren<{}>) => {
  const { id, domRef, bbox, children } = useBluefishLayout({}, props, backgroundMeasurePolicy);
  const childrenList = Children.toArray(children);
  const { ...rest } = props;

  if (childrenList.length !== 2) {
    throw new Error('Expected 2 children from background element');
  }

  const foreground = childrenList[0];
  const background = childrenList[1]; // render background first, then foreground
  return (
    <g
      {...rest}
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})`}
    >
      {background}
      {foreground}
    </g>
  );
});

Background.displayName = 'Background';
