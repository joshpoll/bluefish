import { withGXM, withGXMFn, BBox } from '../bluefish';

export type RectProps = React.SVGProps<SVGRectElement> & Partial<BBox>;

export const Rect = withGXMFn(
  ({ width, height }) => {
    return () => ({ width: width!, height: height! });
  },
  (props: RectProps) => (
    <rect {...props} x={props.x ?? 0} y={props.y ?? 0} width={props.width ?? 0} height={props.height ?? 0} />
  ),
);
