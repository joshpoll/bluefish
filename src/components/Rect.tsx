import { withBluefish, withBluefishFn, BBox } from '../bluefish';
import { NewBBox } from '../NewBBox';

export type RectProps = React.SVGProps<SVGRectElement>;

export const Rect = withBluefishFn(
  ({ x, y, width, height }: RectProps) => {
    return () => {
      console.log('measuring rect', x, y, width, height);
      return {
        x: x !== undefined ? +x : undefined,
        y: y !== undefined ? +y : undefined,
        width: width !== undefined ? +width : undefined,
        height: height !== undefined ? +height : undefined,
      };
    };
  },
  (props: RectProps & { $bbox?: Partial<NewBBox> }) => {
    console.log('rect props', props, props.$bbox);
    const { $bbox, ...rest } = props;
    return (
      <rect {...rest} x={$bbox?.left ?? 0} y={$bbox?.top ?? 0} width={$bbox?.width ?? 0} height={$bbox?.height ?? 0} />
    );
  },
);
