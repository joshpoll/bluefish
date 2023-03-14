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
} from '../../bluefish';
import { NewBBox, NewBBoxClass } from '../../NewBBox';
import { Alignment2D, splitAlignment } from '../../components/Align';
import { rowMeasurePolicy } from '../../components/Row';

export type BondProps = PropsWithBluefish<
  React.SVGProps<SVGLineElement> & {
    $from?: Alignment2D;
    $to?: Alignment2D;
    content: string;
    bondType: string;
    curId: string;
    ringCenterX: Number;
    ringCenterY: Number;
    startLocationX: Number;
    startLocationY: Number;
    endLocationX: Number;
    endLocationY: Number;
  }
>;

const connectorMeasurePolicy = (props: BondProps): Measure => {
  return (measurables, constraints: any) => {
    const [from, to] = measurables.map((m) => m.measure(constraints));
    const [fromYDir, fromXDir] = splitAlignment(props.$from ?? measurables[0].guidePrimary ?? 'center');
    const [toYDir, toXDir] = splitAlignment(props.$to ?? measurables[1].guidePrimary ?? 'center');

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
      left: fromX,
      top: fromY,
      width: (toX ?? 0) - (fromX ?? 0),
      height: (toY ?? 0) - (fromY ?? 0),
      right: toX,
      bottom: toY,
    };
  };
};

// TODO: note that if `children` is not placed, this doesn't actually measure anything!
// I'm not sure why...
export const Bond = withBluefish((props: PropsWithChildren<BondProps>) => {
  const { id, bbox, domRef, children } = useBluefishLayout({}, props, connectorMeasurePolicy(props));
  const {
    $from,
    $to,
    name,
    content,
    ringCenterX,
    ringCenterY,
    startLocationX,
    startLocationY,
    endLocationX,
    endLocationY,
    bondType,
    curId,
    ...rest
  } = props;

  function calculateBondAngle(x1: any, x2: any, y1: any, y2: any) {
    const changeX = Math.abs(x2 - x1) * 1.0;
    const changeY = (y1 - y2) * 1.0;
    let slope = changeY / changeX;

    let angle = Math.atan(slope);

    return angle;
  }

  // Returns "above" -> draw second bond above first bond
  // Returns "below" -> draw second bond below first bond
  // Lower on the page = higher Y values
  function calculateRingBondDirection(y1: any, y2: any, rCenterY: any) {
    // Check if both coordinates are above the center
    // if both coordinates are above the center, return False -> bond should be drawn below
    if (y1 < Math.floor(rCenterY) || y2 < Math.floor(rCenterY)) {
      return 'below';
    } else {
      // Check if both coordinates are below the center
      // if both coordinates are below the center, return True -> bond should be drawn above
      return 'above';
    }
  }

  // let angle = calculateBondAngle(bbox.left, bbox.right, bbox.top, bbox.bottom);

  let angle = calculateBondAngle(startLocationX, endLocationX, startLocationY, endLocationY);
  let bondAria = (bondType === '=' ? 'Double Bond' : 'Single Bond') + ` with ID ${id}`;
  const ringBondDirection = calculateRingBondDirection(startLocationY, endLocationY, ringCenterY);

  return (
    <g id={id} ref={domRef} {...rest} aria-label={bondAria} name={curId}>
      {children}
      {bondType === '=' && ringCenterX === 0 && ringCenterY === 0 ? (
        <line
          x1={bbox.left ? bbox.left - 2.5 * Math.sin(angle) : 0}
          x2={(bbox.left ? bbox.left - 2.5 * Math.sin(angle) : 0) + (bbox?.width ?? 0)}
          y1={bbox.top ? bbox.top + 2.5 * Math.cos(angle) : 0}
          y2={(bbox.top ? bbox.top + 2.5 * Math.cos(angle) : 0) + (bbox?.height ?? 0)}
        />
      ) : (
        <line
          x1={bbox?.left ?? 0}
          x2={(bbox?.left ?? 0) + (bbox?.width ?? 0)}
          y1={bbox?.top ?? 0}
          y2={(bbox?.top ?? 0) + (bbox?.height ?? 0)}
        />
      )}

      {bondType === '=' && ringCenterX === 0 && ringCenterY === 0 ? (
        <line
          x1={bbox.left ? bbox.left + 2.5 * Math.sin(angle) : 0}
          x2={(bbox.left ? bbox.left + 2.5 * Math.sin(angle) : 0) + (bbox.width ? bbox.width : 0)}
          y1={bbox.top ? bbox.top - 2.5 * Math.cos(angle) : 0}
          y2={(bbox.top ? bbox.top - 2.5 * Math.cos(angle) : 0) + (bbox.height ? bbox.height : 0)}
        />
      ) : bondType === '=' ? (
        <line
          x1={
            bbox.left
              ? ringBondDirection == 'above'
                ? bbox.left + 5 * Math.sin(angle) - (5 / 3 ** 0.5) * Math.cos(angle)
                : bbox.left + 5 * Math.sin(angle) + (5 / 3 ** 0.5) * Math.cos(angle)
              : 0
          }
          x2={
            (bbox.left
              ? ringBondDirection == 'above'
                ? bbox.left + 5 * Math.sin(angle) + (5 / 3 ** 0.5) * Math.cos(angle)
                : bbox.left + 5 * Math.sin(angle) - (5 / 3 ** 0.5) * Math.cos(angle)
              : 0) + (bbox.width ? bbox.width : 0)
          }
          y1={
            bbox.top
              ? ringBondDirection == 'above'
                ? bbox.top - 5 * Math.cos(angle) - (5 / 3 ** 0.5) * Math.sin(angle)
                : bbox.top + 5 * Math.cos(angle) - (5 / 3 ** 0.5) * Math.sin(angle)
              : 0
          }
          y2={
            (bbox.top
              ? ringBondDirection == 'above'
                ? bbox.top - 5 * Math.cos(angle) + (5 / 3 ** 0.5) * Math.sin(angle)
                : bbox.top + 5 * Math.cos(angle) + (5 / 3 ** 0.5) * Math.sin(angle)
              : 0) + (bbox.height ? bbox.height : 0)
          }
        />
      ) : null}
    </g>
  );
});
Bond.displayName = 'Bond';
