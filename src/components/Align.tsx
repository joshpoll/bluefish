import { Measure, Constraints, Placeable, LayoutFn, NewPlaceable } from '../bluefish';

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
    const [first, second] = measurables.map((measurable) => measurable.measure(constraints)) as NewPlaceable[];

    if (first.left === undefined) first.left = 0;
    if (first.top === undefined) first.top = 0;

    let firstAnchor;
    let secondAnchor;
    if ('topLeft' in options) {
      firstAnchor = { x: 0, y: 0 };
      secondAnchor = { x: 0, y: 0 };
    } else if ('topRight' in options) {
      firstAnchor = { x: first.width!, y: 0 };
      secondAnchor = { x: second.width!, y: 0 };
    } else if ('bottomLeft' in options) {
      firstAnchor = { x: 0, y: first.height! };
      secondAnchor = { x: 0, y: second.height! };
    } else if ('bottomRight' in options) {
      firstAnchor = { x: first.width!, y: first.height! };
      secondAnchor = { x: second.width!, y: second.height! };
    } else if ('top' in options) {
      firstAnchor = { x: first.width! / 2, y: 0 };
      secondAnchor = { x: second.width! / 2, y: 0 };
    } else if ('bottom' in options) {
      firstAnchor = { x: first.width! / 2, y: first.height! };
      secondAnchor = { x: second.width! / 2, y: second.height! };
    } else if ('left' in options) {
      firstAnchor = { x: 0, y: first.height! / 2 };
      secondAnchor = { x: 0, y: second.height! / 2 };
    } else if ('right' in options) {
      firstAnchor = { x: first.width!, y: first.height! / 2 };
      secondAnchor = { x: second.width!, y: second.height! / 2 };
    } else if ('center' in options) {
      firstAnchor = { x: first.width! / 2, y: first.height! / 2 };
      secondAnchor = { x: second.width! / 2, y: second.height! / 2 };
    } else {
      throw new Error('Invalid alignment options');
    }

    if (options.to) {
      if (options.to === 'topLeft') {
        secondAnchor = { x: 0, y: 0 };
      } else if (options.to === 'topRight') {
        secondAnchor = { x: second.width!, y: 0 };
      } else if (options.to === 'bottomLeft') {
        secondAnchor = { x: 0, y: second.height! };
      } else if (options.to === 'bottomRight') {
        secondAnchor = { x: second.width!, y: second.height! };
      } else if (options.to === 'top') {
        secondAnchor = { x: second.width! / 2, y: 0 };
      } else if (options.to === 'bottom') {
        secondAnchor = { x: second.width! / 2, y: second.height! };
      } else if (options.to === 'left') {
        secondAnchor = { x: 0, y: second.height! / 2 };
      } else if (options.to === 'right') {
        secondAnchor = { x: second.width!, y: second.height! / 2 };
      } else if (options.to === 'center') {
        secondAnchor = { x: second.width! / 2, y: second.height! / 2 };
      } else {
        throw new Error('Invalid alignment options');
      }
    }

    second.left = firstAnchor.x - secondAnchor.x + (options.x ?? 0);
    second.top = firstAnchor.y - secondAnchor.y + (options.y ?? 0);

    console.log('aligning', options, first, second);
    // second.place({ x: 50, y: 50 });

    // use anchors to determine the size of the container
    const width = Math.max(first.width!, firstAnchor.x - secondAnchor.x + second.width!);
    const height = Math.max(first.height!, firstAnchor.y - secondAnchor.y + second.height!);

    return { width, height };
  };

export const Align = LayoutFn((props: AlignProps) => alignMeasurePolicy(props));
