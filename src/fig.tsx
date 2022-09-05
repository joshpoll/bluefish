import React, {
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  isValidElement,
  ComponentType,
  forwardRef,
  PropsWithChildren,
} from 'react';
import { Measure } from './react-experiment';

export type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Constraints = {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
};

export type Placeable = {
  place: (point: { x?: number; y?: number }) => void;
  placeUnlessDefined: (point: { x?: number; y?: number }) => void;
  measuredWidth: number;
  measuredHeight: number;
};

// a layout hook
export const useFigLayout = (
  measure: Measure,
  bbox: Partial<BBox>,
  ref: React.ForwardedRef<unknown>,
  children?: React.ReactNode,
): BBox & { children: any } /* TODO: better type for children */ => {
  const childrenRef = useRef<any[]>([]);

  const [x, setX] = useState<number | undefined>(bbox.x);
  const [y, setY] = useState<number | undefined>(bbox.y);
  const [width, setWidth] = useState<number | undefined>(bbox.width);
  const [height, setHeight] = useState<number | undefined>(bbox.height);

  const place = useCallback(({ x, y }: { x?: number; y?: number }) => {
    if (x !== undefined) setX(x);
    if (y !== undefined) setY(y);
  }, []);

  const placeUnlessDefined = useCallback(
    (point: { x?: number; y?: number }) => {
      console.log('placeUnlessDefined', point);
      if (point.x !== undefined && x !== undefined) setX(x);
      if (point.y !== undefined && y !== undefined) setY(y);
    },
    [x, y],
  );

  useImperativeHandle(
    ref,
    () => ({
      measure(constraints: Constraints): Placeable {
        const { width, height } = measure(childrenRef.current, constraints);
        setWidth(width);
        setHeight(height);
        return { measuredWidth: width!, measuredHeight: height!, place, placeUnlessDefined };
      },
    }),
    [place, placeUnlessDefined, measure, childrenRef],
  );

  // TODO: are these fields always defined?
  return {
    x: x!,
    y: y!,
    width: width!,
    height: height!,
    children: React.Children.map(children, (child, index) => {
      if (isValidElement(child)) {
        return React.cloneElement(child, {
          ref: (ref: any) => (childrenRef.current[index] = ref),
        });
      } else {
        // TODO: what to do with non-elements?
        console.log('warning: non-element child', child);
        return child;
      }
    }),
  };
};

// a layout HOC
export const withFig = (measure: Measure, Component: ComponentType<any>) =>
  forwardRef((props: any, ref: any) => {
    const { x, y, width, height, children } = useFigLayout(
      measure,
      {
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
      },
      ref,
      props.children,
    );
    return (
      <Component x={x} y={y} width={width} height={height}>
        {children}
      </Component>
    );
  });

// a pure layout component builder
export const Layout = (measurePolicy: Measure) =>
  withFig(measurePolicy, (props: PropsWithChildren<any>) => {
    return <g transform={`translate(${props.x ?? 0}, ${props.y ?? 0})`}>{props.children}</g>;
  });
