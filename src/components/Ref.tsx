import { forwardRef, useImperativeHandle } from 'react';
import { Constraints, Placeable } from '../bluefish';

export type RefProps = { to?: React.RefObject<any> };

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
