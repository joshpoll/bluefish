import { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  BluefishContextValue,
  Constraints,
  Measurable,
  NewPlaceable,
  Placeable,
  useBluefishContext,
} from '../bluefish';
import { CoordinateTransform, NewBBoxClass, NewBBox } from '../NewBBox';

export type BluefishRef = string | React.RefObject<any>;

export type RefProps = { to: BluefishRef };

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

const accumulateTransforms = (transforms: CoordinateTransform[]): CoordinateTransform => {
  console.log('[ref] accumulating transforms', transforms);
  return transforms.reduce(
    (acc: CoordinateTransform, t: CoordinateTransform) => {
      return {
        translate: {
          x: (acc.translate?.x ?? 0) + (t.translate?.x ?? 0),
          y: (acc.translate?.y ?? 0) + (t.translate?.y ?? 0),
        },
        scale: {
          x: (acc.scale?.x ?? 1) * (t.scale?.x ?? 1),
          y: (acc.scale?.y ?? 1) * (t.scale?.y ?? 1),
        },
      };
    },
    {
      translate: { x: 0, y: 0 },
      scale: { x: 1, y: 1 },
    },
  );
};

// composition, not inheritance
// wraps a bbox in a version that takes an additional transform
export class RefBBox extends NewBBoxClass {
  private _ref: NewBBoxClass;
  private _transform: CoordinateTransform;

  constructor(ref: NewBBoxClass, transform: CoordinateTransform) {
    super({ ...ref });
    this._transform = transform;
    this._ref = ref;
  }

  get left() {
    if (this._ref.left === undefined) {
      return undefined;
    } else {
      return this._ref.left * (this._transform.scale?.x ?? 1) + (this._transform?.translate?.x ?? 0);
    }
  }

  get top() {
    if (this._ref.top === undefined) {
      return undefined;
    } else {
      return this._ref.top * (this._transform.scale?.y ?? 1) + (this._transform?.translate?.y ?? 0);
    }
  }

  get right() {
    if (this._ref.right === undefined) {
      return undefined;
    } else {
      return this._ref.right * (this._transform.scale?.x ?? 1) + (this._transform?.translate?.x ?? 0);
    }
  }

  get bottom() {
    if (this._ref.bottom === undefined) {
      return undefined;
    } else {
      return this._ref.bottom * (this._transform.scale?.y ?? 1) + (this._transform?.translate?.y ?? 0);
    }
  }

  get width() {
    if (this._ref.width === undefined) {
      return undefined;
    } else {
      return this._ref.width * (this._transform.scale?.x ?? 1);
    }
  }

  get height() {
    if (this._ref.height === undefined) {
      return undefined;
    } else {
      return this._ref.height * (this._transform.scale?.y ?? 1);
    }
  }

  set left(value: number | undefined) {
    // transform back to ref coordinates
    if (value === undefined) {
      this._ref.left = undefined;
    } else {
      this._ref.left = (value - (this._transform?.translate?.x ?? 0)) / (this._transform.scale?.x ?? 1);
    }
  }

  set top(value: number | undefined) {
    if (value === undefined) {
      this._ref.top = undefined;
    } else {
      this._ref.top = (value - (this._transform?.translate?.y ?? 0)) / (this._transform.scale?.y ?? 1);
    }
  }

  set right(value: number | undefined) {
    if (value === undefined) {
      this._ref.right = undefined;
    } else {
      this._ref.right = (value - (this._transform?.translate?.x ?? 0)) / (this._transform.scale?.x ?? 1);
    }
  }

  set bottom(value: number | undefined) {
    if (value === undefined) {
      this._ref.bottom = undefined;
    } else {
      this._ref.bottom = (value - (this._transform?.translate?.y ?? 0)) / (this._transform.scale?.y ?? 1);
    }
  }

  set width(value: number | undefined) {
    if (value === undefined) {
      this._ref.width = undefined;
    } else {
      this._ref.width = value / (this._transform.scale?.x ?? 1);
    }
  }

  set height(value: number | undefined) {
    if (value === undefined) {
      this._ref.height = undefined;
    } else {
      this._ref.height = value / (this._transform.scale?.y ?? 1);
    }
  }
}

export const Ref = forwardRef((props: RefProps, ref: any) => {
  const context = useBluefishContext();

  const transformStackRef = useRef<CoordinateTransform[] | undefined>(undefined);

  useImperativeHandle(
    ref,
    () => ({
      get transformStack() {
        return transformStackRef.current;
      },
      set transformStack(transforms: CoordinateTransform[] | undefined) {
        console.log('[ref] setting transform stack', transforms);
        if (transforms !== undefined) {
          // notice that we don't use coords here b/c coords can only be set after measure is
          // returned at which point Ref behaves like the component it references
          transformStackRef.current = transforms;
        }
      },
      measure(constraints: Constraints): NewBBoxClass {
        try {
          const measurable = resolveRef(props.to, context.bfMap);
          const thisTransform = accumulateTransforms(transformStackRef.current ?? []);
          const otherTransform = accumulateTransforms(measurable.transformStack ?? []);

          // transform other into this coordinate system
          const otherTransformInThisCoordinateSystem = {
            translate: {
              x: otherTransform.translate!.x! - thisTransform.translate!.x!,
              y: otherTransform.translate!.y! - thisTransform.translate!.y!,
            },
            scale: {
              x: otherTransform.scale!.x! / thisTransform.scale!.x!,

              y: otherTransform.scale!.y! / thisTransform.scale!.y!,
            },
          };

          return new RefBBox(measurable.measure(constraints), otherTransformInThisCoordinateSystem);
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
