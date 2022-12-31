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
  useMemo,
} from 'react';
import { isEqual, isNaN } from 'lodash';
import ReactIs from 'react-is';
import { flattenChildren } from './flatten-children';

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
  domRef: SVGElement | null;
  constraints: Constraints | undefined;
  props: any;
  name: string;
  symbol?: Symbol;
  measure(constraints: Constraints, isRef?: boolean): NewBBoxClass;
  transformStack: CoordinateTransform[] | undefined;
};
export type MeasureResult = Partial<NewBBox> & { boundary?: paper.Path };

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

export const processChildren = (
  children: React.ReactNode,
  callbackRef: (child: any, index: number) => (node: any) => void,
  name?: string,
): any => {
  // if (name !== undefined && name.startsWith('$')) console.log('processChildren', name, children);
  return React.Children.map(flattenChildren(children), (child, index) => {
    /* if (ReactIs.isContextProvider(child)) {
      // TODO: try to push this into the flattenChildren function. the difference between dealing
      // with Context and with Fragment is that we still want to render ContextProviders.
      return React.cloneElement(child, { children: processChildren(child.props.children, callbackRef) });
    } else  */
    if (isValidElement(child)) {
      // if (name !== undefined && name.startsWith('$')) console.log('processChildren', name, 'valid element', child);
      return React.cloneElement(child as React.ReactElement<any>, {
        // store a pointer to every child's ref in an array
        // also pass through outer refs
        // see: https://github.com/facebook/react/issues/8873
        // ref: (node: any) => {
        //   childrenRef.current[index] = node;
        //   // console.log('setting child ref', index, node, node.name);
        //   if (node !== null && 'name' in node && node.name !== undefined) {
        //     console.log('setting ref', node.name, node);
        //     context.bfMap.set(node.name, node);
        //   }
        //   const { ref } = child as any;
        //   console.log('current ref on child', ref);
        //   if (typeof ref === 'function') ref(node);
        //   else if (ref) {
        //     ref.current = node;
        //   }
        // },
        ref: callbackRef(child, index),
      });
    } else {
      // TODO: what to do with non-elements?
      console.log('warning: non-element child', child);
      return child;
    }
  });
};

