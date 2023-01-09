import { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  BluefishContext,
  BluefishContextValue,
  Constraints,
  Measurable,
  Measure,
  NewBBoxWithChildren,
  NewPlaceable,
  Placeable,
  processChildren,
  RefContext,
  useBluefishContext,
} from '../bluefish';
import { CoordinateTransform, NewBBoxClass, NewBBox } from '../NewBBox';
import { withBluefish, useBluefishLayout2 } from '../bluefish';
import { isEqual } from 'lodash';
import React from 'react';

export type BluefishRef = string | React.RefObject<any>;

export const resolveRef = (ref: BluefishRef, map: BluefishContextValue['bfMap']): Measurable => {
  if (typeof ref === 'string') {
    const refObject = map.get(ref);
    if (refObject === undefined) {
      throw new Error(`Could not find component with id ${ref}. Available ids: ${Array.from(map.keys())}`);
    } else {
      return refObject as unknown as Measurable;
    }
  } else {
    const refObject = ref.current;
    if (refObject === null) {
      throw new Error(`Ref object is null`);
    } else {
      return refObject;
    }
  }
};

export type CopyAttrProps = {
  to: string;
  /* TODO: refine the type of props */
  children: (props: any) => React.ReactNode;
} & (
  | {
      props: string | string[];
    }
  | {
      prop: string | string[];
    }
);

const getPropsFromMeasurable = (ref: Measurable, props: string[]): any => {
  const refProps = ref.props;
  const result: any = {};
  props.forEach((prop) => {
    result[prop] = refProps[prop];
  });
  return result;
};

// a layout hook
// const useBluefishLayout = (
//   measure: Measure,
//   bbox: Partial<NewBBox>,
//   coord: Partial<CoordinateTransform>,
//   ref: React.ForwardedRef<unknown>,
//   domRef: React.RefObject<SVGElement>,
//   props: any,
//   children?: React.ReactNode,
//   name?: any,
// ): NewBBoxWithChildren & { boundary?: paper.Path } => {
//   const context = useContext(BluefishContext);

//   const childrenRef = useRef<any[]>([]);

//   const [left, setLeft] = useState(bbox.left);
//   const [top, setTop] = useState(bbox.top);
//   const [right, setRight] = useState(bbox.right);
//   const [bottom, setBottom] = useState(bbox.bottom);
//   const [width, setWidth] = useState(bbox.width);
//   const [height, setHeight] = useState(bbox.height);
//   const [boundary, setBoundary] = useState<paper.Path | undefined>(undefined);
//   // const [_coord, setCoord] = useState<CoordinateTransform | undefined>(coord);
//   const coordRef = useRef<CoordinateTransform>(coord ?? {});
//   const bboxClassRef = useRef<NewBBoxClass | undefined>(undefined);
//   const transformStackRef = useRef<CoordinateTransform[] | undefined>(undefined);
//   // remember constraints so we can re-measure if they change
//   const constraintRef = useRef<Constraints | undefined>(undefined);
//   // remember props so we can re-measure if they change
//   const propsRef = useRef<any>(undefined);

//   // console.log('useBluefishLayout', children);
//   // useEffect(() => {
//   //   console.log(name, 'left updated to', left);
//   // }, [name, left]);

//   // useEffect(() => {
//   //   console.log(name, 'top updated to', top);
//   // }, [name, top]);

//   // useEffect(() => {
//   //   if (name !== undefined) {
//   //     console.log('setting ref', name, ref);
//   //     context.bfMap.set(name, ref as any);
//   //   }
//   // });

