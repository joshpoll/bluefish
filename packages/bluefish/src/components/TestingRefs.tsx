import React from 'react';
import { forwardRef, useImperativeHandle } from 'react';

const recordRefs = (children: React.ReactNode, childrenRef: React.MutableRefObject<any[]>) =>
  React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        // TODO: actually the innerRef we're receiving here is going to be the object with the
        // measure method on it. So we need to wrap it in another object that has the measure
        // method and also the ref. (Or maybe we can just use the ref directly?)
        // TODO: idk why this code is even necessary. See this
        // https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children
        // which is where this code came from. apparently I needed to pass children their refs automatically
        ref: (node: any) => {
          childrenRef.current[index] = node;
          // if (typeof ref === 'function') {
          //   return ref(innerRef);
          // } else {
          //   return ref;
          // }
          const { ref } = child as any;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        },
      });
    } else {
      // TODO: what to do with non-elements?
      console.log('warning: non-element child', child);
      return child;
    }
  });

export const Parent = (props: any) => {
  const childrenRef = React.useRef<any[]>([]);
  // const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  React.useEffect(() => {
    const element = childrenRef.current[0];
    console.log('element', element);
    if (element) {
      setWidth(element.clientWidth);
      setHeight(element.clientHeight);
    }
  }, [childrenRef]);

  return (
    <div>
      {recordRefs(props.children, childrenRef)}
      {/* {props.children} */}
      <div>
        <div>width: {width}</div>
        <div>height: {height}</div>
      </div>
    </div>
  );
};

// we use forwardRef to actually return ~the dom ref~ the imperative ref to the parent
// without forwardRef, the ref is undefined
export const Child = forwardRef((_props, ref) => {
  useImperativeHandle(ref, () => ({
    clientWidth: 100,
    clientHeight: 100,
  }));

  return <div>test child</div>;
});
