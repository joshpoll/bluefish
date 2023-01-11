import { Measure, withBluefish, useBluefishLayout, PropsWithBluefish } from '../../../../bluefish';
import { NewBBox } from '../../../../NewBBox';
import { Scale } from '../Plot';

export type RectScaleProps = PropsWithBluefish<
  React.SVGProps<SVGRectElement> & {
    xScale?: Scale;
    yScale?: Scale;
  }
>;

const rectMeasurePolicy = ({ x, y, width, height, xScale, yScale }: RectScaleProps): Measure => {
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
};
export const RectScale = withBluefish((props: RectScaleProps) => {
  const { name, ...rest } = props;

  const { domRef, bbox } = useBluefishLayout({}, props, rectMeasurePolicy(props));

  return (
    <rect
      ref={domRef}
      {...rest}
      x={bbox?.left ?? 0}
      y={bbox?.top ?? 0}
      width={bbox?.width ?? 0}
      height={bbox?.height ?? 0}
    />
  );
});
