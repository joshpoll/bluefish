import { withBluefish, withBluefishFn, BBox } from '../bluefish';
import { NewBBox } from '../NewBBox';

export type CircleProps = React.SVGProps<SVGCircleElement>;

export const Circle = withBluefishFn(
  ({ cx, cy, r }: CircleProps) => {
    return () => {
      return {
        left: cx !== undefined ? +cx - +(r ?? 0) : undefined,
        top: cy !== undefined ? +cy - +(r ?? 0) : undefined,
        width: r !== undefined ? +r * 2 : undefined,
        height: r !== undefined ? +r * 2 : undefined,
      };
    };
  },
  (props: CircleProps & { $bbox?: Partial<NewBBox> }) => {
    const { $bbox, ...rest } = props;
    return (
      <circle
        {...rest}
        cx={($bbox?.left ?? 0) + ($bbox?.width ?? 0) / 2}
        cy={($bbox?.top ?? 0) + ($bbox?.height ?? 0) / 2}
        r={($bbox?.width ?? 0) / 2}
      />
    );
  },
);
