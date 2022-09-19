import { Measure, Constraints, Placeable, LayoutFn } from '../bluefish';

export type AlignProps = (
  | { topLeft: boolean }
  | { topRight: boolean }
  | { bottomLeft: boolean }
  | { bottomRight: boolean }
  | { top: boolean }
  | { bottom: boolean }
  | { left: boolean }
  | { right: boolean }
  | { center: boolean }
) & {
  x?: number;
  y?: number;
};

const alignMeasurePolicy =
  (options: AlignProps): Measure =>
  (measurables, constraints: Constraints) => {
    console.log('entering alignment node');
    const [first, second] = measurables.map((measurable) => measurable.measure(constraints)) as Placeable[];

    first.placeUnlessDefined({ x: 0, y: 0 });
    // TODO: need to use first's position here...

    if ('topLeft' in options) {
      second.place({ x: 0, y: 0 });
    } else if ('topRight' in options) {
      second.place({ x: first.measuredWidth - second.measuredWidth, y: 0 });
    } else if ('bottomLeft' in options) {
      second.place({ x: 0, y: first.measuredHeight - second.measuredHeight });
    } else if ('bottomRight' in options) {
      second.place({
        x: first.measuredWidth - second.measuredWidth,
        y: first.measuredHeight - second.measuredHeight,
      });
    } else if ('top' in options) {
      second.place({ x: (first.measuredWidth - second.measuredWidth) / 2, y: 0 });
    } else if ('bottom' in options) {
      second.place({
        x: (first.measuredWidth - second.measuredWidth) / 2,
        y: first.measuredHeight - second.measuredHeight,
      });
    } else if ('left' in options) {
      second.place({ x: 0, y: (first.measuredHeight - second.measuredHeight) / 2 });
    } else if ('right' in options) {
      second.place({
        x: first.measuredWidth - second.measuredWidth,
        y: (first.measuredHeight - second.measuredHeight) / 2,
      });
    } else if ('center' in options) {
      second.place({
        x: (first.measuredWidth - second.measuredWidth) / 2,
        y: (first.measuredHeight - second.measuredHeight) / 2,
      });
    }

    console.log('aligning', first, second);
    // second.place({ x: 50, y: 50 });

    const width = Math.max(first.measuredWidth, second.measuredWidth);
    const height = Math.max(first.measuredHeight, second.measuredHeight);

    return { width, height };
  };

export const Align = LayoutFn((props: AlignProps) => alignMeasurePolicy(props));
