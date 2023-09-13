import _ from 'lodash';
import { forwardRef, PropsWithChildren, useImperativeHandle } from 'react';
import {
  withBluefish,
  BBox,
  useBluefishContext,
  Constraints,
  MeasureResult,
  Measure,
  useBluefishLayout,
  PropsWithBluefish,
} from '../bluefish';
import { NewBBox, NewBBoxClass } from '../NewBBox';
import { Alignment2D, splitAlignment } from './Align';
import { rowMeasurePolicy } from './Row';

// export type ConnectorProps = React.SVGProps<SVGLineElement> & {
//   $from: {
//     the: Alignment2D;
//     of: BluefishRef;
//   };
//   $to: {
//     the: Alignment2D;
//     of: BluefishRef;
//   };
// };
export type LinkProps = PropsWithBluefish<
  React.SVGProps<SVGLineElement> & {
    $from?: Alignment2D;
    $to?: Alignment2D;
  }
>;

const connectorMeasurePolicy = (props: LinkProps): Measure => {
  return (measurables, constraints: any) => {
    const [from, to] = measurables.map((m) => m.measure(constraints));
    const [fromYDir, fromXDir] = splitAlignment(props.$from ?? measurables[0].guidePrimary ?? 'center');
    const [toYDir, toXDir] = splitAlignment(props.$to ?? measurables[1].guidePrimary ?? 'center');
    //console.log('[connector] from', from, fromYDir, fromXDir);
    //console.log('[connector] to', to, toYDir, toXDir);

    let fromX, fromY, toX, toY;
    if (fromXDir === 'left') {
      fromX = from.left;
    } else if (fromXDir === 'right') {
      fromX = from.right;
    } else {
      fromX = from.left! + from.width! / 2;
    }

    if (fromYDir === 'top') {
      fromY = from.top;
    } else if (fromYDir === 'bottom') {
      fromY = from.bottom;
    } else {
      fromY = from.top! + from.height! / 2;
    }

    // console.log(
    //   '[connector] to BBox',
    //   JSON.stringify({
    //     left: to.left,
    //     right: to.right,
    //     top: to.top,
    //     bottom: to.bottom,
    //     width: to.width,
    //     height: to.height,
    //   }),
    // );
    if (toXDir === 'left') {
      toX = to.left;
    } else if (toXDir === 'right') {
      toX = to.right;
    } else {
      toX = to.left! + to.width! / 2;
    }

    if (toYDir === 'top') {
      toY = to.top;
    } else if (toYDir === 'bottom') {
      toY = to.bottom;
    } else {
      toY = to.top! + to.height! / 2;
    }

    //console.log('[connector] from', fromX, fromY);
    //console.log('[connector] to', toX, toY);

    // const left = Math.min(fromX!, toX!);
    // const top = Math.min(fromY!, toY!);
    // const right = Math.max(fromX!, toX!);
    // const bottom = Math.max(fromY!, toY!);
    // TODO: annoying problem where these values don't actually get propagated?
    // const width = right - left;
    // const height = bottom - top;

    const left = _.min([fromX, toX]);
    const top = _.min([fromY, toY]);
    const right = _.max([fromX, toX]);
    const bottom = _.max([fromY, toY]);

    // if (
    //   props.$from === 'centerRight' &&
    //   props.$to === 'centerLeft' &&
    //   props.stroke === 'black' &&
    //   props.strokeWidth === 2
    // )
    //   console.log('[connector] bbox here', { left, top, right, bottom });

    // // determine if line is going up-left or down-right
    // const sense = (fromX: number, fromY: number, toX: number, toY: number) => {
    //   if (fromX < toX && fromY < toY) {
    //     return 'down-right';
    //   } else if (fromX < toX && fromY > toY) {
    //     return 'up-right';
    //   } else if (fromX > toX && fromY < toY) {
    //     return 'down-left';
    //   } else if (fromX > toX && fromY > toY) {
    //     return 'up-left';
    //   }
    // };

    const oldBBox = {
      left: fromX,
      top: fromY,
      width: (toX ?? 0) - (fromX ?? 0),
      height: (toY ?? 0) - (fromY ?? 0),
      right: toX,
      bottom: toY,
    };

    return {
      left,
      top,
      right,
      bottom,
      width: (right ?? 0) - (left ?? 0),
      height: (bottom ?? 0) - (top ?? 0),
      coord: {
        translate: { x: 0, y: 0 },
      },
      boundary: oldBBox as any,
    };
  };
};

// TODO: note that if `children` is not placed, this doesn't actually measure anything!
// I'm not sure why...
export const Link = withBluefish((props: PropsWithChildren<LinkProps>) => {
  const { id, domRef, children, boundary } = useBluefishLayout({}, props, connectorMeasurePolicy(props));

  const bbox = boundary as unknown as NewBBoxClass;

  const { $from, $to, name, ...rest } = props;
  return (
    <>
      {children}
      <line
        id={id}
        ref={domRef}
        {...rest}
        x1={bbox?.left ?? 0}
        x2={(bbox?.left ?? 0) + (bbox?.width ?? 0)}
        y1={bbox?.top ?? 0}
        y2={(bbox?.top ?? 0) + (bbox?.height ?? 0)}
      />
    </>
  );
});
Link.displayName = 'Link';
