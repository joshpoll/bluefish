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

export type Measurable = any;
export type MeasureResult = {
  width: number;
  height: number;
};

export type Measure = (measurables: Array<Measurable>, constraints: Constraints) => MeasureResult;

export type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BBoxWithChildren = Partial<PropsWithChildren<BBox>>;

// export type Constraints = {
//   minWidth: number;
//   maxWidth: number;
//   minHeight: number;
//   maxHeight: number;
// };
export type Constraints = any;

export type Placeable = {
  place: (point: { x?: number; y?: number }) => void;
  placeUnlessDefined: (point: { x?: number; y?: number }) => void;
  measuredWidth: number;
  measuredHeight: number;
};

// a layout hook
export const useBluefishLayout = (
  measure: Measure,
  bbox: Partial<BBox>,
  ref: React.ForwardedRef<unknown>,
  children?: React.ReactNode,
): BBoxWithChildren => {
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
        return React.cloneElement(child as React.ReactElement<any>, {
          // store a pointer to every child's ref in an array
          // also pass through outer refs
          // see: https://github.com/facebook/react/issues/8873
          ref: (node: any) => {
            childrenRef.current[index] = node;
            const { ref } = child as any;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          },
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
export const withBluefish = <ComponentProps,>(
  measure: Measure,
  WrappedComponent: React.ComponentType<ComponentProps & BBoxWithChildren>,
) =>
  forwardRef((props: ComponentProps & BBoxWithChildren, ref: any) => {
    const { x, y, width, height, children } = useBluefishLayout(
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
      <WrappedComponent {...props} x={x} y={y} width={width} height={height}>
        {children}
      </WrappedComponent>
    );
  });

export const withBluefishFn = <ComponentProps,>(
  measureFn: (props: ComponentProps & BBoxWithChildren) => Measure,
  WrappedComponent: React.ComponentType<ComponentProps & BBoxWithChildren>,
) =>
  forwardRef((props: ComponentProps & BBoxWithChildren, ref: any) => {
    const { x, y, width, height, children } = useBluefishLayout(
      measureFn(props),
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
      <WrappedComponent {...props} x={x} y={y} width={width} height={height}>
        {children}
      </WrappedComponent>
    );
  });

// a pure layout component builder
export const Layout = (measurePolicy: Measure) =>
  withBluefish(measurePolicy, (props: BBoxWithChildren) => {
    return <g transform={`translate(${props.x ?? 0}, ${props.y ?? 0})`}>{props.children}</g>;
  });

export const LayoutFn = <T,>(measurePolicyFn: (props: T & BBoxWithChildren) => Measure) =>
  withBluefishFn(measurePolicyFn, (props: BBoxWithChildren) => {
    return <g transform={`translate(${props.x ?? 0}, ${props.y ?? 0})`}>{props.children}</g>;
  });

// TODO: this HOC doesn't work :/
export const withBluefishComponent = <ComponentProps,>(
  WrappedComponent: React.ComponentType<ComponentProps & BBoxWithChildren>,
) =>
  forwardRef((props: ComponentProps & BBoxWithChildren, ref: any) => {
    return (
      <WrappedComponent {...props}>
        {React.Children.map(props.children, (child, index) => {
          if (isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              ref,
              // store a pointer to every child's ref in an array
              // also pass through outer refs
              // see: https://github.com/facebook/react/issues/8873
              // ref: (node: any) => {
              //   childrenRef.current[index] = node;
              //   const { ref } = child as any;
              //   if (typeof ref === 'function') ref(node);
              //   else if (ref) ref.current = node;
              // },
            });
          } else {
            // TODO: what to do with non-elements?
            console.log('warning: non-element child', child);
            return child;
          }
        })}
      </WrappedComponent>
    );
  });
