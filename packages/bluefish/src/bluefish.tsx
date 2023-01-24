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
import { flattenChildren, flattenChildrenToGroups, ChildGroup, ReactChild } from './flatten-children';
import { LayoutGroup } from './components/LayoutGroup';

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
  // name: string;
  name?: Symbol;
  measure(constraints: Constraints, isRef?: boolean): NewBBoxClass;
  transformStack: CoordinateTransform[] | undefined;
  id?: string;
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
export type NewBBoxWithChildren2<C extends ChildGroup = ReactChild> = Partial<
  NewBBox & {
    children: C[];
  }
>;

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

const attachRefs = (
  childGroups: ChildGroup[],
  callbackRef: (child: ReactChild, keys: (string | number)[]) => (node: any) => void,
  keys: (string | number)[] = [],
): ChildGroup[] => {
  return childGroups.map((childGroup, index) => {
    if (Array.isArray(childGroup)) {
      return attachRefs(childGroup, callbackRef, [...keys, index]);
    } else if (isValidElement(childGroup)) {
      return React.cloneElement(childGroup as React.ReactElement<any>, {
        ref: callbackRef(childGroup, [...keys, index]),
      });
    } else if (typeof childGroup === 'string' || typeof childGroup === 'number') {
      console.log('warning: non-element child', childGroup);
      return childGroup;
    } else {
      return {
        key: childGroup.key,
        value: attachRefs(childGroup.value, callbackRef, [...keys, index]),
      };
    }
  });
};

const restoreLayoutGroups = (childGroups: ChildGroup[]): ReactChild[] => {
  return childGroups.map((childGroup) => {
    if (Array.isArray(childGroup)) {
      return <LayoutGroup>{restoreLayoutGroups(childGroup)}</LayoutGroup>;
    } else if (isValidElement(childGroup)) {
      return childGroup;
    } else if (typeof childGroup === 'string' || typeof childGroup === 'number') {
      return childGroup;
    } else {
      return <LayoutGroup id={childGroup.key}>{restoreLayoutGroups(childGroup.value)}</LayoutGroup>;
    }
  });
};

const processChildren2 = (
  children: React.ReactNode,
  callbackRef: (child: ReactChild, keys: (string | number)[]) => (node: any) => void,
): ReactChild[] => {
  const childGroups = flattenChildrenToGroups(children);
  const childGroupsWithCallbacks = attachRefs(childGroups, callbackRef);
  return restoreLayoutGroups(childGroupsWithCallbacks);
};

