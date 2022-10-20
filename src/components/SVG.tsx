import React, { PropsWithChildren, useRef, useEffect, ReactElement, useState } from 'react';
import { BBox, BluefishContext, Measure } from '../bluefish';

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
  console.log('[svg] measure policy called');
  const placeables = measurables.map((measurable) => measurable.measure(constraints));
  console.log('placeables', placeables);
  placeables.forEach((placeable) => {
    if (placeable.left === undefined) {
      placeable.left = 0;
    }
    if (placeable.top === undefined) {
      placeable.top = 0;
    }
  });
  return { width: constraints.width, height: constraints.height };
};

export const SVG = (props: PropsWithChildren<SVGProps>) => {
  const [bfMap, setBFMap] = useState(new Map());
  const value = { bfMap, setBFMap };
  const [rerender, setRerender] = useState(false);

  const { width, height } = useMeasure(svgMeasurePolicy);
  // childrenRef is a list of callback refs
  const childrenRef = useRef<any>([]);

  //   useCallback(() => {
  //     console.log('childrenRef', childrenRef.current);
  //     return svgMeasurePolicy(childrenRef.current, { width: props.width, height: props.height });
  //   }, [props.height, props.width]);

  // TODO: this is wrong because useEffect is called after render
  useEffect(
    () => {
      console.log('[svg] measuring');
      svgMeasurePolicy(childrenRef.current, { width: props.width, height: props.height });

      return () => {
        // forces rerender so that props are actually propagated
        // this is a hack, but it works
        setRerender(!rerender);
      };
    } /* , [props.height, props.width, childrenRef] */,
  );
  // TODO: this is also wrong because childrenRef is not updated
  // console.log('[svg] measuring');
  // svgMeasurePolicy(childrenRef.current, { width: props.width, height: props.height });

  return (
    <BluefishContext.Provider value={value}>
      <svg width={props.width} height={props.height}>
        {React.Children.map(props.children, (child, index) =>
          //   TODO: not sure why this cast is necessary
          React.cloneElement(child as ReactElement, {
            ref: (innerRef: any) => {
              childrenRef.current[index] = innerRef;
              // if (typeof ref === 'function') {
              //   return ref(innerRef);
              // } else {
              //   return ref;
              // }
              return innerRef;
            },
          }),
        )}
      </svg>
    </BluefishContext.Provider>
  );
};
