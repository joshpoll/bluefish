import { CoordinateTransform, NewBBox, NewBBoxClass } from './NewBBox';
import React, {
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  isValidElement,
  ComponentType,
  forwardRef,
  PropsWithChildren,
  useContext,
  useEffect,
  useId,
} from 'react';
import { isNaN } from 'lodash';

// TODO: we need to change this code so that children accumulate the coordinate transformation from
// the root component down to them. This is necessary so that references can resolve correct positions.
// To implement these we need to:
// 1. Change the coordinate transformation to be a stack of transformations.
// The function we need to update is `placeUnlessDefined`.
// Incorrect. this function is no longer used. try again.
// 2. Change the `measure` function to return a coordinate transformation.
// Ok. But how do we accumulate the coordinate transformation?
// 3. Change the `measure` function to take a coordinate transformation.
// Ok. But how do we accumulate the coordinate transformation?
// 4. Change the `measure` function to take a coordinate transformation and return a coordinate
//    transformation.

export type Measurable = {
  name: string;
  measure(constraints: Constraints): NewBBoxClass;
  transformStack: CoordinateTransform[] | undefined;
};
export type MeasureResult = Partial<NewBBox>;

export type Measure = (measurables: Array<Measurable>, constraints: Constraints) => MeasureResult;

export type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BBoxWithChildren = Partial<PropsWithChildren<BBox>>;
export type NewBBoxWithChildren = Partial<PropsWithChildren<NewBBox>>;

// export type Constraints = {
//   minWidth: number;
//   maxWidth: number;
//   minHeight: number;
//   maxHeight: number;
// };
export type Constraints = {
  width?: number;
  height?: number;
};

export type Placeable = {
  place: (point: { x?: number; y?: number }) => void;
  placeUnlessDefined: (point: { x?: number; y?: number }) => void;
  measuredWidth: number;
  measuredHeight: number;
};

export type NewPlaceable = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  width?: number;
  height?: number;
};

