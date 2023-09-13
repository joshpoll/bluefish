import { forwardRef, useId, useImperativeHandle, useRef } from 'react';
import {
  BluefishContextValue,
  Constraints,
  Measurable,
  NewPlaceable,
  Placeable,
  useBluefishContext,
  Symbol,
} from '../bluefish';
import { CoordinateTransform, NewBBoxClass, NewBBox } from '../NewBBox';
import { BluefishSymbolMap, useBluefishSymbolContext, Alignment1D, Alignment2D } from '../bluefish';
import _ from 'lodash';

export type Lookup = {
  type: 'lookup';
  symbol: Symbol;
  path: string[];
};

export type BluefishRef = string | React.RefObject<any> | Symbol | Lookup;

export type RefProps = { to?: BluefishRef; select?: BluefishRef; guidePrimary?: Alignment1D | Alignment2D };

export const resolveRef = (
  ref: BluefishRef,
  map: BluefishContextValue['bfMap'],
  symbolMap: BluefishSymbolMap,
): Measurable => {
  //console.log('resolving ref', ref, 'map', map, 'symbolMap', symbolMap);
  if (typeof ref === 'string') {
    const refObject = map.get(ref);
    if (refObject === undefined) {
      throw new Error(`Could not find component with id ${ref}. Available ids: ${Array.from(map.keys())}`);
    } else {
      return refObject as unknown as Measurable;
    }
  } else if ('symbol' in ref) {
    //console.log('hitting the symbol');
    let refObject: symbol | React.MutableRefObject<any> | undefined =
      typeof ref.symbol === 'object' ? ref.symbol.symbol : ref.symbol;
    if ('type' in ref && ref.type === 'lookup') {
      //console.log('resolving path', ref.path);
      for (const position of ref.path) {
        //console.log('position', position);
        const children: Set<symbol> | undefined = symbolMap.get(refObject as symbol)?.children;
        // search children set for symbol with matching description
        //console.log('children', Array.from(children?.values() ?? []));
        // iterate through children and find the first occurrence where child.description ===
        // position
        // COMBAK: this reverse is used to get around React double-render... this is because the
        // symbols are not idempotent
        refObject = _.find(Array.from(children?.values() ?? []).reverse(), (child) => child.description === position);

        if (refObject === undefined) {
          throw new Error(
            `I couldn't find a component with symbol ${ref.symbol.symbol.description} and path ${ref.path.join(
              '.',
            )}. I searched ${Array.from(children?.values() ?? [])
              .reverse()
              .map((c) => c.description)}.
            Available symbols: ${Array.from(symbolMap.keys()).map((s) => s.description)}`,
          );
        }
      }
    } else {
      // console.log('[ref]', symbolMap);
      refObject = ref.symbol as symbol;
    }
    const savedRefObject = refObject;
    //console.log('ref', ref, 'savedRefObject', savedRefObject);
    // now that we have resolved the symbol, we need to find the actual ref associated with it

    // const refObject = symbolMap.get(ref.symbol)?.ref;
    // const foo = symbolMap.get(ref.symbol);
    // console.log(
    //   '[test]',
    //   Array.from(symbolMap.entries()).filter((e) => e[1].children.size > 0),
    //   // Array.from(symbolMap.entries()).map((e) => e[1].children.length),
    // );
    // debugger;
    if (refObject === undefined) {
      throw new Error(
        `Could not find component with symbol ${savedRefObject.description}. Available symbols: ${Array.from(
          symbolMap.keys(),
        ).map((s) => s.description)}`,
      );
    } else {
      const symbolTrace = [refObject.description];
      while (typeof refObject === 'symbol') {
        refObject = symbolMap.get(refObject)?.ref;
        if (typeof refObject === 'symbol') symbolTrace.push(refObject.description);
      }
      if (refObject === undefined) {
        throw new Error(
          `Found component with symbol ${savedRefObject.description}, but could not resolve its ref.
Symbol trace: ${symbolTrace}.
Symbol map: ${Array.from(symbolMap.entries()).map(
            (e) => `{
            symbol: ${e[0].description},
            ref: ${typeof e[1].ref === 'symbol' ? e[1].ref.description : e[1].ref?.toString()},
          }`,
          )}`,
        );
      }
      // console.log('[ref] resolved symbol', refObject);
      return refObject as unknown as Measurable;
    }
    // else if ref is a Ref component, then call this function again, but with its select prop
  } else if ('type' in ref && (ref as any).type === Ref) {
    // console.log('[ref] resolving ref', ref);
    return resolveRef((ref as any).props.select, map, symbolMap);
  } else {
    //console.log('[ref] resolving ref', ref);
    throw new Error(`Unknown ref object`);
    // const refObject = ref.current;
    // if (refObject === null) {
    //   throw new Error(`Ref object is null`);
    // } else {
    //   return refObject;
    // }
  }
};

