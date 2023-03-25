import _ from 'lodash';
import { withBluefish, useBluefishLayout, PropsWithBluefish } from '../bluefish';
import { measureText } from '../measureText';
import { NewBBox } from '../NewBBox';

// TODO: allow text within the text element instead of on contents arg

export type TextProps = PropsWithBluefish<
  React.SVGProps<SVGTextElement> & { contents: string } & Partial<{
      x: number;
      y: number;
    }>
>;

// TODO: use 'alphabetic' baseline in renderer? may need to figure out displacement again
// TODO: maybe use https://airbnb.io/visx/docs/text?
// TODO: maybe use alignmentBaseline="baseline" to measure the baseline as well?? need to add it as
// a guide
// TODO: very close to good alignment, but not quite there. Can I use more of the canvas
// measurements somehow?
export const textMeasurePolicy = (props: TextProps) => {
  const partialNoUndef = _.pickBy(props, (v) => v !== undefined);
  const { fontStyle, fontWeight, fontSize, fontFamily } = {
    fontStyle: 'normal',
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'normal',
    ...partialNoUndef,
  };
  const measurements = measureText(
    props.contents,
    `${fontStyle ?? ''} ${fontWeight ?? ''} ${fontSize ?? ''} ${fontFamily ?? ''}`,
  );
  return () => ({
    left: measurements.left,
    right: measurements.right,
    width: measurements.right - measurements.left,
    top: measurements.fontTop,
    height: measurements.fontHeight,
    bottom: measurements.fontDescent,
    coord: {
      translate: {
        x: props.x,
        y: props.y,
      },
    },
    // top: 0,
    /* width: measurements.width, */
    // height: measurements.fontHeight,
  });
};

export const Text = withBluefish((props: TextProps) => {
  const { name, ...rest } = props;
  const { id, domRef, bbox } = useBluefishLayout({}, props, textMeasurePolicy(props));

  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})
scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
    >
      <text
        {...rest}
        x={bbox?.left ?? 0}
        // TODO: need some way to pass fontDescent here
        // TODO: is height always defined?
        y={(bbox?.top ?? 0) + (bbox?.height !== undefined ? +bbox.height : 0) /* - measurements.fontDescent */}
      >
        {props.contents}
      </text>
    </g>
  );
});
