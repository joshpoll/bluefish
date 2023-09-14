import React, { PropsWithChildren, useRef, useEffect, ReactElement, useState } from 'react';
import { BBox, BluefishContext, Measure, processChildren, BluefishSymbolContext } from '../bluefish';

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
  const start = Date.now();
  //console.log('[svg] measure policy called');
  const placeables = measurables.map((measurable) => measurable.measure(constraints));
  //console.log('placeables', placeables);
  placeables.forEach((placeable) => {
    if (placeable.left === undefined) {
      placeable.left = 0;
    }
    if (placeable.top === undefined) {
      placeable.top = 0;
    }
  });
  console.log('[svg] measure policy took', Date.now() - start, 'ms');
  return { width: constraints.width, height: constraints.height };
};

export const SVG = (props: PropsWithChildren<SVGProps>) => {
  const [bfMap, setBFMap] = useState(new Map());
  const value = { bfMap, setBFMap };
  const [bfSymbolMap, setBFSymbolMap] = useState(new Map());
  const symbolValue = { bfSymbolMap, setBFSymbolMap };

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
      //console.log('[svg] measuring');
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
      <BluefishSymbolContext.Provider value={symbolValue}>
        <svg width={props.width} height={props.height}>
          {processChildren(props.children, (child, index) => (node: any) => {
            childrenRef.current[index] = node;
            // console.log('setting child ref', index, node, node.name);
            /* TODO: need to add children to the map. maybe a reason to wrap stuff in Bluefish */
            // if (node !== null && 'name' in node && node.name !== undefined) {
            //   console.log('setting ref', node.name, node);
            //   context.bfMap.set(node.name, node);
            // }
            const { ref } = child as any;
            // console.log('current ref on child', ref);
            if (typeof ref === 'function') ref(node);
            else if (ref) {
              ref.current = node;
            }
          })}
          {/* {React.Children.map(props.children, (child, index) =>
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
        )} */}
        </svg>
      </BluefishSymbolContext.Provider>
    </BluefishContext.Provider>
  );
};
