import _ from 'lodash';
import { Children, PropsWithChildren } from 'react';
import { Measure, NewPlaceable, PropsWithBluefish, useBluefishLayout, withBluefish } from '../bluefish';
import { NewBBox } from '../NewBBox';
import { PaddingProps } from './Padding';

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

const backgroundMeasurePolicy =
  (options?: BackgroundProps): Measure =>
  (measurables, constraints) => {
    const placeables = measurables.map((measurable, idx) => {
      const placeable = measurable.measure(constraints);
      return placeable;
    });

    if (placeables.length === 0) {
      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      };
    }
    if (placeables.length !== 2) {
      throw Error('Expected 2 children to background element');
    }

    const padding = options?.padding;
    const { paddingLeft, paddingRight, paddingTop, paddingBottom } =
      padding === undefined
        ? { paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0 }
        : 'all' in padding
        ? { paddingLeft: padding.all, paddingRight: padding.all, paddingTop: padding.all, paddingBottom: padding.all }
        : {
            paddingLeft: padding.left ?? 0,
            paddingRight: padding.right ?? 0,
            paddingTop: padding.top ?? 0,
            paddingBottom: padding.bottom ?? 0,
          };
    // assign bbox of background to surround foreground
    placeables[1].left = placeables[0].left !== undefined ? placeables[0].left - paddingLeft : -paddingLeft;
    placeables[1].top = placeables[0].top !== undefined ? placeables[0].top - paddingTop : -paddingTop;
    placeables[1].right = placeables[0].right !== undefined ? placeables[0].right + paddingRight : undefined;
    placeables[1].bottom = placeables[0].bottom !== undefined ? placeables[0].bottom + paddingBottom : undefined;
    if (placeables[0].width !== undefined) placeables[1].width = placeables[0].width + paddingRight + paddingLeft;
    if (placeables[0].height !== undefined) placeables[1].height = placeables[0].height + paddingTop + paddingBottom;

    const left = _.min(placeables.map((placeable) => placeable.left));
    const top = _.min(placeables.map((placeable) => placeable.top));
    const right = _.max(placeables.map((placeable) => placeable.right));
    const bottom = _.max(placeables.map((placeable) => placeable.bottom));

    console.log('Background bounding box', left, top, right, bottom);
    return {
      left,
      top,
      right,
      bottom,
      width: left !== undefined && right !== undefined ? right - left : undefined,
      height: bottom !== undefined && top !== undefined ? bottom - top : undefined,
    };
  };

export type BackgroundProps = PropsWithBluefish<{
  padding?: PaddingProps;
}>;

export const Background = withBluefish((props: PropsWithChildren<BackgroundProps>) => {
  const { id, domRef, bbox, children } = useBluefishLayout({}, props, backgroundMeasurePolicy(props));
  const childrenList = Children.toArray(children);
  const { name, ...rest } = props;

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
