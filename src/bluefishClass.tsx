import _ from 'lodash';
import React, {
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  isValidElement,
  ComponentType,
  forwardRef,
  PropsWithChildren,
  useLayoutEffect,
  ReactElement,
  useEffect,
} from 'react';

// type MeasurePolicy = { measurePolicy: Measure };

// export abstract class BluefishComponent<P extends MeasurePolicy> extends React.Component<
//   P,
//   BBox & { measurePolicy: (measurables: Array<Measurable>, constraints: Constraints) => MeasureResult }
// > {
//   constructor(props: P) {
//     super(props);
//     this.setState({ measurePolicy: props.measurePolicy });
//   }

//   measure(measurables: Array<Measurable>, constraints: Constraints): Placeable {
//     const { width, height } = this.state.measurePolicy(measurables, constraints);
//     this.setState({ width, height });
//     return {
//       measuredWidth: width,
//       measuredHeight: height,
//       place: this.place,
//       placeUnlessDefined: this.placeUnlessDefined,
//     };
//   }

//   public place({ x, y }: { x?: number; y?: number }) {
//     if (x !== undefined) this.setState({ x });
//     if (y !== undefined) this.setState({ y });
//   }

//   public placeUnlessDefined({ x, y }: { x?: number; y?: number }) {
//     if (x !== undefined && this.state.x === undefined) this.setState({ x });
//     if (y !== undefined && this.state.y === undefined) this.setState({ y });
//   }
// }

export type Measurable = any;
export type MeasureResult = {
  width: number;
  height: number;
};

export type Measure = (measurables: Array<Measurable>, constraints: Constraints) => MeasureResult;

export type BBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type BBoxWithChildren = Partial<PropsWithChildren<BBox>>;

// export type Constraints = {
//   minWidth: number;
//   maxWidth: number;
//   minHeight: number;
//   maxHeight: number;
// };
export type Constraints = any;

export type Placeable = {
  readonly place: (point: { x?: number; y?: number }) => void;
  readonly placeUnlessDefined: (point: { x?: number; y?: number }) => void;
  readonly measuredWidth: number;
  readonly measuredHeight: number;
};

// This function takes a component...
export const withBluefishLayout =
  <Props,>(measurePolicy: (props: Props) => Measure) =>
  (WrappedComponent: ComponentType<PropsWithChildren<Props>>) => {
    // ...and returns another component...
    return class extends React.Component<PropsWithChildren<Props>, Partial<BBox>> {
      private childrenRef: Array<Measurable>;

      constructor(props: PropsWithChildren<Props>) {
        super(props);
        this.childrenRef = [];
        this.state = {
          x: undefined,
          y: undefined,
          width: undefined,
          height: undefined,
        };
      }

      public measure(constraints: Constraints): Placeable {
        const { width, height } = measurePolicy(this.props)(this.childrenRef, constraints);
        this.setState({ width, height });
        return {
          measuredWidth: width,
          measuredHeight: height,
          place: this.place.bind(this),
          placeUnlessDefined: this.placeUnlessDefined.bind(this),
        };
      }

      private place({ x, y }: { x?: number; y?: number }) {
        console.log('place', x, y, this);
        if (x !== undefined) this.setState({ x });
        if (y !== undefined) this.setState({ y });
      }

      private placeUnlessDefined({ x, y }: { x?: number; y?: number }) {
        console.log('placeUnlessDefined', x, y, this);
        if (x !== undefined && this.state.x === undefined) this.setState({ x });
        if (y !== undefined && this.state.y === undefined) this.setState({ y });
      }

      render() {
        // ... and renders the wrapped component with the fresh data!
        // Notice that we pass through any additional props
        return (
          <WrappedComponent
            {...this.props}
            x={this.state.x}
            y={this.state.y}
            width={this.state.width}
            height={this.state.height}
          >
            {React.Children.map(this.props.children, (child, index) => {
              if (isValidElement(child)) {
                return React.cloneElement(child as React.ReactElement<any>, {
                  ref: (ref: any) => (this.childrenRef[index] = ref),
                });
              } else {
                // TODO: what to do with non-elements?
                console.log('warning: non-element child', child);
                return child;
              }
            })}
          </WrappedComponent>
        );
      }
    };
  };
