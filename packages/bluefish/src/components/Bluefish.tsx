import React, { ReactElement } from 'react';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { Measure } from '../bluefish';

const bluefishMeasurePolicy: Measure = (measurables, constraints) => {
  const placeables = measurables.map((measurable) => measurable.measure(constraints));
  /* TODO: add back! */
  // placeables.forEach((placeable) => {
  //   placeable.placeUnlessDefined({ x: 0, y: 0 });
  // });
  return { width: constraints.width, height: constraints.height };
};

export const Bluefish = (props: PropsWithChildren<{ width: number; height: number }>) => {
  const childrenRef = useRef<any>([]);

  useEffect(() => {
    bluefishMeasurePolicy(childrenRef.current, { width: props.width, height: props.height });
  });

  return (
    <>
      {React.Children.map(props.children, (child, index) =>
        //   TODO: not sure why this cast is necessary
        React.cloneElement(child as ReactElement, {
          ref: (ref: any) => (childrenRef.current[index] = ref),
        }),
      )}
    </>
  );
};
