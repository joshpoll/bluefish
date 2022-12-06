import { forwardRef } from 'react';
import { withBluefish, withBluefishFn, BBox } from '../bluefish';
import { NewBBox } from '../NewBBox';

export type RectProps = React.SVGProps<SVGRectElement>;

export const Rect = withBluefishFn(
  ({ x, y, width, height }: RectProps) => {
    return () => {
      return {
        left: x !== undefined ? +x : undefined,
        top: y !== undefined ? +y : undefined,
        width: width !== undefined ? +width : undefined,
        height: height !== undefined ? +height : undefined,
      };
    };
  },
  forwardRef((props: RectProps & { $bbox?: Partial<NewBBox> }, ref: any) => {
    const { $bbox, ...rest } = props;
    return (
      // translate and scale based on $bbox.coord
      <g
        ref={ref}
        transform={`translate(${$bbox?.coord?.translate?.x ?? 0} ${$bbox?.coord?.translate?.y ?? 0})
scale(${$bbox?.coord?.scale?.x ?? 1} ${$bbox?.coord?.scale?.y ?? 1})`}
      >
        <rect
          {...rest}
          x={$bbox?.left ?? 0}
          y={$bbox?.top ?? 0}
          width={$bbox?.width ?? 0}
          height={$bbox?.height ?? 0}
        />
      </g>
    );
  }),
);
Rect.displayName = 'Rect';
