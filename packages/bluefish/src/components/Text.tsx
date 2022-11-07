import _ from 'lodash';
import { withBluefishFn } from '../bluefish';
import { measureText } from '../measureText';
import { NewBBox } from '../NewBBox';

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
export const Text = withBluefishFn(
  (props: TextProps) => {
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
    return () => ({ left: 0, top: 0, width: measurements.width, height: measurements.fontHeight });
  },
  (props: TextProps & { $bbox?: Partial<NewBBox> }) => {
    const { $bbox, ...rest } = props;
    return (
      <g
        // ref={ref}
        transform={`translate(${$bbox?.coord?.translate?.x ?? 0} ${$bbox?.coord?.translate?.y ?? 0})
scale(${$bbox?.coord?.scale?.x ?? 1} ${$bbox?.coord?.scale?.y ?? 1})`}
      >
        <text
          {...rest}
          x={$bbox?.left ?? 0}
          // TODO: need some way to pass fontDescent here
          // TODO: is height always defined?
          y={($bbox?.top ?? 0) + ($bbox?.height !== undefined ? +$bbox.height : 0) /* - measurements.fontDescent */}
        >
          {props.contents}
        </text>
      </g>
    );
  },
);