// a layout hook
export const useBluefishLayout = (
  measure: Measure,
  bbox: Partial<NewBBox>,
  coord: Partial<CoordinateTransform>,
  ref: React.ForwardedRef<unknown>,
  children?: React.ReactNode,
  name?: any,
): NewBBoxWithChildren => {
  const context = useContext(BluefishContext);

  const childrenRef = useRef<any[]>([]);

  const [left, setLeft] = useState(bbox.left);
  const [top, setTop] = useState(bbox.top);
  const [right, setRight] = useState(bbox.right);
  const [bottom, setBottom] = useState(bbox.bottom);
  const [width, setWidth] = useState(bbox.width);
  const [height, setHeight] = useState(bbox.height);
  // const [_coord, setCoord] = useState<CoordinateTransform | undefined>(coord);
  const coordRef = useRef<CoordinateTransform>(coord ?? {});
  const bboxClassRef = useRef<NewBBoxClass | undefined>(undefined);
  const transformStackRef = useRef<CoordinateTransform[] | undefined>(undefined);

  useEffect(() => {
    console.log(name, 'left updated to', left);
  }, [name, left]);

  useEffect(() => {
    console.log(name, 'top updated to', top);
  }, [name, top]);

  // useEffect(() => {
  //   if (name !== undefined) {
  //     console.log('setting ref', name, ref);
  //     context.bfMap.set(name, ref as any);
  //   }
  // });

  useImperativeHandle(
    ref,
    (): Measurable => ({
      name,
      get transformStack() {
        return transformStackRef.current;
      },
      set transformStack(transforms: CoordinateTransform[] | undefined) {
        if (transforms === undefined) {
          transformStackRef.current = [coordRef.current];
        } else {
          transformStackRef.current = [...transforms, coordRef.current];
        }
      },
      measure(constraints: Constraints): NewBBoxClass {
        let bbox;
        if (bboxClassRef.current === undefined) {
          console.log('measuring', name);
          childrenRef.current.forEach((child) => {
            if (child !== undefined) {
              child.transformStack = transformStackRef.current;
            }
          });
          const { width, height, left, top, right, bottom } = measure(childrenRef.current, constraints);
          setWidth(width);
          setHeight(height);
          setLeft(left);
          setTop(top);
          setRight(right);
          setBottom(bottom);

          bbox = new NewBBoxClass(
            { left, top, right, bottom, width, height, coord: coordRef.current },
            {
              left: (left) => {
                console.log(name, 'left set to', left);
                return setLeft(left);
              },
              top: (top) => {
                console.log(name, 'top set to', top);
                return setTop(top);
              },
              right: (right) => {
                console.log(name, 'right set to', right);
                return setRight(right);
              },
              bottom: (bottom) => {
                console.log(name, 'bottom set to', bottom);
                return setBottom(bottom);
              },
              width: (width) => {
                console.log(name, 'width set to', width);
                return setWidth(width);
              },
              height: (height) => {
                console.log(name, 'height set to', height);
                return setHeight(height);
              },
              coord: (coord) => {
                console.log(name, 'coord set to', coord);
                coordRef.current.scale = coord?.scale ?? {};
                coordRef.current.translate = coord?.translate ?? {};
              },
            },
          );
          bboxClassRef.current = bbox;
        } else {
          bbox = bboxClassRef.current;
          console.log('using cached bbox', name, bbox);
        }

        return bbox;
      },
    }),
    [measure, childrenRef, setLeft, setTop, setRight, setBottom, setWidth, setHeight, name, bboxClassRef],
  );

  console.log(`returning bbox for ${name}`, { left, top, right, bottom, width, height });
  return {
    left: left,
    top: top,
    right: right,
    bottom: bottom,
    width: width,
    height: height,
    coord: coordRef.current,
    children: React.Children.map(children, (child, index) => {
      if (isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, {
          // store a pointer to every child's ref in an array
          // also pass through outer refs
          // see: https://github.com/facebook/react/issues/8873
          ref: (node: any) => {
            childrenRef.current[index] = node;
            // console.log('setting child ref', index, node, node.name);
            if (node !== null && 'name' in node && node.name !== undefined) {
              console.log('setting ref', node.name, node);
              context.bfMap.set(node.name, node);
            }
            const { ref } = child as any;
            console.log('current ref on child', ref);
            if (typeof ref === 'function') ref(node);
            else if (ref) {
              ref.current = node;
            }
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
  WrappedComponent: React.ComponentType<ComponentProps & { $bbox?: Partial<NewBBox> }>,
) =>
  forwardRef(
    (props: PropsWithChildren<ComponentProps> /* & { $bbox?: Partial<NewBBox> } */ & { name?: any }, ref: any) => {
      const { left, top, bottom, right, width, height, children, coord } = useBluefishLayout(
        measure,
        {
          // left: props.bbox?.left,
          // top: props.bbox?.top,
          // right: props.bbox?.right,
          // bottom: props.bbox?.bottom,
          // width: props.bbox?.width,
          // height: props.bbox?.height,
        },
        {},
        ref,
        props.children,
        props.name,
      );
      return (
        <WrappedComponent
          {...props}
          $bbox={{
            left,
            top,
            bottom,
            right,
            width,
            height,
            coord,
          }}
        >
          {children}
        </WrappedComponent>
      );
    },
  );

export const withBluefishFn = <ComponentProps,>(
  measureFn: (props: ComponentProps & PropsWithChildren<{ $bbox?: Partial<NewBBox> }>) => Measure,
  WrappedComponent: React.ComponentType<ComponentProps & { $bbox?: Partial<NewBBox>; $coord?: CoordinateTransform }>,
) =>
  forwardRef((props: PropsWithChildren<ComponentProps> & { name?: any }, ref: any) => {
    const { left, top, bottom, right, width, height, children, coord } = useBluefishLayout(
      measureFn(props),
      {
        // left: props.bbox?.left,
        // top: props.bbox?.top,
        // right: props.bbox?.right,
        // bottom: props.bbox?.bottom,
        // width: props.bbox?.width,
        // height: props.bbox?.height,
      },
      {},
      ref,
      props.children,
      props.name,
    );
    return (
      <WrappedComponent
        {...props}
        $bbox={{
          left,
          top,
          bottom,
          right,
          width,
          height,
          coord,
        }}
      >
        {children}
      </WrappedComponent>
    );
  });

// export const withBluefishFnWithContext = <ComponentProps,>(
//   measureFn: (
//     props: ComponentProps & PropsWithChildren<{ $bbox?: Partial<NewBBox> }>,
//     context: BluefishContextValue,
//   ) => Measure,
//   WrappedComponent: React.ComponentType<ComponentProps & { $bbox?: Partial<NewBBox> }>,
// ) =>
//   forwardRef((props: PropsWithChildren<ComponentProps> & { name?: any }, ref: any) => {
//     const context = useContext(BluefishContext);
//     const { left, top, bottom, right, width, height, children, coord } = useBluefishLayout(
//       measureFn(props, context),
//       {
//         // left: props.bbox?.left,
//         // top: props.bbox?.top,
//         // right: props.bbox?.right,
//         // bottom: props.bbox?.bottom,
//         // width: props.bbox?.width,
//         // height: props.bbox?.height,
//       },
//       {},
//       ref,
//       props.children,
//       props.name,
//     );
//     return (
//       <WrappedComponent
//         {...props}
//         $bbox={{
//           left,
//           top,
//           bottom,
//           right,
//           width,
//           height,
//         }}
//         $coord={coord}
//       >
//         {children}
//       </WrappedComponent>
//     );
//   });

// a pure layout component builder
export const Layout = (measurePolicy: Measure) =>
  withBluefish(measurePolicy, (props: PropsWithChildren<{ $bbox?: Partial<NewBBox> }>) => {
    return (
      <g transform={`translate(${props.$bbox!.coord?.translate?.x ?? 0}, ${props.$bbox!.coord?.translate?.y ?? 0})`}>
        {props.children}
      </g>
    );
    // return <g transform={`translate(${props.$bbox?.left ?? 0}, ${props.$bbox?.top ?? 0})`}>{props.children}</g>;
  });

export const LayoutFn = <T,>(
  measurePolicyFn: (props: T & PropsWithChildren<{ $bbox?: Partial<NewBBox> }>) => Measure,
) =>
  withBluefishFn(measurePolicyFn, (props: PropsWithChildren<{ $bbox?: Partial<NewBBox> }>) => {
    return (
      <g transform={`translate(${props.$bbox!.coord?.translate?.x ?? 0}, ${props.$bbox!.coord?.translate?.y ?? 0})`}>
        {props.children}
      </g>
    );
    // return <g transform={`translate(${props.$bbox?.left ?? 0}, ${props.$bbox?.top ?? 0})`}>{props.children}</g>;
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

export type BluefishContextValue = {
  bfMap: Map<any, React.MutableRefObject<any>>;
  setBFMap: React.Dispatch<React.SetStateAction<Map<any, any>>>;
};

export const BluefishContext = React.createContext<BluefishContextValue>({
  bfMap: new Map(),
  setBFMap: () => {},
});
export const useBluefishContext = () => useContext(BluefishContext);
