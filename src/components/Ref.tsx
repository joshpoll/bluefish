import { forwardRef, useEffect, useLayoutEffect } from 'react';
import { useBluefishLayout, withBluefishFn } from '../bluefish';

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
export const Ref = forwardRef((props: RefProps, ref: any) => {
  // TODO: is there a way to ensure the ref is defined at this point?
  useEffect(() => {
    console.log('ref', props.to);
  }, [props.to]);
  useBluefishLayout(
    props.to !== undefined && props.to.current !== null ? props.to.current.measure : () => ({ width: 0, height: 0 }),
    {},
    ref,
    undefined,
  );
  return <></>;
});