export const processChildren = (
  children: React.ReactNode,
  callbackRef: (child: any, index: number) => (node: any) => void,
  // name?: string,
): any => {
  // console.log('[processChildren] children', children);
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

const setTransformStacks = (children: any[], transformStack?: CoordinateTransform[]): void => {
  children.forEach((child) => {
    if (child === undefined) return;
    if (Array.isArray(child)) {
      setTransformStacks(child, transformStack);
    } else {
      child.transformStack = transformStack;
    }
    // TODO: handle groups...
  });
};

// a layout hook
export const useBluefishLayoutInternal = (
  measure: Measure,
  bbox: Partial<NewBBox>,
  coord: Partial<CoordinateTransform>,
  ref: React.ForwardedRef<unknown>,
  domRef: React.RefObject<SVGElement>,
  props: any,
  children?: React.ReactNode,
  // name?: any,
  name?: {
    symbol: symbol;
    parent?: symbol;
  },
): /* NewBBoxWithChildren2<C> */ NewBBoxWithChildren & {
  boundary?: paper.Path;
  constraints?: Constraints;
  id?: string;
} => {
  const id = useId();

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
      // name,
      name: name,
      id,
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
        // console.log('measuring', name, 'with constraints', constraints, 'and children', childrenRef.current);
        let bbox;
        if (
          isRef !== true &&
          (bboxClassRef.current === undefined ||
            !isEqual(constraintRef.current, constraints) ||
            propsRef.current !== props)
        ) {
          constraintRef.current = constraints;
          // console.log('constraints', constraintRef.current);
          // console.log('measuring', name);
          // childrenRef.current.forEach((child) => {
          //   if (child !== undefined) {
          //     child.transformStack = transformStackRef.current;
          //   }
          // });
          setTransformStacks(childrenRef.current, transformStackRef.current);
          const { width, height, left, top, right, bottom, boundary } = measure(childrenRef.current, constraints);
          // console.log('measured', name, JSON.stringify({ width, height, left, top, right, bottom }));
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
          // console.log('using cached bbox', name, bbox);
        }

        return bbox!;
      },
    }),
    [domRef, name, id, props, measure],
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
    id,
    left: left,
    top: top,
    right: right,
    bottom: bottom,
    width: width,
    height: height,
    coord: coordRef.current,
    constraints: constraintRef.current,
    boundary,
    children: processChildren2(children, (child, keys) => (node: any) => {
      let location: { [key: string | number]: any } = childrenRef.current;
      // console.log('[location] finding location', keys, 'in', location);
      for (const key of keys.slice(0, -1)) {
        // console.log('[location]', 'key', key, 'in', location, 'is', location[key]);
        if (location[key] === undefined) {
          location[key] = [];
        }
        location = location[key];
      }
      const lastKey = keys[keys.length - 1];
      if (lastKey !== undefined) {
        location[lastKey] = node;
      }

      // console.log('setting child ref', index, node, node.name);
      // if (node !== null && 'name' in node && node.name !== undefined) {
      //   console.log('setting ref', node.name, node);
      //   context.bfMap.set(node.name, node);
      // }
      // add symbol the map
      if (node !== null && 'name' in node && node.name !== undefined) {
        // console.log('[symbol] setting ref', node.name, node);
        symbolContext.bfSymbolMap.set(node.name.symbol, {
          ref: node,
          children: new Set(),
        });
        // console.log('[symbol] symbolMap after', symbolContext.bfSymbolMap.get(node.name.symbol));

        // // connect the symbol to its parent
        // if (node.symbol.parent !== undefined) {
        //   console.log('[symbol] setting parent', node.symbol.parent, node.symbol.symbol);
        //   if (!symbolContext.bfSymbolMap.has(node.symbol.parent)) {
        //     console.log('[symbol] parent not found in', symbolContext.bfSymbolMap);
        //   }
        //   symbolContext.bfSymbolMap.set(node.symbol.parent, {
        //     ref: symbolContext.bfSymbolMap.get(node.symbol.parent)!.ref,
        //     // children: [...(symbolContext.bfSymbolMap.get(node.symbol.parent)?.children ?? []),
        //     // node.symbol.symbol],
        //     children: new Set([
        //       ...Array.from(symbolContext.bfSymbolMap.get(node.symbol.parent)?.children ?? []),
        //       node.symbol.symbol,
        //     ]),
        //   });
        // }
      }
      const { ref } = child as any;
      // console.log('current ref on child', ref);
      if (typeof ref === 'function') ref(node);
      else if (ref) {
        ref.current = node;
      }
    }),
    // children: processChildren(
    //   children,
    //   (child, index) => (node: any) => {
    //     childrenRef.current[index] = node;
    //     // console.log('setting child ref', index, node, node.name);
    //     // if (node !== null && 'name' in node && node.name !== undefined) {
    //     //   console.log('setting ref', node.name, node);
    //     //   context.bfMap.set(node.name, node);
    //     // }
    //     // add symbol the map
    //     if (node !== null && 'name' in node && node.name !== undefined) {
    //       // console.log('[symbol] setting ref', node.name, node);
    //       symbolContext.bfSymbolMap.set(node.name.symbol, {
    //         ref: node,
    //         children: new Set(),
    //       });
    //       // console.log('[symbol] symbolMap after', symbolContext.bfSymbolMap.get(node.name.symbol));

    //       // // connect the symbol to its parent
    //       // if (node.symbol.parent !== undefined) {
    //       //   console.log('[symbol] setting parent', node.symbol.parent, node.symbol.symbol);
    //       //   if (!symbolContext.bfSymbolMap.has(node.symbol.parent)) {
    //       //     console.log('[symbol] parent not found in', symbolContext.bfSymbolMap);
    //       //   }
    //       //   symbolContext.bfSymbolMap.set(node.symbol.parent, {
    //       //     ref: symbolContext.bfSymbolMap.get(node.symbol.parent)!.ref,
    //       //     // children: [...(symbolContext.bfSymbolMap.get(node.symbol.parent)?.children ?? []),
    //       //     // node.symbol.symbol],
    //       //     children: new Set([
    //       //       ...Array.from(symbolContext.bfSymbolMap.get(node.symbol.parent)?.children ?? []),
    //       //       node.symbol.symbol,
    //       //     ]),
    //       //   });
    //       // }
    //     }
    //     const { ref } = child as any;
    //     // console.log('current ref on child', ref);
    //     if (typeof ref === 'function') ref(node);
    //     else if (ref) {
    //       ref.current = node;
    //     }
    //   },
    // name,
    // ),
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

export type Symbol = {
  symbol: symbol;
  parent?: symbol;
};

