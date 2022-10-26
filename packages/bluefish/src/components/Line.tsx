import { withBluefish, withBluefishFn, BBox } from '../bluefish';

export type LineProps = React.SVGProps<SVGLineElement> & Partial<BBox>;

export const Line = withBluefishFn(
  ({ x1, x2, y1, y2 }) => {
    return () => ({ width: Math.abs(+x2! - +x1!), height: Math.abs(+y2! - +y1!) });
  },
  (props: LineProps) => (
    <line
      {...props}
      x1={props.x ?? 0}
      x2={(props.x ?? 0) + (props.width ?? 0)}
      y1={props.y ?? 0}
      y2={(props.y ?? 0) + (props.height ?? 0)}
    />
  ),
);
