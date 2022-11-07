import { forwardRef, useRef } from 'react';
import { LayoutFn, Measure, withBluefishFn } from '../../bluefish';
import { NewBBox } from '../../NewBBox';
import { Align } from '../Align';
import { Connector } from '../Connector';
import { Group } from '../Group';
import { Rect } from '../Rect';
import { Ref } from '../Ref';
import { Text } from '../Text';
import labelLayout from './LabelLayout';

// 8-bit representation of anchors
const TOP = 0x0,
  MIDDLE = 0x4,
  BOTTOM = 0x8,
  LEFT = 0x0,
  CENTER = 0x1,
  RIGHT = 0x2;

// Mapping from text anchor to number representation
const anchorCode = {
  'top-left': TOP + LEFT,
  top: TOP + CENTER,
  'top-right': TOP + RIGHT,
  left: MIDDLE + LEFT,
  middle: MIDDLE + CENTER,
  right: MIDDLE + RIGHT,
  'bottom-left': BOTTOM + LEFT,
  bottom: BOTTOM + CENTER,
  'bottom-right': BOTTOM + RIGHT,
};

export const Output = ['x', 'y', 'opacity', 'align', 'baseline'] as const;

export const Anchors = [
  'top-left',
  'left',
  'bottom-left',
  'top',
  'bottom',
  'top-right',
  'right',
  'bottom-right',
] as const;

export type PointLabelProps = {
  texts: { label: any; ref: any }[];
  compare: ((a: any, b: any) => number) | undefined;
  offset: number[];
  anchor: readonly (keyof typeof anchorCode)[];
  avoidElements: any[];
  avoidRefElements: boolean;
  padding: number;
};

export const PointLabel = forwardRef(function PointLabel({ texts }: PointLabelProps, ref: any) {
  return (
    <PointLabelAux ref={ref}>
      {texts[0].label}
      <Ref to={texts[0].ref} />
    </PointLabelAux>
  );
});

export const PointLabelAux = LayoutFn(
  (props): Measure => {
    return (measurables, constraints) => {
      const [_label, ref] = measurables;
      const [labelBBox, refBBox] = measurables.map((m) => m.measure(constraints));
      const refDomRef: SVGElement | null = ref.domRef;

      // early return if we don't have refs yet
      if (refDomRef === null || refDomRef === undefined) {
        return {
          width: 0,
          height: 0,
        };
      }

      labelLayout({
        // labels and anchor points
        texts: [{ label: labelBBox, ref: refDomRef }],
        // canvas size (provided by parent in Bluefish)
        size: [constraints.width!, constraints.height!],
        // optional sorting function to determine label layout priority order
        compare: undefined,
        // label offset from anchor point
        offset: [1],
        // offset orientation (e.g. 'top-left')
        anchor: Anchors,
        // optional list of elements to avoid (like a line mark)
        avoidElements: [],
        // whether or not we should avoid the anchor points (circle1, circle2, circle3)
        avoidRefElements: true,
        // padding around canvas to allow labels to be partially offscreen
        padding: 0,
      });

      // bbox should just be a union over all children (this should be the default case somewhere...)
      // const left = Math.min(fromX!, toX!);
      // const top = Math.min(fromY!, toY!);
      // const right = Math.max(fromX!, toX!);
      // const bottom = Math.max(fromY!, toY!);
      const left = Math.min(labelBBox.left!, refBBox.left!);
      const top = Math.min(labelBBox.top!, refBBox.top!);
      const right = Math.max(labelBBox.right!, refBBox.right!);
      const bottom = Math.max(labelBBox.bottom!, refBBox.bottom!);
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
  // (props: PointLabelProps & { $bbox?: Partial<NewBBox> }) => {
  //   const { $bbox, ...rest } = props;
  //   return (
  //     <line
  //       {...rest}
  //       x1={$bbox?.left ?? 0}
  //       x2={($bbox?.left ?? 0) + ($bbox?.width ?? 0)}
  //       y1={$bbox?.top ?? 0}
  //       y2={($bbox?.top ?? 0) + ($bbox?.height ?? 0)}
  //     />
  //   );
  // },
);
