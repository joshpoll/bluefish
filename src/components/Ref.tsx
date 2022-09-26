import { forwardRef, useImperativeHandle } from 'react';
import { BluefishContextValue, Constraints, NewPlaceable, Placeable, useBluefishContext } from '../bluefish';
import { NewBBoxClass } from '../NewBBox';

export type BluefishRef = string | React.RefObject<any>;

export type RefProps = { to: BluefishRef };

export const resolveRef = (ref: BluefishRef, map: BluefishContextValue['bfMap']) => {
  if (typeof ref === 'string') {
    const refObject = map.get(ref);
    if (refObject === undefined) {
      throw new Error(`Could not find component with id ${ref}. Available ids: ${Array.from(map.keys())}`);
    } else {
      return refObject;
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

export const Ref = forwardRef((props: RefProps, ref: any) => {
  const context = useBluefishContext();

  useImperativeHandle(
    ref,
    () => ({
      measure(constraints: Constraints): NewBBoxClass {
        try {
          return resolveRef(props.to, context.bfMap).measure(constraints);
        } catch (e) {
          console.error('Error while measuring', props.to, e);
          throw e;
        }
      },
    }),
    [props.to, context.bfMap],
  );

  return <></>;
});
