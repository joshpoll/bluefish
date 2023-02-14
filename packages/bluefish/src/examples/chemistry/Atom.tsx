import { withBluefish, useBluefishLayout, PropsWithBluefish } from '../../bluefish';
import { NewBBox } from '../../NewBBox';

export type AtomProps = PropsWithBluefish<
  React.SVGProps<SVGCircleElement> & {
    content: string;
    curId: string;
  }
>;

export const Atom = withBluefish((props: AtomProps) => {
  const { name, content, curId, ...rest } = props;
  const { id, domRef, bbox } = useBluefishLayout({}, props, () => {
    const { cx, cy, r } = props;
    return {
      left: cx !== undefined ? +cx - +(r ?? 0) : undefined,
      top: cy !== undefined ? +cy - +(r ?? 0) : undefined,
      width: r !== undefined ? +r * 2 : undefined,
      height: r !== undefined ? +r * 2 : undefined,
    };
  });

  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox.coord?.translate?.x ?? 0} ${bbox.coord?.translate?.y ?? 0})
scale(${bbox.coord?.scale?.x ?? 1} ${bbox.coord?.scale?.y ?? 1})`}
      aria-label={content}
    >
      {content === 'C' ? (
        <circle
          {...rest}
          cx={(bbox.left ?? 0) + (bbox.width ?? 0) / 2}
          cy={(bbox.top ?? 0) + (bbox.height ?? 0) / 2}
          r={(bbox.width ?? 0) / 2}
          fill={'none'}
        />
      ) : (
        <text x={(bbox.left ?? 0) + (bbox.width ?? 0) / 2} y={(bbox.top ?? 0) + (bbox.height ?? 0) / 2}>
          {content}
        </text>
      )}
      {/* <circle
        {...rest}
        cx={(bbox.left ?? 0) + (bbox.width ?? 0) / 2}
        cy={(bbox.top ?? 0) + (bbox.height ?? 0) / 2}
        r={(bbox.width ?? 0) / 2}
        aria-label={content}
      /> */}
      {/* <text x={(bbox.left ?? 0) + (bbox.width ?? 0) / 2} y={(bbox.top ?? 0) + (bbox.height ?? 0) / 2}>
        {curId}
      </text> */}
    </g>
  );
});
Atom.displayName = 'Atom';