//   useImperativeHandle(
//     ref,
//     (): Measurable => ({
//       props: propsRef.current,
//       domRef: domRef.current,
//       name,
//       get transformStack() {
//         return transformStackRef.current;
//       },
//       set transformStack(transforms: CoordinateTransform[] | undefined) {
//         if (transforms === undefined) {
//           transformStackRef.current = [coordRef.current];
//         } else {
//           transformStackRef.current = [...transforms, coordRef.current];
//         }
//       },
//       measure(constraints: Constraints, isRef?: boolean): NewBBoxClass {
//         console.log('measuring', name, 'with constraints', constraints, 'and children', childrenRef.current);
//         let bbox;
//         if (
//           isRef !== true &&
//           (bboxClassRef.current === undefined ||
//             !isEqual(constraintRef.current, constraints) ||
//             propsRef.current !== props)
//         ) {
//           constraintRef.current = constraints;
//           // console.log('measuring', name);
//           childrenRef.current.forEach((child) => {
//             if (child !== undefined) {
//               child.transformStack = transformStackRef.current;
//             }
//           });
//           const { width, height, left, top, right, bottom, boundary } = measure(childrenRef.current, constraints);
//           console.log('measured', name, JSON.stringify({ width, height, left, top, right, bottom }));
//           setWidth(width);
//           setHeight(height);
//           setLeft(left);
//           setTop(top);
//           setRight(right);
//           setBottom(bottom);
//           setBoundary(boundary);

//           bbox = new NewBBoxClass(
//             { left, top, right, bottom, width, height, coord: coordRef.current },
//             {
//               left: (left) => {
//                 // console.log(name, 'left set to', left);
//                 return setLeft(left);
//               },
//               top: (top) => {
//                 // console.log(name, 'top set to', top);
//                 return setTop(top);
//               },
//               right: (right) => {
//                 // console.log(name, 'right set to', right);
//                 return setRight(right);
//               },
//               bottom: (bottom) => {
//                 // console.log(name, 'bottom set to', bottom);
//                 return setBottom(bottom);
//               },
//               width: (width) => {
//                 // console.log(name, 'width set to', width);
//                 return setWidth(width);
//               },
//               height: (height) => {
//                 // console.log(name, 'height set to', height);
//                 return setHeight(height);
//               },
//               coord: (coord) => {
//                 // console.log(name, 'coord set to', coord);
//                 coordRef.current.scale = coord?.scale ?? {};
//                 coordRef.current.translate = coord?.translate ?? {};
//               },
//             },
//           );
//           bboxClassRef.current = bbox;
//         } else {
//           bbox = bboxClassRef.current;
//           console.log('using cached bbox', name, bbox);
//         }

//         return bbox!;
//       },
//     }),
//     [
//       measure,
//       childrenRef,
//       setLeft,
//       setTop,
//       setRight,
//       setBottom,
//       setWidth,
//       setHeight,
//       name,
//       bboxClassRef,
//       props,
//       domRef,
//     ],
//   );

//   // console.log(`returning bbox for ${name}`, { left, top, right, bottom, width, height });
//   console.log('[copyattr]', children);
//   return {
//     left: left,
//     top: top,
//     right: right,
//     bottom: bottom,
//     width: width,
//     height: height,
//     coord: coordRef.current,
//     boundary,
//     children: (() => {
//       console.log('[copyattr] children', children, Object.keys(context.bfMap));
//       return React.cloneElement(children as (props: any) => React.ReactNode, {
//         ref: (node: any) => {
//           console.log('[copyattr] ref', node);
//           node = getPropsFromMeasurable(resolveRef(props.to, context.bfMap), props.props);
//           childrenRef.current[0] = node;
//           // console.log('setting child ref', index, node, node.name);
//           if (node !== null && 'name' in node && node.name !== undefined) {
//             console.log('setting ref', node.name, node);
//             context.bfMap.set(node.name, node);
//           }
//           const { ref } = children as any;
//           // console.log('current ref on child', ref);
//           if (typeof ref === 'function') ref(node);
//           else if (ref) {
//             ref.current = node;
//           }
//         },
//       });
//     })(),
//     // children: React.Children.map(children, (child, index) => {
//     //   if (isValidElement(child)) {
//     //     return React.cloneElement(child as React.ReactElement<any>, {
//     //       // store a pointer to every child's ref in an array
//     //       // also pass through outer refs
//     //       // see: https://github.com/facebook/react/issues/8873
//     //       ref: (node: any) => {
//     //         childrenRef.current[index] = node;
//     //         // console.log('setting child ref', index, node, node.name);
//     //         if (node !== null && 'name' in node && node.name !== undefined) {
//     //           console.log('setting ref', node.name, node);
//     //           context.bfMap.set(node.name, node);
//     //         }
//     //         const { ref } = child as any;
//     //         console.log('current ref on child', ref);
//     //         if (typeof ref === 'function') ref(node);
//     //         else if (ref) {
//     //           ref.current = node;
//     //         }
//     //       },
//     //     });
//     //   } else {
//     //     // TODO: what to do with non-elements?
//     //     console.log('warning: non-element child', child);
//     //     return child;
//     //   }
//     // }),
//   };
// };

