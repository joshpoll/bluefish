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
      console.log('from', from, fromYDir, fromXDir);
      console.log('to', to, toYDir, toXDir);

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

      return {
        left: Math.min(fromX!, toX!),
        top: Math.min(fromY!, toY!),
        right: Math.max(fromX!, toX!),
        bottom: Math.max(fromY!, toY!),
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
