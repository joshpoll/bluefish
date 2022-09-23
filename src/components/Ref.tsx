import { forwardRef, useImperativeHandle } from 'react';
import { Constraints, NewPlaceable, Placeable, useBluefishContext } from '../bluefish';
import { NewBBoxClass } from '../NewBBox';

export type RefProps = { to: string | React.RefObject<any> };

export const Ref = forwardRef((props: RefProps, ref: any) => {
  const context = useBluefishContext();

  useImperativeHandle(
    ref,
    () => ({
      measure(constraints: Constraints): NewBBoxClass {
        if (typeof props.to === 'string') {
          try {
            console.log('ref to', props.to, 'in', Array.from(context.bfMap.entries()));
            return (context.bfMap.get(props.to)! as any).measure(constraints);
          } catch (e) {
            throw new Error(
              `Could not find a component with id ${props.to}. Available names are: ${Array.from(
                context.bfMap.keys(),
              ).join(', ')}
              ${Array.from(context.bfMap.entries())
                .map(([key, value]) => `${key}: ${Object.keys(value)}`)
                .join(', ')}
              `,
            );
          }
        } else {
          try {
            return props.to.current.measure(constraints);
          } catch (e) {
            throw new Error(`Could not find a component with ref ${props.to}`);
          }
        }
      },
    }),
    [props.to, context.bfMap],
  );

  return <></>;
});
