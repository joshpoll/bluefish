import { withBluefish, useBluefishLayout, PropsWithBluefish } from '../../bluefish';
import { NewBBox } from '../../NewBBox';

type maxBondTypes = {
  [key: string]: number;
};

const maxBonds: maxBondTypes = {
  H: 1,
  C: 4,
  N: 3,
  O: 2,
  P: 3,
  S: 2,
  B: 3,
  F: 1,
  I: 1,
  Cl: 1,
  Br: 1,
};

type elementNameTypes = {
  [key: string]: string;
};

const elementName: elementNameTypes = {
  H: 'Hydrogen',
  C: 'Carbon',
  N: 'Nitrogen',
  O: 'Oxygen',
  P: 'Phosphorus',
  S: 'Sulfur',
  B: 'Boron',
  F: 'Flourine',
  I: 'Iodine',
  Cl: 'Chlorine',
  Br: 'Bromine',
};

export type AtomProps = PropsWithBluefish<
  React.SVGProps<SVGCircleElement> & {
    content: string;
    curId: string;
    isTerminal: boolean;
    bondCount: number;
  }
>;

export const Atom = withBluefish((props: AtomProps) => {
  const { name, content, curId, isTerminal, bondCount, ...rest } = props;
  const { id, domRef, bbox } = useBluefishLayout({}, props, () => {
    const { cx, cy, r } = props;
    return {
      left: cx !== undefined ? +cx - +(r ?? 0) : undefined,
      top: cy !== undefined ? +cy - +(r ?? 0) : undefined,
      width: r !== undefined ? +r * 2 : undefined,
      height: r !== undefined ? +r * 2 : undefined,
    };
  });

  const numHydrogens = maxBonds[content] - bondCount;
  const hydrogenString = 'H'.repeat(numHydrogens);
  const atomContent = content === 'C' ? '' : content + hydrogenString;

  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox.coord?.translate?.x ?? 0} ${bbox.coord?.translate?.y ?? 0})
scale(${bbox.coord?.scale?.x ?? 1} ${bbox.coord?.scale?.y ?? 1})`}
      aria-label={`${elementName[content]} atom with ID ${id}`}
      name={curId}
    >
      {content === 'C' ? (
        <circle
          {...rest}
          cx={(bbox.left ?? 0) + (bbox.width ?? 0) / 2}
          cy={(bbox.top ?? 0) + (bbox.height ?? 0) / 2}
          r={(1.5 * (bbox.width ?? 0)) / 2}
          fill={'none'}
        />
      ) : (
        <circle
          {...rest}
          cx={(bbox.left ?? 0) + (bbox.width ?? 0) / 2}
          cy={(bbox.top ?? 0) + (bbox.height ?? 0) / 2}
          r={(1.3 * (bbox.width ?? 0)) / 2}
          fill={'white'}
          opacity={1}
        />
      )}

      <text
        x={bbox.left ?? 0}
        y={(bbox.top ?? 0) + (bbox.height ?? 0) / 2}
        font-size={23}
        text-anchor={'center'}
        dominant-baseline={'central'}
      >
        {atomContent}
      </text>
    </g>
  );
});
Atom.displayName = 'Atom';
