import React, { useId } from 'react';
import { forwardRef, useImperativeHandle, useEffect } from 'react';
import { BluefishContext, useBluefishContext } from '../bluefish';

export const Parent = (props: any) => {
  return (
    <BluefishContext.Provider
      value={{
        bfMap: new Map(),
        setBFMap: () => {},
      }}
    >
      <div>
        <Child />
        <Child />
      </div>
    </BluefishContext.Provider>
  );
};

// we use forwardRef to actually return ~the dom ref~ the imperative ref to the parent
// without forwardRef, the ref is undefined
export const Child = (props: any) => {
  const id = useId();
  const context = useBluefishContext();
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('context', context);
    context.setBFMap((prev) => new Map(prev).set(id, ref));
  }, [context, ref, id]);

  return <div ref={ref}>test child</div>;
};
