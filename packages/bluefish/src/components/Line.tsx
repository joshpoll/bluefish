import { withBluefish, BBox, useBluefishLayout, PropsWithBluefish } from '../bluefish';

export type LineProps = PropsWithBluefish<React.SVGProps<SVGLineElement> & Partial<BBox>>;

const lineMeasurePolicy = ({ x1, x2, y1, y2 }: LineProps) => {
  return () => ({
    left: Math.min(+x1!, +x2!),
    top: Math.min(+y1!, +y2!),
    width: Math.abs(+x2! - +x1!),
    height: Math.abs(+y2! - +y1!),
  });
};

export const Line = withBluefish((props: LineProps) => {
  const { bbox } = useBluefishLayout({}, props, lineMeasurePolicy(props));
  const { name, ...rest } = props;

  return (
    <line
      {...rest}
      x1={bbox.left ?? 0}
      x2={(bbox.left ?? 0) + (bbox.width ?? 0)}
      y1={bbox.top ?? 0}
      y2={(bbox.top ?? 0) + (bbox.height ?? 0)}
    />
  );
});
