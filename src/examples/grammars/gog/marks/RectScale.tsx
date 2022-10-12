import { withBluefishFn } from '../../../../bluefish';
import { NewBBox } from '../../../../NewBBox';
import { Scale } from '../Plot';

export type RectScaleProps = React.SVGProps<SVGRectElement> & {
  xScale?: Scale;
  yScale?: Scale;
};

export const RectScale = withBluefishFn(
  ({ x, y, width, height, xScale, yScale }: RectScaleProps) => {
    return (_measurables, { width, height }) => {
      // TODO: use scales
      // const xScaleFn = xScale({ width, height }) ?? ((x) => x);
      return {
        left: x !== undefined ? +x : undefined,
        top: y !== undefined ? +y : undefined,
        width: width !== undefined ? +width : undefined,
        height: height !== undefined ? +height : undefined,
      };
    };
  },
  (props: RectScaleProps & { $bbox?: Partial<NewBBox> }) => {
    console.log('rect props', props, props.$bbox);
    const { $bbox, ...rest } = props;
    return (
      <rect {...rest} x={$bbox?.left ?? 0} y={$bbox?.top ?? 0} width={$bbox?.width ?? 0} height={$bbox?.height ?? 0} />
    );
  },
);
