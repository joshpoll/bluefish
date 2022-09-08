// Can we do android view style layout in React?

import React from 'react';
import { forwardRef, useRef, useImperativeHandle } from 'react';
import { Constraints, Measure } from './grafik';

// We need to wrap component in `forwardRef` in order to gain
// access to the ref object that is assigned using the `ref` prop.
// This ref is passed as the second parameter to the function component.
const Child = forwardRef((props, ref) => {
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    getAlert() {
      alert('getAlert from Child');
    },
  }));

  return <h1>Hi</h1>;
});

export const useMeasure = (measure: Measure, childrenRef: any = []) => {
  measure(
    // pass child measure function
    childrenRef.current.map((child: any) => child.measure),
    {},
  );
};

export const Parent = ({ children }: { children: any }) => {
  // In order to gain access to the child component instance,
  // you need to assign it to a `ref`, so we call `useRef()` to get one
  const childRef = useRef<typeof Child>();
  const childrenRef = useRef<any>([]);

  useMeasure((measurables, constraints) => ({ width: 0, height: 0 }), childrenRef);

  return (
    <div>
      <Child ref={childRef} />
      <button onClick={() => (childRef.current! as any).getAlert()}>Click</button>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          ref: (ref: any) => (childrenRef.current[index] = ref),
        }),
      )}
    </div>
  );
};

export const Layout = forwardRef(({ measure, children }: { measure: Measure; children: any }, ref) => {
  const childrenRef = useRef<any>([]);

  useMeasure(measure, childrenRef);

  useImperativeHandle(ref, () => ({
    measure(constraints: Constraints) {
      return measure(
        childrenRef.current.map((child: any) => child.measure),
        constraints,
      );
    },
  }));

  return (
    <>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          ref: (ref: any) => (childrenRef.current[index] = ref),
        }),
      )}
    </>
  );
});
