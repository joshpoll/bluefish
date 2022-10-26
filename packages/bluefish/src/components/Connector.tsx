import { forwardRef, useImperativeHandle } from 'react';
import {
  withBluefish,
  withBluefishFn,
  BBox,
  useBluefishContext,
  Constraints,
  MeasureResult,
  Measure,
} from '../bluefish';
import { NewBBox, NewBBoxClass } from '../NewBBox';
import { Alignment2D, splitAlignment } from './Align';
import { BluefishRef, resolveRef } from './Ref';

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
export type ConnectorProps = React.SVGProps<SVGLineElement> & {
  $from: Alignment2D;
  $to: Alignment2D;
};

export const Connector = withBluefishFn(
  (props): Measure => {
    return (measurables, constraints: any) => {
      const [from, to] = measurables.map((m) => m.measure(constraints));
      const [fromYDir, fromXDir] = splitAlignment(props.$from);
      const [toYDir, toXDir] = splitAlignment(props.$to);
      console.log('[connector] from', from, fromYDir, fromXDir);
      console.log('[connector] to', to, toYDir, toXDir);

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

      console.log(
        '[connector] to BBox',
        JSON.stringify({
          left: to.left,
          right: to.right,
          top: to.top,
          bottom: to.bottom,
          width: to.width,
          height: to.height,
        }),
      );
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

      console.log('[connector] from', fromX, fromY);
      console.log('[connector] to', toX, toY);

      const left = Math.min(fromX!, toX!);
      const top = Math.min(fromY!, toY!);
      const right = Math.max(fromX!, toX!);
      const bottom = Math.max(fromY!, toY!);
      // TODO: annoying problem where these values don't actually get propagated?
      const width = right - left;
      const height = bottom - top;

      return {
        left,
        top,
        right,
        bottom,
        width,
        height,
      };
    };
  },
  (props: ConnectorProps & { $bbox?: Partial<NewBBox> }) => {
    const { $bbox, $from, $to, ...rest } = props;
    return (
      <line
        {...rest}
        x1={$bbox?.left ?? 0}
        x2={($bbox?.left ?? 0) + ($bbox?.width ?? 0)}
        y1={$bbox?.top ?? 0}
        y2={($bbox?.top ?? 0) + ($bbox?.height ?? 0)}
      />
    );
  },
);
