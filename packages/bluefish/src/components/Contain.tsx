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
  direction?: 'horizontal' | 'vertical' | 'both';
}>;

const containMeasurePolicy =
  (options?: ContainerProps): Measure =>
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

    const padding = options?.padding;

    if (placeables.length !== 2) {
      throw Error('Expected 2 children to contain element, but got ' + placeables.length + ' children');
    }

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

    // console.log('padding placeables', placeables, placeables[0].left, placeables[1].left, );
    console.log('contain: padding', {
      paddingLeft,
      paddingRight,
      paddingTop,
      paddingBottom,
    });

    const direction = options?.direction ?? 'both';

    console.log(
      'contain: placeables before',
      {
        left: placeables[0].left,
        right: placeables[0].right,
        top: placeables[0].top,
        bottom: placeables[0].bottom,
        width: placeables[0].width,
        height: placeables[0].height,
      },
      {
        left: placeables[1].left,
        right: placeables[1].right,
        top: placeables[1].top,
        bottom: placeables[1].bottom,
        width: placeables[1].width,
        height: placeables[1].height,
      },
    );

    if (direction === 'horizontal' || direction === 'both') {
      if (placeables[0].left === undefined && placeables[1].left === undefined) {
        // check if width is defined on one of them and use that instead
        if (placeables[0].width !== undefined) {
          placeables[0].left = 0;
        } else if (placeables[1].width !== undefined) {
          placeables[1].left = 0;
        } else {
          placeables[0].left = 0;
        }
      }

      if (placeables[0].left !== undefined) placeables[1].left = placeables[0].left + paddingLeft;
      else if (placeables[1].left !== undefined) placeables[0].left = placeables[1].left - paddingLeft;
      else {
        placeables[0].left = 0;
        placeables[1].left = paddingLeft;
      }
      // console.log('padding after', placeables[0].left, placeables[1].left);

      // set width
      if (placeables[0].width === undefined && placeables[1].width !== undefined) {
        placeables[0].width = placeables[1].width + paddingLeft + paddingRight;
      } else if (placeables[0].width !== undefined && placeables[1].width === undefined) {
        placeables[1].width = placeables[0].width - paddingLeft - paddingRight;
      } else if (placeables[0].width === undefined && placeables[1].width === undefined) {
        placeables[0].width = 0;
        placeables[1].width = paddingLeft + paddingRight;
      }
    }

    if (direction === 'vertical' || direction === 'both') {
      if (placeables[0].top !== undefined) placeables[1].top = placeables[0].top + paddingTop;
      else if (placeables[1].top !== undefined) placeables[0].top = placeables[1].top - paddingTop;
      else {
        placeables[0].top = 0;
        placeables[1].top = paddingTop;
      }

      // set height
      if (placeables[0].height === undefined && placeables[1].height !== undefined) {
        placeables[0].height = placeables[1].height + paddingTop + paddingBottom;
      } else if (placeables[0].height !== undefined && placeables[1].height === undefined) {
        placeables[1].height = placeables[0].height - paddingTop - paddingBottom;
      } else if (placeables[0].height === undefined && placeables[1].height === undefined) {
        placeables[0].height = 0;
        placeables[1].height = paddingTop + paddingBottom;
      }
    }

    console.log(
      'contain: placeables after',
      {
        left: placeables[0].left,
        right: placeables[0].right,
        top: placeables[0].top,
        bottom: placeables[0].bottom,
        width: placeables[0].width,
        height: placeables[0].height,
      },
      {
        left: placeables[1].left,
        right: placeables[1].right,
        top: placeables[1].top,
        bottom: placeables[1].bottom,
        width: placeables[1].width,
        height: placeables[1].height,
      },
    );

    // console.log('padding before', placeables[0].right, placeables[1].right, placeables[0].right! - paddingRight);
    // if (placeables[0].right !== undefined) placeables[1].right = placeables[0].right - paddingRight;
    // else if (placeables[1].right !== undefined) placeables[0].right = placeables[1].right + paddingRight;
    // else {
    //   placeables[0].right = 0;
    //   placeables[1].right = -paddingRight;
    // }
    // console.log('padding after', placeables[0].right, placeables[1].right);

    // if (placeables[0].bottom !== undefined) placeables[1].bottom = placeables[0].bottom - paddingBottom;
    // else if (placeables[1].bottom !== undefined) placeables[0].bottom = placeables[1].bottom + paddingBottom;
    // else {
    //   placeables[0].bottom = 0;
    //   placeables[1].bottom = -paddingBottom;
    // }

    // if (placeables[0].left === undefined) placeables[0].left = placeables[1].left! - paddingLeft;
    // else placeables[1].left = placeables[0].left + paddingLeft;

    // if (placeables[0].top === undefined) placeables[0].top = placeables[1].top! - paddingTop;
    // else placeables[1].top = placeables[0].top + paddingTop;

    // if (placeables[0].right === undefined) placeables[0].right = placeables[1].right! + paddingRight;
    // else placeables[1].right = placeables[0].right - paddingRight;

    // if (placeables[0].bottom === undefined) placeables[0].bottom = placeables[1].bottom! + paddingBottom;
    // else placeables[1].bottom = placeables[0].bottom - paddingBottom;

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
  const { id, domRef, bbox, children } = useBluefishLayout({}, props, containMeasurePolicy(props));

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
