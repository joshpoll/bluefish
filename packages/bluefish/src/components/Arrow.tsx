import { withBluefish, withBluefishFn, BBox } from '../bluefish';

export type ArrowProps = {
  from: React.MutableRefObject<any> | undefined;
  to: React.MutableRefObject<any> | undefined;
};

export const Arrow = withBluefishFn(
  ({ from, to }) => {
    return () => {
      const fromBox = from?.current.measure();
      const toBox = to?.current.measure();
      return { width: 0, height: 0 };
    };
  },
  (props: ArrowProps & Partial<BBox>) => (
    <line
      x1={props.x ?? 0}
      x2={(props.x ?? 0) + (props.width ?? 0)}
      y1={props.y ?? 0}
      y2={(props.y ?? 0) + (props.height ?? 0)}
    />
  ),
);
