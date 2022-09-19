import _ from 'lodash';
import { measureText } from '../measureText';
import { withBluefishLayout } from '../bluefishClass';

// TODO: allow text within the text element instead of on contents arg

export type TextProps = React.SVGProps<SVGTextElement> & { contents: string } & Partial<{
    x: number;
    y: number;
  }>;

// TODO: use 'alphabetic' baseline in renderer? may need to figure out displacement again
// TODO: maybe use https://airbnb.io/visx/docs/text?
// TODO: maybe use alignmentBaseline="baseline" to measure the baseline as well?? need to add it as
// a guide
// TODO: very close to good alignment, but not quite there. Can I use more of the canvas
// measurements somehow?
export const TextClass = withBluefishLayout((props: TextProps) => {
  const partialNoUndef = _.pickBy(props, (v) => v !== undefined);
  const { fontStyle, fontWeight, fontSize, fontFamily } = {
    fontFamily: 'sans-serif',
    fontSize: '12px',
    fontWeight: 'normal',
    ...partialNoUndef,
  };
  const measurements = measureText(
    props.contents,
    `${fontStyle ?? ''} ${fontWeight ?? ''} ${fontSize ?? ''} ${fontFamily ?? ''}`,
  );
  return () => ({ width: measurements.width, height: measurements.fontHeight });
})((props: TextProps) => (
  <text
    {...props}
    x={props.x ?? 0}
    // TODO: need some way to pass fontDescent here
    // TODO: is height always defined?
    y={(props.y ?? 0) + (props.height !== undefined ? +props.height : 0) /* - measurements.fontDescent */}
  >
    {props.contents}
  </text>
));
