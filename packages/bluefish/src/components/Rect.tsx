import { withBluefish, useBluefishLayout, PropsWithBluefish } from '../bluefish';

export type RectProps = PropsWithBluefish<React.SVGProps<SVGRectElement>>;

export const Rect = withBluefish((props: RectProps) => {
  const { domRef, bbox } = useBluefishLayout({}, props, () => {
    const { x, y, width, height } = props;
    return {
      left: x !== undefined ? +x : undefined,
      top: y !== undefined ? +y : undefined,
      width: width !== undefined ? +width : undefined,
      height: height !== undefined ? +height : undefined,
    };
  });

  const { name, ...rest } = props;

  return (
    // translate and scale based on $bbox.coord
    <g
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})
scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
    >
      <rect {...rest} x={bbox?.left ?? 0} y={bbox?.top ?? 0} width={bbox?.width ?? 0} height={bbox?.height ?? 0} />
    </g>
  );
});
Rect.displayName = 'Rect';
