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
) & { to?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'top' | 'bottom' | 'left' | 'right' | 'center' } & {
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

    let firstAnchor;
    let secondAnchor;
    if ('topLeft' in options) {
      firstAnchor = { x: 0, y: 0 };
      secondAnchor = { x: 0, y: 0 };
    } else if ('topRight' in options) {
      firstAnchor = { x: first.measuredWidth, y: 0 };
      secondAnchor = { x: second.measuredWidth, y: 0 };
    } else if ('bottomLeft' in options) {
      firstAnchor = { x: 0, y: first.measuredHeight };
      secondAnchor = { x: 0, y: second.measuredHeight };
    } else if ('bottomRight' in options) {
      firstAnchor = { x: first.measuredWidth, y: first.measuredHeight };
      secondAnchor = { x: second.measuredWidth, y: second.measuredHeight };
    } else if ('top' in options) {
      firstAnchor = { x: first.measuredWidth / 2, y: 0 };
      secondAnchor = { x: second.measuredWidth / 2, y: 0 };
    } else if ('bottom' in options) {
      firstAnchor = { x: first.measuredWidth / 2, y: first.measuredHeight };
      secondAnchor = { x: second.measuredWidth / 2, y: second.measuredHeight };
    } else if ('left' in options) {
      firstAnchor = { x: 0, y: first.measuredHeight / 2 };
      secondAnchor = { x: 0, y: second.measuredHeight / 2 };
    } else if ('right' in options) {
      firstAnchor = { x: first.measuredWidth, y: first.measuredHeight / 2 };
      secondAnchor = { x: second.measuredWidth, y: second.measuredHeight / 2 };
    } else if ('center' in options) {
      firstAnchor = { x: first.measuredWidth / 2, y: first.measuredHeight / 2 };
      secondAnchor = { x: second.measuredWidth / 2, y: second.measuredHeight / 2 };
    } else {
      throw new Error('Invalid alignment options');
    }

    if (options.to) {
      if (options.to === 'topLeft') {
        secondAnchor = { x: 0, y: 0 };
      } else if (options.to === 'topRight') {
        secondAnchor = { x: second.measuredWidth, y: 0 };
      } else if (options.to === 'bottomLeft') {
        secondAnchor = { x: 0, y: second.measuredHeight };
      } else if (options.to === 'bottomRight') {
        secondAnchor = { x: second.measuredWidth, y: second.measuredHeight };
      } else if (options.to === 'top') {
        secondAnchor = { x: second.measuredWidth / 2, y: 0 };
      } else if (options.to === 'bottom') {
        secondAnchor = { x: second.measuredWidth / 2, y: second.measuredHeight };
      } else if (options.to === 'left') {
        secondAnchor = { x: 0, y: second.measuredHeight / 2 };
      } else if (options.to === 'right') {
        secondAnchor = { x: second.measuredWidth, y: second.measuredHeight / 2 };
      } else if (options.to === 'center') {
        secondAnchor = { x: second.measuredWidth / 2, y: second.measuredHeight / 2 };
      } else {
        throw new Error('Invalid alignment options');
      }
    }

    second.place({
      x: firstAnchor.x - secondAnchor.x,
      y: firstAnchor.y - secondAnchor.y,
    });

    console.log('aligning', first, second);
    // second.place({ x: 50, y: 50 });

    const width = Math.max(first.measuredWidth, second.measuredWidth);
    const height = Math.max(first.measuredHeight, second.measuredHeight);

    return { width, height };
  };

export const Align = LayoutFn((props: AlignProps) => alignMeasurePolicy(props));
