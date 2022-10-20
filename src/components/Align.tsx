import { Measure, Constraints, Placeable, LayoutFn, NewPlaceable } from '../bluefish';
import { NewBBoxClass } from '../NewBBox';

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

export type VerticalAlignment = 'top' | 'center' | 'bottom';
export type HorizontalAlignment = 'left' | 'center' | 'right';

export type Alignment1D = 'top' | 'centerVertically' | 'bottom' | 'left' | 'centerHorizontally' | 'right';

export type Alignment1DObjs = { [K in Alignment1D]: { [k in K]: boolean } }[Alignment1D];

export type AlignProps = (Alignment2DObjs | Alignment1DObjs) & { to?: Alignment2D | Alignment1D } & {
  x?: number;
  y?: number;
};

export const splitAlignment = (
  alignment: Alignment2D | Alignment1D,
): [VerticalAlignment | undefined, HorizontalAlignment | undefined] => {
  let verticalAlignment: VerticalAlignment | undefined;
  let horizontalAlignment: HorizontalAlignment | undefined;
  switch (alignment) {
    case 'topLeft':
    case 'topCenter':
    case 'topRight':
      verticalAlignment = 'top';
      break;
    case 'centerLeft':
    case 'center':
    case 'centerRight':
      verticalAlignment = 'center';
      break;
    case 'bottomLeft':
    case 'bottomCenter':
    case 'bottomRight':
      verticalAlignment = 'bottom';
      break;
  }

  switch (alignment) {
    case 'topLeft':
    case 'centerLeft':
    case 'bottomLeft':
      horizontalAlignment = 'left';
      break;
    case 'topCenter':
    case 'center':
    case 'bottomCenter':
      horizontalAlignment = 'center';
      break;
    case 'topRight':
    case 'centerRight':
    case 'bottomRight':
      horizontalAlignment = 'right';
      break;
  }

  return [verticalAlignment, horizontalAlignment];
};

const alignMeasurePolicy =
  (options: AlignProps): Measure =>
  (measurables, constraints: Constraints) => {
    console.log('entering alignment node');
    const [mov, fix] = measurables.map((measurable) => measurable.measure(constraints));

    if ('left' in options) {
      console.log('aligning left', mov, fix);
    }
    if ('right' in options) {
      console.log('aligning right', mov, fix);
    }

    console.log(
      'aligning: before',
      options,
      {
        top: mov.top,
        left: mov.left,
        bottom: mov.bottom,
        right: mov.right,
        width: mov.width,
        height: mov.height,
      },
      {
        top: fix.top,
        left: fix.left,
        bottom: fix.bottom,
        right: fix.right,
        width: fix.width,
        height: fix.height,
      },
    );

    if (fix.left === undefined) fix.left = 0;
    if (fix.top === undefined) fix.top = 0;

    console.log(
      'aligning: after fix placement',
      measurables.map((m) => m.name).join(' '),
      options,
      {
        top: mov.top,
        left: mov.left,
        bottom: mov.bottom,
        right: mov.right,
        width: mov.width,
        height: mov.height,
      },
      {
        top: fix.top,
        left: fix.left,
        bottom: fix.bottom,
        right: fix.right,
        width: fix.width,
        height: fix.height,
      },
    );

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
      if (options.to !== undefined) [toVerticalAlignment, toHorizontalAlignment] = splitAlignment(options.to);
    } else {
      toVerticalAlignment = verticalAlignment;
      toHorizontalAlignment = horizontalAlignment;
    }

    console.log('alignment', verticalAlignment, horizontalAlignment);
    console.log('toAlignment', toVerticalAlignment, toHorizontalAlignment);

    let fixAnchor: { x?: number; y?: number } = {};
    if (toVerticalAlignment === 'top') {
      fixAnchor.y = fix.top ?? 0;
    } else if (toVerticalAlignment === 'center') {
      if (fix.height === undefined) {
        throw new Error('cannot center align vertically without height');
      }
      console.log('fix.height', fix.height);
      fixAnchor.y = (fix.top ?? 0) + fix.height / 2;
      console.log('fixAnchor', fixAnchor, (fix.top ?? 0) + fix.height / 2);
    } else if (toVerticalAlignment === 'bottom') {
      fixAnchor.y = fix.bottom ?? 0;
    }
    if (toHorizontalAlignment === 'left') {
      fixAnchor.x = fix.left ?? 0;
    } else if (toHorizontalAlignment === 'center') {
      if (fix.width === undefined) {
        throw new Error('cannot center align horizontally without width');
      }
      // console.log('fixwidth', fix.width);
      // console.log('fixwidth/2', fix.width / 2);
      fixAnchor.x = (fix.left ?? 0) + fix.width / 2;
    } else if (toHorizontalAlignment === 'right') {
      console.log('fixins', {
        fixRight: fix.right,
        fixLeft: fix.left,
        fixWidth: fix.width,
      });
      fixAnchor.x = fix.right ?? 0;
      console.log('fixAnchor: right', fixAnchor);
    }

    if (horizontalAlignment !== undefined) {
      if (fixAnchor.x === undefined) {
        throw new Error('cannot align horizontally. fixAnchor.x is undefined');
      }
      switch (horizontalAlignment) {
        case 'left':
          // console.log(
          //   'left',
          //   fixAnchor.x,
          //   options,
          //   {
          //     left: mov.left,
          //     top: mov.top,
          //     right: mov.right,
          //     bottom: mov.bottom,
          //     width: mov.width,
          //     height: mov.height,
          //   },
          //   {
          //     left: fix.left,
          //     top: fix.top,
          //     right: fix.right,
          //     bottom: fix.bottom,
          //     width: fix.width,
          //     height: fix.height,
          //   },
          // );
          mov.left = fixAnchor.x;
          // console.log(
          //   'left-after',
          //   mov.left,
          //   options,
          //   {
          //     left: mov.left,
          //     top: mov.top,
          //     right: mov.right,
          //     bottom: mov.bottom,
          //     width: mov.width,
          //     height: mov.height,
          //   },
          //   {
          //     left: fix.left,
          //     top: fix.top,
          //     right: fix.right,
          //     bottom: fix.bottom,
          //     width: fix.width,
          //     height: fix.height,
          //   },
          // );
          break;
        case 'center':
          if (mov.width !== undefined) {
            console.log('fix anchor', fixAnchor);
            console.log('horizontal center', mov, mov.left, mov.width, fixAnchor.x - mov.width / 2);
            mov.left = fixAnchor.x - mov.width / 2;
            console.log('left set to', mov.left, 'in horizontal center');
            console.log('horizontal center', mov, mov.left, mov.width);
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

    console.log(
      'aligning: after',
      options,
      {
        left: mov.left,
        top: mov.top,
        right: mov.right,
        bottom: mov.bottom,
        width: mov.width,
        height: mov.height,
      },
      {
        left: fix.left,
        top: fix.top,
        right: fix.right,
        bottom: fix.bottom,
        width: fix.width,
        height: fix.height,
      },
    );

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
Align.displayName = 'Align';
