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
  }
>;

const connectorMeasurePolicy = (props: BondProps): Measure => {
  return (measurables, constraints: any) => {
    const [from, to] = measurables.map((m) => m.measure(constraints));
    const [fromYDir, fromXDir] = splitAlignment(props.$from ?? measurables[0].guidePrimary ?? 'center');
    const [toYDir, toXDir] = splitAlignment(props.$to ?? measurables[1].guidePrimary ?? 'center');
    console.log('[bond] from', from, fromYDir, fromXDir);
    console.log('[bond] to', to, toYDir, toXDir);

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
      '[bond] to BBox',
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

    console.log('[bond] from', fromX, fromY);
    console.log('[bond] to', toX, toY);

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

  const { $from, $to, name, content, bondType, ...rest } = props;
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
        aria-label={content}
      />
    </>
  );
});
Bond.displayName = 'Bond';