export const useBluefishLayout = <T extends { children?: any; /* name?: string;  */ name?: Symbol }>(
  init: {
    bbox?: Partial<NewBBox>;
    coord?: CoordinateTransform;
  },
  props: T,
  measure: Measure,
) => {
  const { ref } = useContext(RefContext);

  const domRef = useRef<any>(null);

  // console.log('useBluefishLayout2', props.name, props.children, ref, domRef);
  const { left, top, bottom, right, width, height, children, coord, boundary, constraints, id } =
    useBluefishLayoutInternal(
      measure,
      init?.bbox ?? {},
      init?.coord ?? {},
      ref,
      domRef,
      props,
      props.children,
      // props.name,
      props.name,
    );

  // console.log('useBluefishLayout2 after', props.name, children, ref, domRef);

  return {
    domRef,
    boundary,
    constraints,
    id,
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

type RefContextValue = {
  ref: React.RefObject<SVGElement> | null;
  parent: {
    scope?: symbol;
    ref: symbol;
  };
};

const root = Symbol('$root');

// create a higher order component that uses a forwardRef, but places the ref in a context so it can
// be looked up by the useBluefishLayout2 hook
export const RefContext = React.createContext<RefContextValue>({
  ref: null,
  parent: {
    scope: root,
    ref: root,
  },
  // symbol: {
  //   symbol: Symbol('$root'),
  // },
});

// injects name (and debug. still todo)
// injects ref
export const withBluefish = <ComponentProps,>(WrappedComponent: React.ComponentType<ComponentProps>) =>
  forwardRef((props: PropsWithChildren<ComponentProps> & { /* name?: any; */ name?: Symbol }, ref: any) => {
    /* TODO: need to collect refs maybe?? */
    const {
      ref: contextRef,
      parent: { scope: parentScopeSymbol, ref: parentRefSymbol },
    } = useContext(RefContext);
    // console.log('[withBluefish] lookup symbol', parentSymbol);
    const symbolContext = useBluefishSymbolContext();
    // TODO: I definitely wrote this code, but I also definitely don't understand it.
    const mergedRef = ref ?? contextRef;
    // console.log('[withBluefish] ref', { ref, contextRef, mergedRef });
    // console.log('[withBluefish]', props.name, props.symbol, mergedRef);
    // console.log('[withBluefish] name & symbol', props.name, props.symbol);

    const id = useId();

    const autogenSymbol = useMemo(() => Symbol('AUTOGEN-' + id), [id]);

    // const mergedRefSymbol = ref !== undefined ? autogenSymbol : parentRefSymbol;

    const symbol = useMemo(() => {
      return props.name?.symbol ?? autogenSymbol;
    }, [autogenSymbol, props.name?.symbol]);

    // const symbol = useMemo(() => {
    //   if (props.symbol !== undefined) {
    //     console.log('[withBluefish] setting symbol', props.symbol.symbol, props.symbol.parent);
    //     symbolContext.bfSymbolMap.set(props.symbol.symbol, {
    //       ref: undefined,
    //       children: new Set(),
    //     });

    //     if (props.symbol.parent !== undefined) {
    //       const symbolParent = props.symbol.parent;

    //       console.log(
    //         '[withBluefish] symbolParent entry',
    //         props.symbol.symbol,
    //         symbolParent,
    //         symbolContext.bfSymbolMap.get(symbolParent),
    //       );

    //       symbolContext.bfSymbolMap.set(symbolParent, {
    //         ref: symbolContext.bfSymbolMap.get(symbolParent)?.ref ?? undefined,
    //         children: symbolContext.bfSymbolMap.get(symbolParent)?.children ?? new Set(),
    //       });
    //     }

    //     return props.symbol;
    //   }
    //   symbolContext.bfSymbolMap.set(autogenSymbol, {
    //     ref: undefined,
    //     children: new Set(),
    //   });

    //   return {
    //     symbol: autogenSymbol,
    //   };
    // }, [autogenSymbol, props.symbol, symbolContext.bfSymbolMap]);

    // console.log('parentSymbol', parentSymbol);
    // console.log('[withBluefish] symbol', symbol);
    // console.log(
    //   '[withBluefish] ref',
    //   symbol,
    //   ref === null ? null : typeof ref,
    //   contextRef === null ? null : typeof contextRef,
    // );
    if (ref === null) {
      // we are inheriting from above, so connect the symbol above to this one
      // console.log('[withBluefish] connecting', symbol, 'to REF parent', parentRefSymbol);
      symbolContext.bfSymbolMap.set(parentRefSymbol, {
        ref: symbol,
        children: symbolContext.bfSymbolMap.get(parentRefSymbol)?.children ?? new Set(),
      });
    }
    // if (parentScopeSymbol !== undefined) {
    //   symbolContext.bfSymbolMap.set(parentScopeSymbol, {
    //     ref: symbol,
    //     children: symbolContext.bfSymbolMap.get(parentScopeSymbol)?.children ?? new Set(),
    //   });
    // }

    return (
      // TODO: I think I also need to pass domRef here & I need to attach domRef to the WrappedComponent
      <RefContext.Provider
        value={{
          ref: mergedRef,
          parent: {
            scope: props.name?.symbol,
            ref: symbol,
          },
        }}
      >
        <WrappedComponent {...props} name={props.name ?? { symbol: autogenSymbol }} />
      </RefContext.Provider>
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
    ref?: React.MutableRefObject<any> | symbol;
    // children: symbol[];
    children: Set<symbol>;
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

export const useName = (name: string): Symbol => {
  const { bfSymbolMap } = useBluefishSymbolContext();

  const {
    ref: parentRef,
    parent: { scope: parentSymbol },
  } = useContext(RefContext);

  const symbol = useMemo(() => Symbol(name), [name]);
  // useEffect(() => {
  //   /* TODO: we're doing this synchronously right now, since that's also how names are handled, but
  //   this doesn't seem very robust... */
  //   // bfSymbolMap.set(symbol, { ref: undefined, children: [] });

  //   // add this symbol to the parent's children
  //   if (!parentRef) return;
  //   const parentSymbol = parentRef.symbol?.symbol;
  //   if (!parentSymbol) return;
  //   const parent = bfSymbolMap.get(parentSymbol);
  //   if (!parent) return;
  //   parent.children.push(symbol);

  //   // setBFSymbolMap((prev) => {
  //   //   const newMap = new Map(prev);
  //   //   newMap.set(symbol, { ref: null, children: [] });
  //   //   return newMap;
  //   // });
  // }, [symbol, bfSymbolMap, parentRef]);

  if (parentSymbol !== undefined) {
    //     console.log(
    //       '[withBluefish] connecting',
    //       symbol,
    //       'to SCOPE parent',
    //       parentSymbol,
    //       `Symbol map: ${Array.from(bfSymbolMap.entries()).map(
    //         (e) => `{
    //   symbol: ${e[0].description},
    //   ref: ${typeof e[1].ref === 'symbol' ? e[1].ref.description : e[1].ref?.toString()},
    // }`,
    //       )}`,
    //     );
    bfSymbolMap.set(parentSymbol, {
      ref: bfSymbolMap.get(parentSymbol)?.ref ?? undefined,
      children: new Set([...Array.from(bfSymbolMap.get(parentSymbol)?.children ?? []), symbol]),
    });
  }

  return {
    symbol,
    // TODO: it seems like this parent field isn't actually necessary since we resolve the parent in
    // this hook already
    parent: parentSymbol,
  };
};

export const useNameList = (names: string[]): Symbol[] => {
  const { bfSymbolMap } = useBluefishSymbolContext();

  const {
    ref: parentRef,
    parent: { scope: parentSymbol },
  } = useContext(RefContext);

  const symbols = useMemo(() => names.map((name) => Symbol(name)), [names]);
  // useEffect(() => {
  //   /* TODO: we're doing this synchronously right now, since that's also how names are handled, but
  //   this doesn't seem very robust... */
  //   // bfSymbolMap.set(symbol, { ref: undefined, children: [] });

  //   // add this symbol to the parent's children
  //   if (!parentRef) return;
  //   const parentSymbol = parentRef.symbol?.symbol;
  //   if (!parentSymbol) return;
  //   const parent = bfSymbolMap.get(parentSymbol);
  //   if (!parent) return;
  //   parent.children.push(symbol);

  //   // setBFSymbolMap((prev) => {
  //   //   const newMap = new Map(prev);
  //   //   newMap.set(symbol, { ref: null, children: [] });
  //   //   return newMap;
  //   // });
  // }, [symbol, bfSymbolMap, parentRef]);
  return symbols.map((symbol) => {
    if (parentSymbol !== undefined) {
      // console.log('[withBluefish] connecting', symbol, 'to SCOPE parent', parentSymbol);
      bfSymbolMap.set(parentSymbol, {
        ref: bfSymbolMap.get(parentSymbol)?.ref ?? undefined,
        children: new Set([...Array.from(bfSymbolMap.get(parentSymbol)?.children ?? []), symbol]),
      });
    }

    return {
      symbol,
      // TODO: it seems like this parent field isn't actually necessary since we resolve the parent in
      // this hook already
      parent: parentSymbol,
    };
  });
};

export const lookup = (symbol: Symbol, ...path: string[]) => {
  return {
    type: 'lookup',
    symbol,
    path,
  } as const;
};

export type PropsWithBluefish<P = unknown> = PropsWithChildren<Omit<P, 'name'>> & { name?: Symbol };
