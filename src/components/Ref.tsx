import { forwardRef, useImperativeHandle } from 'react';
import { Constraints, NewPlaceable, Placeable } from '../bluefish';

export type RefProps = { to?: React.RefObject<any> };

export const Ref = forwardRef((props: RefProps, ref: any) => {
  useImperativeHandle(
    ref,
    () => ({
      measure(constraints: Constraints): NewPlaceable {
        console.log('props.to', props.to, props.to?.current?.measure(constraints));
        return props.to?.current.measure(constraints) ?? {};
      },
    }),
    [props.to],
  );

  return <></>;
});