// a layout hook
export const useBluefishLayout = (
  measure: Measure,
  bbox: Partial<NewBBox>,
  coord: Partial<CoordinateTransform>,
  ref: React.ForwardedRef<unknown>,
  domRef: React.RefObject<SVGElement>,
  props: any,
  children?: React.ReactNode,
  name?: any,
  symbol?: {
    symbol: symbol;
    parent?: symbol;
  },
): NewBBoxWithChildren & { boundary?: paper.Path } => {
  const context = useContext(BluefishContext);
  const symbolContext = useContext(BluefishSymbolContext);

  const childrenRef = useRef<any[]>([]);

  const [left, setLeft] = useState(bbox.left);
  const [top, setTop] = useState(bbox.top);
  const [right, setRight] = useState(bbox.right);
  const [bottom, setBottom] = useState(bbox.bottom);
  const [width, setWidth] = useState(bbox.width);
  const [height, setHeight] = useState(bbox.height);
  const [boundary, setBoundary] = useState<paper.Path | undefined>(undefined);
  // const [_coord, setCoord] = useState<CoordinateTransform | undefined>(coord);
  const coordRef = useRef<CoordinateTransform>(coord ?? {});
  const bboxClassRef = useRef<NewBBoxClass | undefined>(undefined);
  const transformStackRef = useRef<CoordinateTransform[] | undefined>(undefined);
  // remember constraints so we can re-measure if they change
  const constraintRef = useRef<Constraints | undefined>(undefined);
  // remember props so we can re-measure if they change
  const propsRef = useRef<any>(props);

  // console.log('useBluefishLayout', children);
  // useEffect(() => {
  //   console.log(name, 'left updated to', left);
  // }, [name, left]);

  // useEffect(() => {
  //   console.log(name, 'top updated to', top);
  // }, [name, top]);

  // useEffect(() => {
  //   if (name !== undefined) {
  //     console.log('setting ref', name, ref);
  //     context.bfMap.set(name, ref as any);
  //   }
  // });

  useImperativeHandle(
    ref,
    (): Measurable => ({
      props: propsRef.current,
      domRef: domRef.current,
      constraints: constraintRef.current,
      name,
      symbol,
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
      measure(constraints: Constraints, isRef?: boolean): NewBBoxClass {
        console.log('measuring', name, 'with constraints', constraints, 'and children', childrenRef.current);
        let bbox;
        if (
          isRef !== true &&
          (bboxClassRef.current === undefined ||
            !isEqual(constraintRef.current, constraints) ||
            propsRef.current !== props)
        ) {
          constraintRef.current = constraints;
          // console.log('measuring', name);
          childrenRef.current.forEach((child) => {
            if (child !== undefined) {
              child.transformStack = transformStackRef.current;
            }
          });
          const { width, height, left, top, right, bottom, boundary } = measure(childrenRef.current, constraints);
          console.log('measured', name, JSON.stringify({ width, height, left, top, right, bottom }));
          setWidth(width);
          setHeight(height);
          setLeft(left);
          setTop(top);
          setRight(right);
          setBottom(bottom);
          setBoundary(boundary);

          bbox = new NewBBoxClass(
            { left, top, right, bottom, width, height, coord: coordRef.current },
            {
              left: (left) => {
                // console.log(name, 'left set to', left);
                return setLeft(left);
              },
              top: (top) => {
                // console.log(name, 'top set to', top);
                return setTop(top);
              },
              right: (right) => {
                // console.log(name, 'right set to', right);
                return setRight(right);
              },
              bottom: (bottom) => {
                // console.log(name, 'bottom set to', bottom);
                return setBottom(bottom);
              },
              width: (width) => {
                // console.log(name, 'width set to', width);
                return setWidth(width);
              },
              height: (height) => {
                // console.log(name, 'height set to', height);
                return setHeight(height);
              },
              coord: (coord) => {
                // console.log(name, 'coord set to', coord);
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

        return bbox!;
      },
    }),
    [
      measure,
      childrenRef,
      setLeft,
      setTop,
      setRight,
      setBottom,
      setWidth,
      setHeight,
      name,
      symbol,
      bboxClassRef,
      props,
      domRef,
    ],
  );

  // // set the ref in the symbol map to this ref
  // useEffect(() => {
  //   if (symbol !== undefined) {
  //     symbolContext.bfSymbolMap.set(symbol.symbol, {
  //       ref: ref as any,
  //       children: symbolContext.bfSymbolMap.get(symbol.symbol)?.children ?? [],
  //     });
  //   }
  // }, [symbol, ref, symbolContext.bfSymbolMap]);

  // console.log(`returning bbox for ${name}`, { left, top, right, bottom, width, height });
  return {
    left: left,
    top: top,
    right: right,
    bottom: bottom,
    width: width,
    height: height,
    coord: coordRef.current,
    boundary,
    children: processChildren(
      children,
      (child, index) => (node: any) => {
        childrenRef.current[index] = node;
        // console.log('setting child ref', index, node, node.name);
        if (node !== null && 'name' in node && node.name !== undefined) {
          console.log('setting ref', node.name, node);
          context.bfMap.set(node.name, node);
        }
        // add symbol the map
        if (node !== null && 'symbol' in node && node.symbol !== undefined) {
          console.log('[symbol] setting ref', node.symbol, node);
          symbolContext.bfSymbolMap.set(node.symbol.symbol, {
            ref: node,
            children: [],
          });
          console.log('[symbol] symbolMap after', symbolContext.bfSymbolMap.get(node.symbol.symbol));

          // connect the symbol to its parent
          if (node.symbol.parent !== undefined) {
            symbolContext.bfSymbolMap.set(node.symbol.parent, {
              ref: symbolContext.bfSymbolMap.get(node.symbol.parent)!.ref,
              children: [...(symbolContext.bfSymbolMap.get(node.symbol.parent)?.children ?? []), node.symbol.symbol],
            });
          }
        }
        const { ref } = child as any;
        // console.log('current ref on child', ref);
        if (typeof ref === 'function') ref(node);
        else if (ref) {
          ref.current = node;
        }
      },
      name,
    ),
    // children: React.Children.map(children, (child, index) => {
    //   if (isValidElement(child)) {
    //     return React.cloneElement(child as React.ReactElement<any>, {
    //       // store a pointer to every child's ref in an array
    //       // also pass through outer refs
    //       // see: https://github.com/facebook/react/issues/8873
    //       ref: (node: any) => {
    //         childrenRef.current[index] = node;
    //         // console.log('setting child ref', index, node, node.name);
    //         if (node !== null && 'name' in node && node.name !== undefined) {
    //           console.log('setting ref', node.name, node);
    //           context.bfMap.set(node.name, node);
    //         }
    //         const { ref } = child as any;
    //         console.log('current ref on child', ref);
    //         if (typeof ref === 'function') ref(node);
    //         else if (ref) {
    //           ref.current = node;
    //         }
    //       },
    //     });
    //   } else {
    //     // TODO: what to do with non-elements?
    //     console.log('warning: non-element child', child);
    //     return child;
    //   }
    // }),
  };
};

// a layout HOC
export const withBluefish = <ComponentProps,>(
  measure: Measure,
  WrappedComponent: React.ComponentType<ComponentProps & { $bbox?: Partial<NewBBox> }>,
) =>
  forwardRef(
    (
      props: PropsWithChildren<ComponentProps> /* & { $bbox?: Partial<NewBBox> } */ & { name?: any; debug?: boolean },
      ref: any,
    ) => {
      const domRef = useRef<SVGElement>(null);

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
        domRef,
        props,
        props.children,
        props.name,
      );
      return (
        <>
          <WrappedComponent
            {...props}
            ref={domRef}
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
          {props.debug && (
            <g
              ref={ref}
              transform={`translate(${coord?.translate?.x ?? 0} ${coord?.translate?.y ?? 0})
    scale(${coord?.scale?.x ?? 1} ${coord?.scale?.y ?? 1})`}
            >
              <rect x={left} y={top} width={width} height={height} fill="none" stroke="magenta" strokeWidth="1" />
            </g>
          )}
        </>
      );
    },
  );

export const withBluefishFn = <ComponentProps,>(
  measureFn: (props: ComponentProps & PropsWithChildren<{ $bbox?: Partial<NewBBox> }>) => Measure,
  WrappedComponent: React.ComponentType<ComponentProps & { $bbox?: Partial<NewBBox>; $coord?: CoordinateTransform }>,
) =>
  forwardRef((props: PropsWithChildren<ComponentProps> & { name?: any; debug?: boolean }, ref: any) => {
    // console.log('withBluefishFn', props.name, props, ref);
    const domRef = useRef<SVGElement>(null);

    const { left, top, bottom, right, width, height, children, coord, boundary } = useBluefishLayout(
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
      domRef,
      props,
      props.children,
      props.name,
    );
    return (
      <>
        <WrappedComponent
          {...props}
          ref={domRef}
          $bbox={{
            left,
            top,
            bottom,
            right,
            width,
            height,
            coord,
          }}
          $boundary={boundary}
        >
          {children}
        </WrappedComponent>
        {props.debug && (
          <g
            ref={ref}
            transform={`translate(${coord?.translate?.x ?? 0} ${coord?.translate?.y ?? 0})
scale(${coord?.scale?.x ?? 1} ${coord?.scale?.y ?? 1})`}
          >
            <rect x={left} y={top} width={width} height={height} fill="none" stroke="magenta" strokeWidth="1" />
          </g>
        )}
      </>
    );
  });

export type Symbol = {
  symbol: symbol;
  parent?: symbol;
};

export const useBluefishLayout2 = <T extends { children?: any; name?: string; symbol?: Symbol }>(
  init: {
    bbox?: Partial<NewBBox>;
    coord?: CoordinateTransform;
  },
  props: T,
  measure: Measure,
) => {
  const ref = useContext(RefContext);

  const domRef = useRef<any>(null);

  // console.log('useBluefishLayout2', props.name, props.children, ref, domRef);
  const { left, top, bottom, right, width, height, children, coord } = useBluefishLayout(
    measure,
    init?.bbox ?? {},
    init?.coord ?? {},
    ref,
    domRef,
    props,
    props.children,
    props.name,
    props.symbol,
  );

  // console.log('useBluefishLayout2 after', props.name, children, ref, domRef);

  return {
    domRef,
    bbox: {
      left,
      top,
      bottom,
      right,
      width,
      height,
      coord,
    },
    children,
  };
};

// create a higher order component that uses a forwardRef, but places the ref in a context so it can
// be looked up by the useBluefishLayout2 hook
export const RefContext = React.createContext<React.RefObject<SVGElement> | null>(null);

export const withBluefish2 = <ComponentProps,>(
  measure: Measure,
  WrappedComponent: React.ComponentType<ComponentProps & { $bbox?: Partial<NewBBox> }>,
) =>
  forwardRef((props: PropsWithChildren<ComponentProps> & { name?: any }, ref: any) => {
    const { domRef, bbox, children } = useBluefishLayout2({}, props, measure);
    return (
      <RefContext.Provider value={ref}>
        <WrappedComponent {...props} ref={domRef} $bbox={bbox}>
          {children}
        </WrappedComponent>
      </RefContext.Provider>
    );
  });

// injects name (and debug. still todo)
// injects ref
export const withBluefish3 = <ComponentProps,>(WrappedComponent: React.ComponentType<ComponentProps>) =>
  forwardRef((props: PropsWithChildren<ComponentProps> & { name?: any; symbol?: Symbol }, ref: any) => {
    const contextRef = useContext(RefContext);
    // TODO: I definitely wrote this code, but I also definitely don't understand it.
    const mergedRef = ref ?? contextRef;
    console.log('withBluefish3', props.name, mergedRef);
    return (
      // TODO: I think I also need to pass domRef here & I need to attach domRef to the WrappedComponent
      <RefContext.Provider value={mergedRef}>
        <WrappedComponent {...props} constraints={mergedRef?.current?.constraints} />
      </RefContext.Provider>
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

export type BluefishSymbolMap = Map<
  symbol,
  {
    ref?: React.MutableRefObject<any>;
    children: symbol[];
  }
>;

export type BluefishSymbolContextValue = {
  bfSymbolMap: BluefishSymbolMap;
  setBFSymbolMap: React.Dispatch<React.SetStateAction<BluefishSymbolMap>>;
};

export const BluefishSymbolContext = React.createContext<BluefishSymbolContextValue>({
  bfSymbolMap: new Map(),
  setBFSymbolMap: () => {},
});

export const useBluefishSymbolContext = () => useContext(BluefishSymbolContext);

export const useSymbol = (name: string): Symbol => {
  const { bfSymbolMap } = useBluefishSymbolContext();

  const parentRef = useContext(RefContext) as Measurable | null;

  const symbol = useMemo(() => Symbol(name), [name]);
  useEffect(() => {
    /* TODO: we're doing this synchronously right now, since that's also how names are handled, but
    this doesn't seem very robust... */
    // bfSymbolMap.set(symbol, { ref: undefined, children: [] });

    // add this symbol to the parent's children
    if (!parentRef) return;
    const parentSymbol = parentRef.symbol?.symbol;
    if (!parentSymbol) return;
    const parent = bfSymbolMap.get(parentSymbol);
    if (!parent) return;
    parent.children.push(symbol);

    // setBFSymbolMap((prev) => {
    //   const newMap = new Map(prev);
    //   newMap.set(symbol, { ref: null, children: [] });
    //   return newMap;
    // });
  }, [symbol, bfSymbolMap, parentRef]);
  return {
    symbol,
    // TODO: it seems like this parent field isn't actually necessary since we resolve the parent in
    // this hook already
    parent: parentRef?.symbol?.symbol,
  };
};
