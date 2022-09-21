import { withBluefish, withBluefishFn, BBox } from '../bluefish';
import { NewBBox } from '../NewBBox';

export type RectProps = React.SVGProps<SVGRectElement>;

export const Rect = withBluefishFn(
  ({ x, y, width, height }: RectProps) => {
    return () => ({
      x: x !== undefined ? +x : undefined,
      y: y !== undefined ? +y : undefined,
      width: width !== undefined ? +width : undefined,
      height: height !== undefined ? +height : undefined,
    });
  },
  (props: RectProps & { bbox?: Partial<NewBBox> }) => (
    <rect
      {...props}
      x={props.bbox?.left ?? 0}
      y={props.bbox?.top ?? 0}
      width={props.bbox?.width ?? 0}
      height={props.height ?? 0}
    />
  ),
);
