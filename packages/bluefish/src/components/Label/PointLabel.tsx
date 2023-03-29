import _ from 'lodash';
import { forwardRef, PropsWithChildren, useRef } from 'react';
import { Measurable, Measure, useBluefishLayout, withBluefish } from '../../bluefish';
import { ReactChild } from '../../flatten-children';
import { NewBBox } from '../../NewBBox';
import { LayoutGroup } from '../LayoutGroup';
import { Ref } from '../Ref';
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
  avoidElements: ReactChild[];
  avoidRefElements: boolean;
  padding: number;
};

export const PointLabel = forwardRef(function PointLabel(props: PointLabelProps, ref: any) {
  const { texts, avoidElements, ...rest } = props;
  return (
    <PointLabelAux {...rest} ref={ref}>
      <LayoutGroup /* id="labelRefPairs" */>
        {texts.map((text) => (
          <LayoutGroup>
            {text.label}
            <Ref to={text.ref} />
          </LayoutGroup>
        ))}
      </LayoutGroup>
      <LayoutGroup>{avoidElements}</LayoutGroup>
    </PointLabelAux>
  );
});

const pointLabelMeasurePolicy = (props: {}): Measure => {
  return (measurables, constraints) => {
    // console.log('[pointLabelMeasurePolicy]', measurables, constraints);
    // const [_label, ref] = measurables;
    // const [labelBBox, refBBox] = measurables.map((m) => m.measure(constraints));
    // const refDomRef: SVGElement | null = ref.domRef;
    // generalize this to the whole array
    // https://stackoverflow.com/a/44656332

    // let i = -1;
    // const [labels, refs] = _.partition(measurables, (_) => i++ % 2);
    // const labelBBoxes = labels.map((m) => m.measure(constraints));
    // const refBBoxes = refs.map((m) => m.measure(constraints));
    // const refDomRefs: (SVGElement | null | undefined)[] = refs.map((m) => m.domRef);

    const labelRefPairs = (measurables as unknown as [Measurable[][]])[0];
    const labels = labelRefPairs.map((m) => m[0]);
    const refs = labelRefPairs.map((m) => m[1]);
    const labelBBoxes = labels.map((m) => m.measure(constraints));
    const refBBoxes = refs.map((m) => m.measure(constraints));
    const refDomRefs: (SVGElement | null | undefined)[] = refs.map((m) => m.domRef);

    const avoidElements = (measurables as unknown as [Measurable[][], Measurable[]])[1] ?? [];
    avoidElements.map((m) => m.measure(constraints));
    const avoidElementsRefs: (SVGElement | null | undefined)[] = avoidElements.map((m) => m.domRef);

    // console.log('refDomRefs', refDomRefs);
    // early return if we don't have refs yet
    if (refDomRefs.some((refDomRef) => refDomRef === null || refDomRef === undefined)) {
      return {
        /* width: 0, height: 0 */
      };
    }

    // console.log('avoidElementsRefs', avoidElementsRefs);
    // early return if we don't have refs yet
    if (avoidElementsRefs.some((refDomRef) => refDomRef === null || refDomRef === undefined)) {
      return {
        /* width: 0, height: 0 */
      };
    }
    // console.log(
    //   'avoidElementsRefs',
    //   avoidElementsRefs.map((refDomRef) => refDomRef?.outerHTML),
    // );

    // if (refDomRef === null || refDomRef === undefined) {
    //   return {
    //     width: 0,
    //     height: 0,
    //   };
    // }

    labelLayout({
      // labels and anchor points
      texts: _.zipWith(labelBBoxes, refDomRefs, (labelBBox, refDomRef) => ({
        label: labelBBox,
        ref: refDomRef as SVGElement /* early return guarantees this */,
      })),
      // canvas size (provided by parent in Bluefish)
      size: [constraints.width!, constraints.height!],
      // optional sorting function to determine label layout priority order
      compare: undefined,
      // label offset from anchor point
      offset: [1],
      // offset orientation (e.g. 'top-left')
      anchor: Anchors,
      // optional list of elements to avoid (like a line mark)
      avoidElements: avoidElementsRefs as SVGElement[] /* early return guarantees this */,
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
    // const left = Math.min(labelBBox.left!, refBBox.left!);
    // const top = Math.min(labelBBox.top!, refBBox.top!);
    // const right = Math.max(labelBBox.right!, refBBox.right!);
    // const bottom = Math.max(labelBBox.bottom!, refBBox.bottom!);
    const left = Math.min(
      ...labelBBoxes.map((labelBBox) => labelBBox.left!),
      ...refBBoxes.map((refBBox) => refBBox.left!),
    );
    const top = Math.min(
      ...labelBBoxes.map((labelBBox) => labelBBox.top!),
      ...refBBoxes.map((refBBox) => refBBox.top!),
    );
    const right = Math.max(
      ...labelBBoxes.map((labelBBox) => labelBBox.right!),
      ...refBBoxes.map((refBBox) => refBBox.right!),
    );
    const bottom = Math.max(
      ...labelBBoxes.map((labelBBox) => labelBBox.bottom!),
      ...refBBoxes.map((refBBox) => refBBox.bottom!),
    );
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
};

export const PointLabelAux = withBluefish((props: PropsWithChildren<{}>) => {
  const { id, domRef, bbox, children } = useBluefishLayout({}, props, pointLabelMeasurePolicy(props));
  const { ...rest } = props;

  return (
    <g
      {...rest}
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})`}
    >
      {children}
    </g>
  );
});