// const useBluefishLayout2 = <T extends { children?: any; name?: string }>(
//   init: {
//     bbox?: Partial<NewBBox>;
//     coord?: CoordinateTransform;
//   },
//   props: T,
//   measure: Measure,
// ) => {
//   const ref = useContext(RefContext);

//   const domRef = useRef<any>(null);

//   const { left, top, bottom, right, width, height, children, coord } = useBluefishLayout(
//     measure,
//     init?.bbox ?? {},
//     init?.coord ?? {},
//     ref,
//     domRef,
//     props,
//     props.children,
//     props.name,
//   );

//   return {
//     domRef,
//     bbox: {
//       left,
//       top,
//       bottom,
//       right,
//       width,
//       height,
//       coord,
//     },
//     children,
//   };
// };

// export const CopyAttr = withBluefish((props: CopyAttrProps) => {
//   console.log('[copyattr] props', props);
//   const { domRef, children } = useBluefishLayout2({}, props, () => {
//     return { width: 0, height: 0 };
//   });

//   // const propField = 'prop' in props ? 'prop' : 'props';
//   // const propsToCopy = props[propField as keyof typeof props] as string | string[];
//   // const propsArray = Array.isArray(propsToCopy) ? propsToCopy : [propsToCopy];
//   // const copiedProps = propsArray.reduce((acc: any, prop) => {
//   //   acc[prop] = ref.props[prop];
//   //   return acc;
//   // }, {});

//   return <g ref={domRef}>{children}</g>;
// });
// CopyAttr.displayName = 'CopyAttr';

export const CopyAttr = withBluefish((props: CopyAttrProps) => {
  const context = useBluefishContext();
  // const [ref, setRef] = useState<any>(null);
  const [copiedProps, setCopiedProps] = useState<any>(undefined);

  useEffect(() => {
    const ref = resolveRef(props.to, context.bfMap);

    if (ref === undefined) return;
    console.log('[copyattr] ref', ref);

    const propField = 'prop' in props ? 'prop' : 'props';
    const propsToCopy = props[propField as keyof typeof props] as string | string[];
    const propsArray = Array.isArray(propsToCopy) ? propsToCopy : [propsToCopy];
    setCopiedProps(
      propsArray.reduce((acc: any, prop) => {
        acc[prop] = ref.props[prop];
        return acc;
      }, {}),
    );
  }, [props, context.bfMap]);

  console.log('[copyattr] copiedProps', copiedProps, copiedProps ? props.children(copiedProps) : null);

  const { domRef, children } = useBluefishLayout2(
    {},
    { ...props, children: copiedProps ? props.children(copiedProps) : null },
    (measurables, constraints) => {
      console.log('[copyattr] measure', measurables, constraints);
      const placeables = measurables.map((m) => m.measure(constraints));
      return {
        width: placeables.reduce((acc, p) => Math.max(acc, p.width ?? 0), 0),
        height: placeables.reduce((acc, p) => Math.max(acc, p.height ?? 0), 0),
      };
    },
  );

  if (copiedProps === undefined) {
    return null;
  } else {
    return <g ref={domRef}>{children}</g>;
  }
});