const accumulateTransforms = (transforms: CoordinateTransform[]): CoordinateTransform => {
  // console.log('[ref] accumulating transforms', transforms);
  return transforms.reduce(
    (acc: CoordinateTransform, t: CoordinateTransform) => {
      const newTransform = {
        translate: {
          x: (acc.translate?.x ?? 0) + (t.translate?.x ?? 0),
          y: (acc.translate?.y ?? 0) + (t.translate?.y ?? 0),
        },
        scale: {
          x: (acc.scale?.x ?? 1) * (t.scale?.x ?? 1),
          y: (acc.scale?.y ?? 1) * (t.scale?.y ?? 1),
        },
      };
      // console.log(
      //   '[ref] accumulated transform',
      //   'acc',
      //   acc,
      //   't',
      //   JSON.stringify(t),
      //   'translate',
      //   {
      //     acc: acc.translate,
      //     t: t.translate,
      //     x: (acc.translate?.x ?? 0) + (t.translate?.x ?? 0),
      //     y: (acc.translate?.y ?? 0) + (t.translate?.y ?? 0),
      //   },
      //   newTransform,
      // );
      return newTransform;
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
  private _name: string | undefined;

  constructor(ref: NewBBoxClass, transform: CoordinateTransform, name: string | undefined) {
    super({ ...ref });
    this._transform = transform;
    this._ref = ref;
    this._name = name;
    // console.log(
    //   '[ref] asdfs created ref bbox',
    //   this._name,
    //   JSON.stringify({
    //     left: this._ref.left,
    //     top: this._ref.top,
    //     right: this._ref.right,
    //     bottom: this._ref.bottom,
    //     width: this._ref.width,
    //     height: this._ref.height,
    //   }),
    //   JSON.stringify({
    //     left: this.left,
    //     top: this.top,
    //     right: this.right,
    //     bottom: this.bottom,
    //     width: this.width,
    //     height: this.height,
    //   }),
    // );
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

  get coord() {
    // compose this._ref.coord with this._transform
    const refCoord = this._ref.coord;
    if (refCoord === undefined) {
      return undefined;
    }
    const transform = this._transform;
    return {
      translate: {
        x:
          refCoord.translate?.x === undefined
            ? undefined
            : refCoord.translate.x * (transform.scale?.x ?? 1) + (transform.translate?.x ?? 0),
        y:
          refCoord.translate?.y === undefined
            ? undefined
            : refCoord.translate.y * (transform.scale?.y ?? 1) + (transform.translate?.y ?? 0),
      },
      scale: {
        x: refCoord.scale?.x === undefined ? undefined : refCoord.scale.x * (transform.scale?.x ?? 1),
        y: refCoord.scale?.y === undefined ? undefined : refCoord.scale.y * (transform.scale?.y ?? 1),
      },
    };
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

  set coord(value: CoordinateTransform | undefined) {
    if (this._ref === undefined) {
      // HACK! do parent class behavior here
      (this as any)._coord = value;
      if ((this as any)._setCoord) {
        (this as any)._setCoord(value);
      }
      return;
    }
    // console.log('[ref] setting coord', this._name, JSON.stringify(value), this._ref);
    if (value === undefined) {
      this._ref.coord = undefined;
    } else {
      // transform back to ref coordinates
      const transform = this._transform;
      this._ref.coord = {
        translate: {
          x: (value.translate?.x ?? 0) - (transform.translate?.x ?? 0),
          y: (value.translate?.y ?? 0) - (transform.translate?.y ?? 0),
        },
        scale: {
          x: (value.scale?.x ?? 1) / (transform.scale?.x ?? 1),
          y: (value.scale?.y ?? 1) / (transform.scale?.y ?? 1),
        },
      };
    }
  }
}

export const Ref = forwardRef((props: RefProps, ref: any) => {
  const context = useBluefishContext();
  const symbolContext = useBluefishSymbolContext();

  const transformStackRef = useRef<CoordinateTransform[] | undefined>(undefined);
  const measurable = useRef<Measurable | null>(null);
  const id = useId();

  useImperativeHandle(
    ref,
    (): Measurable => ({
      guidePrimary: props.guidePrimary,
      // name: measurable.current?.name + '-ref' /* TODO: come up with a better name? this one will collide */,
      props: measurable.current?.props,
      domRef: measurable.current?.domRef!,
      constraints: measurable.current?.constraints,
      get transformStack() {
        return transformStackRef.current;
      },
      set transformStack(transforms: CoordinateTransform[] | undefined) {
        // console.log('[ref] setting transform stack', transforms);
        if (transforms !== undefined) {
          // notice that we don't use coords here b/c coords can only be set after measure is
          // returned at which point Ref behaves like the component it references
          transformStackRef.current = transforms;
        }
      },
      measure(constraints: Constraints): NewBBoxClass {
        // console.log('[ref] measure', constraints, props.to);
        try {
          measurable.current = resolveRef(props.to ?? props.select!, context.bfMap, symbolContext.bfSymbolMap);
          // TODO: we might not need the slice here
          // console.log(
          //   '[ref] transform stacks for',
          //   measurable.name,
          //   'this',
          //   transformStackRef.current,
          //   'ref',
          //   measurable.transformStack,
          // );
          const thisTransform = accumulateTransforms(transformStackRef.current?.slice(0, -1) ?? []);
          const otherTransform = accumulateTransforms(measurable.current.transformStack?.slice(0, -1) ?? []);

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

          // console.log(
          //   '[ref] other transform in this coordinate system',
          //   measurable.name,
          //   {
          //     left: measurable.measure(constraints).left,
          //     top: measurable.measure(constraints).top,
          //     right: measurable.measure(constraints).right,
          //     bottom: measurable.measure(constraints).bottom,
          //     width: measurable.measure(constraints).width,
          //     height: measurable.measure(constraints).height,
          //   },
          //   {
          //     otherStack: measurable.transformStack,
          //     otherStackWithoutLast: measurable.transformStack?.slice(0, -1),
          //     otherTransform,
          //   },
          //   {
          //     thisStack: transformStackRef.current,
          //     thisStackWithoutLast: transformStackRef.current?.slice(0, -1),
          //     thisTransform,
          //   },
          //   otherTransformInThisCoordinateSystem,
          // );

          return new RefBBox(
            measurable.current.measure(constraints, true),
            otherTransformInThisCoordinateSystem,
            undefined,
            // measurable.current.name,
          );
        } catch (e) {
          console.error('Error while measuring', props.to ?? props.select, e);
          throw e;
        }
      },
    }),
    [props.guidePrimary, props.to, props.select, context.bfMap, symbolContext.bfSymbolMap],
  );

  return <g id={id} className="ref" data-to={measurable.current?.id}></g>;
});
Ref.displayName = 'Ref';
