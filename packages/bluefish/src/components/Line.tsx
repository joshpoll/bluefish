import { withBluefish, BBox, useBluefishLayout2 } from '../bluefish';

export type LineProps = React.SVGProps<SVGLineElement> & Partial<BBox>;

const lineMeasurePolicy = ({ x1, x2, y1, y2 }: LineProps) => {
  return () => ({ width: Math.abs(+x2! - +x1!), height: Math.abs(+y2! - +y1!) });
};

export const Line = withBluefish((props: LineProps) => {
  const { bbox } = useBluefishLayout2({}, props, lineMeasurePolicy(props));

  return (
    <line
      {...props}
      x1={bbox.left ?? 0}
      x2={(bbox.left ?? 0) + (bbox.width ?? 0)}
      y1={bbox.top ?? 0}
      y2={(bbox.top ?? 0) + (bbox.height ?? 0)}
    />
  );
});
