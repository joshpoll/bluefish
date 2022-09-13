import React, { PropsWithChildren, useRef, useEffect, ReactElement } from 'react';
import { BBox, Measure } from '../bluefish';

// SVG is a bit weird, because it initiates layout
// TODO: it can still probably be cleaned up a bit.

export type SVGProps = {
  width: number;
  height: number;
};

export const useMeasure = (measure: Measure, childrenRef?: any): BBox => {
  return measure(
    // pass child measure function
    childrenRef === undefined ? [] : childrenRef.current,
    {},
  ) as BBox;
};

const svgMeasurePolicy: Measure = (measurables, constraints) => {
  const placeables = measurables.map((measurable) => measurable.measure(constraints));
  placeables.forEach((placeable) => {
    placeable.placeUnlessDefined({ x: 0, y: 0 });
  });
  return { width: constraints.width, height: constraints.height };
};

export const SVG = (props: PropsWithChildren<SVGProps>) => {
  const childrenRef = useRef<any>([]);
  const { width, height } = useMeasure(svgMeasurePolicy);

  //   useCallback(() => {
  //     console.log('childrenRef', childrenRef.current);
  //     return svgMeasurePolicy(childrenRef.current, { width: props.width, height: props.height });
  //   }, [props.height, props.width]);
  useEffect(() => {
    svgMeasurePolicy(childrenRef.current, { width: props.width, height: props.height });
  });

  return (
    <svg width={width} height={height}>
      {React.Children.map(props.children, (child, index) =>
        //   TODO: not sure why this cast is necessary
        React.cloneElement(child as ReactElement, {
          ref: (ref: any) => (childrenRef.current[index] = ref),
        }),
      )}
    </svg>
  );
};
