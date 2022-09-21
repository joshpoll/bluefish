import { Measure, Constraints, Placeable, LayoutFn, NewPlaceable } from '../bluefish';

export type Alignment2D =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'centerLeft'
  | 'center'
  | 'centerRight'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

// generate a union of single-key objects using Alignment2D as the keys
export type Alignment2DObjs = { [K in Alignment2D]: { [k in K]: boolean } }[Alignment2D];

export type Alignment1D = 'top' | 'centerVertically' | 'bottom' | 'left' | 'centerHorizontally' | 'right';

export type Alignment1DObjs = { [K in Alignment1D]: { [k in K]: boolean } }[Alignment1D];

export type AlignProps = (Alignment2DObjs | Alignment1DObjs) & { to?: Alignment2D | Alignment1D } & {
  x?: number;
  y?: number;
};

const alignMeasurePolicy =
  (options: AlignProps): Measure =>
  (measurables, constraints: Constraints) => {
    console.log('entering alignment node');
    const [mov, fix] = measurables.map((measurable) => measurable.measure(constraints)) as NewPlaceable[];

    console.log('aligning: before', options, mov, fix);

    let verticalAlignment: 'top' | 'center' | 'bottom' | undefined;
    let horizontalAlignment: 'left' | 'center' | 'right' | undefined;
    if ('topLeft' in options) {
      verticalAlignment = 'top';
      horizontalAlignment = 'left';
    } else if ('topCenter' in options) {
      verticalAlignment = 'top';
      horizontalAlignment = 'center';
    } else if ('topRight' in options) {
      verticalAlignment = 'top';
      horizontalAlignment = 'right';
    } else if ('centerLeft' in options) {
      verticalAlignment = 'center';
      horizontalAlignment = 'left';
    } else if ('center' in options) {
      verticalAlignment = 'center';
      horizontalAlignment = 'center';
    } else if ('centerRight' in options) {
      verticalAlignment = 'center';
      horizontalAlignment = 'right';
    } else if ('bottomLeft' in options) {
      verticalAlignment = 'bottom';
      horizontalAlignment = 'left';
    } else if ('bottomCenter' in options) {
      verticalAlignment = 'bottom';
      horizontalAlignment = 'center';
    } else if ('bottomRight' in options) {
      verticalAlignment = 'bottom';
      horizontalAlignment = 'right';
    } else if ('top' in options) {
      verticalAlignment = 'top';
    } else if ('centerVertically' in options) {
      verticalAlignment = 'center';
    } else if ('bottom' in options) {
      verticalAlignment = 'bottom';
    } else if ('left' in options) {
      horizontalAlignment = 'left';
    } else if ('centerHorizontally' in options) {
      horizontalAlignment = 'center';
    } else if ('right' in options) {
      horizontalAlignment = 'right';
    } else {
      throw new Error('invalid alignment options');
    }

    let toVerticalAlignment: 'top' | 'center' | 'bottom' | undefined;
    let toHorizontalAlignment: 'left' | 'center' | 'right' | undefined;
    if ('to' in options) {
      if (options.to === 'topLeft') {
        toVerticalAlignment = 'top';
        toHorizontalAlignment = 'left';
      } else if (options.to === 'topCenter') {
        toVerticalAlignment = 'top';
        toHorizontalAlignment = 'center';
      } else if (options.to === 'topRight') {
        toVerticalAlignment = 'top';
        toHorizontalAlignment = 'right';
      } else if (options.to === 'centerLeft') {
        toVerticalAlignment = 'center';
        toHorizontalAlignment = 'left';
      } else if (options.to === 'center') {
        toVerticalAlignment = 'center';
        toHorizontalAlignment = 'center';
      } else if (options.to === 'centerRight') {
        toVerticalAlignment = 'center';
        toHorizontalAlignment = 'right';
      } else if (options.to === 'bottomLeft') {
        toVerticalAlignment = 'bottom';
        toHorizontalAlignment = 'left';
      } else if (options.to === 'bottomCenter') {
        toVerticalAlignment = 'bottom';
        toHorizontalAlignment = 'center';
      } else if (options.to === 'bottomRight') {
        toVerticalAlignment = 'bottom';
        toHorizontalAlignment = 'right';
      } else if (options.to === 'top') {
        toVerticalAlignment = 'top';
      } else if (options.to === 'centerVertically') {
        toVerticalAlignment = 'center';
      } else if (options.to === 'bottom') {
        toVerticalAlignment = 'bottom';
      } else if (options.to === 'left') {
        toHorizontalAlignment = 'left';
      } else if (options.to === 'centerHorizontally') {
        toHorizontalAlignment = 'center';
      } else if (options.to === 'right') {
        toHorizontalAlignment = 'right';
      } else {
        throw new Error('invalid alignment options');
      }
    } else {
      toVerticalAlignment = verticalAlignment;
      toHorizontalAlignment = horizontalAlignment;
    }

    let fixAnchor: { x?: number; y?: number } = {};
    if (toVerticalAlignment === 'top') {
      fixAnchor.y = fix.top ?? 0;
    } else if (toVerticalAlignment === 'center') {
      if (fix.height === undefined) {
        throw new Error('cannot center align vertically without height');
      }
      fixAnchor.y = fix.top ?? 0 + fix.height / 2;
    } else if (toVerticalAlignment === 'bottom') {
      fixAnchor.y = fix.bottom ?? 0;
    }
    if (toHorizontalAlignment === 'left') {
      fixAnchor.x = fix.left ?? 0;
    } else if (toHorizontalAlignment === 'center') {
      if (fix.width === undefined) {
        throw new Error('cannot center align horizontally without width');
      }
      fixAnchor.x = fix.left ?? 0 + fix.width / 2;
    } else if (toHorizontalAlignment === 'right') {
      fixAnchor.x = fix.right ?? 0;
    }

    if (horizontalAlignment !== undefined) {
      if (fixAnchor.x === undefined) {
        throw new Error('cannot align horizontally. fixAnchor.x is undefined');
      }
      switch (horizontalAlignment) {
        case 'left':
          mov.left = fixAnchor.x;
          break;
        case 'center':
          if (mov.width !== undefined) {
            mov.left = fixAnchor.x - mov.width / 2;
          } else {
            throw new Error('cannot align horizontally');
          }
          break;
        case 'right':
          mov.right = fixAnchor.x;
          break;
      }
    }

    if (verticalAlignment !== undefined) {
      if (fixAnchor.y === undefined) {
        throw new Error('cannot align vertically. fixAnchor.y is undefined');
      }
      switch (verticalAlignment) {
        case 'top':
          mov.top = fixAnchor.y;
          break;
        case 'center':
          if (mov.height !== undefined) {
            mov.top = fixAnchor.y - mov.height / 2;
          }
          break;
        case 'bottom':
          mov.bottom = fixAnchor.y;
          break;
      }
    }

    console.log('aligning: after', options, mov, fix);

    const left = Math.min(mov.left ?? -Infinity, fix.left ?? -Infinity);
    const top = Math.min(mov.top ?? -Infinity, fix.top ?? -Infinity);
    const right = Math.max(mov.right ?? Infinity, fix.right ?? Infinity);
    const bottom = Math.max(mov.bottom ?? Infinity, fix.bottom ?? Infinity);

    let width;
    if (left === -Infinity || right === Infinity) {
      width = undefined;
    } else {
      width = right - left;
    }

    let height;
    if (top === -Infinity || bottom === Infinity) {
      height = undefined;
    } else {
      height = bottom - top;
    }

    return { width, height };
  };

export const Align = LayoutFn((props: AlignProps) => alignMeasurePolicy(props));
