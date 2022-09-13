import { withBluefishLayout, Constraints, BBox } from '../bluefishClass';

export type RectProps = React.SVGProps<SVGRectElement> & Partial<BBox>;

export const RectClass = withBluefishLayout((props: RectProps) => {
  return (measurables, constraints: Constraints) => {
    const { width, height } = props;
    return { width: width!, height: height! };
  };
})((props) => {
  return <rect {...props} x={props.x ?? 0} y={props.y ?? 0} width={props.width ?? 0} height={props.height ?? 0} />;
});
