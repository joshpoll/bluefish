import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect } from 'react';
import { Constraints, LayoutFn, Measure, Placeable, useBluefishLayout, withBluefishFn } from '../bluefish';

export type RefProps = { to?: React.RefObject<any> };

// export const Ref = withGXMFn(
//   ({ to }) => {
//     return (_measurables, constraints) => {
//       const { width, height } = to.current.measure(constraints);
//       return { width, height };
//     };
//   },
//   (_props: RefProps) => <></>,
// );

// use ref's measure function as our own
// export const Ref = forwardRef((props: RefProps, ref: any) => {
//   // TODO: is there a way to ensure the ref is defined at this point?
//   useEffect(() => {
//     console.log('ref', props.to);
//     console.log('ref', props.to?.current?.measure({ width: 100, height: 100 }));
//   }, [props.to]);

//   let measure: Measure;
//   if (props.to !== undefined && props.to.current !== null) {
//     const { measure: toMeasure } = props.to.current;
//     measure = (_measurables, constraints) => {
//       console.log('measuring', toMeasure({ width: 100, height: 100 }));
//       return toMeasure(constraints);
//     };
//   } else {
//     console.log('uh oh', props.to, props.to !== undefined && props.to.current !== null);
//     measure = () => ({ width: 0, height: 0 });
//   }

//   useBluefishLayout(measure, {}, ref, undefined);
//   return <></>;
// });

// export const useRefLayout = (ref: React.ForwardedRef<unknown>, to?: React.RefObject<any>): BBoxWithChildren => {
//   useImperativeHandle(
//     ref,
//     () => ({
//       measure(constraints: Constraints): Placeable {
//         return to?.current;
//       },
//     }),
//     [to],
//   );
// };

const refMeasurePolicy =
  (options: RefProps): Measure =>
  (_measurables, constraints) => {
    console.log('measuring ref');
    if (options.to !== undefined && options.to.current !== null) {
      const { measure: toMeasure } = options.to.current;
      const placeable = toMeasure(constraints) as Placeable;
      placeable.placeUnlessDefined({ x: 0, y: 0 });

      return {
        width: placeable.measuredWidth,
        height: placeable.measuredHeight,
      };
    } else {
      return { width: 0, height: 0 };
    }
  };

// export const Ref = LayoutFn((props: RefProps) => refMeasurePolicy(props));

export const Ref = forwardRef((props: RefProps, ref: any) => {
  useImperativeHandle(
    ref,
    () => ({
      measure(constraints: Constraints): Placeable {
        return props.to?.current.measure(constraints);
      },
    }),
    [props.to],
  );

  return <></>;
});
