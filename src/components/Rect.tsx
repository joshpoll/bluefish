import { withGXM, withGXMFn } from '../gxm';

export type RectProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill: string;
};

export const Rect = withGXMFn(
  ({ width, height }) => {
    return () => ({ width: width!, height: height! });
  },
  (props: RectProps) => (
    <rect x={props.x ?? 0} y={props.y ?? 0} width={props.width ?? 0} height={props.height ?? 0} fill={props.fill} />
  ),
);
