import { forwardRef, useImperativeHandle } from 'react';
import { Constraints, Placeable } from '../bluefish';

export type RefProps = { to?: React.RefObject<any> };

export const Ref = forwardRef((props: RefProps, ref: any) => {
  useImperativeHandle(
    ref,
    () => ({
      measure(constraints: Constraints): Placeable {
        console.log('props.to', props.to);
        return (
          props.to?.current.measure(constraints) ?? {
            measuredWidth: 0,
            measuredHeight: 0,
            place: () => {},
            placeUnlessDefined: () => {},
          }
        );
      },
    }),
    [props.to],
  );

  return <></>;
});
