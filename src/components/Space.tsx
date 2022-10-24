import _ from 'lodash';
import { Measure, Constraints, Placeable, LayoutFn, NewPlaceable } from '../bluefish';
import { NewBBoxClass } from '../NewBBox';

// export type Direction = { vertically: boolean } | { horizontally: boolean };

// export type Amount = { }

export type SpaceVerticalProps = {
  vertically: true;
} & (
  | {
      by: number;
    }
  | {
      height: number;
    }
);

export type SpaceHorizontalProps = {
  horizontally: true;
} & (
  | {
      by: number;
    }
  | {
      width: number;
    }
);

export type SpaceProps = SpaceVerticalProps | SpaceHorizontalProps;

const spaceMeasurePolicy =
  (options: SpaceProps): Measure =>
  (measurables, constraints: Constraints) => {
    console.log(
      'entering spacing node',
      measurables.map((m) => m.name),
    );
    const placeables = measurables.map((measurable) => measurable.measure(constraints));

    if ('vertically' in options) {
      let height: number;
      let spacing: number;
      if ('by' in options) {
        spacing = options.by;
        height = _.sumBy(placeables, 'height') + spacing * (placeables.length - 1);
      } else if ('height' in options) {
        height = options.height;
        const occupiedHeight = _.sumBy(placeables, 'height');
        spacing = (options.height - occupiedHeight) / (placeables.length - 1);
      } else {
        throw new Error('invalid options');
      }

      // let y = placeables[0].top ?? 0;
      let y = 0;
      placeables.forEach((placeable) => {
        placeable.top = y;
        y += placeable.height! + spacing;
      });

      // TODO: is the width computation correct? should it take position into account?
      return { top: 0, width: _.max(_.map(placeables, 'width')) ?? 0, height };
    } else if ('horizontally' in options) {
      let width: number;
      let spacing: number;
      if ('by' in options) {
        spacing = options.by;
        width = _.sumBy(placeables, 'width') + spacing * (placeables.length - 1);
      } else if ('width' in options) {
        width = options.width;
        const occupiedWidth = _.sumBy(placeables, 'width');
        spacing = (options.width - occupiedWidth) / (placeables.length - 1);
      } else {
        throw new Error('invalid options');
      }

      let x = 0;
      placeables.forEach((placeable) => {
        placeable.left = x;
        x += placeable.width! + spacing;
      });

      // TODO: is the height computation correct? should it take position into account?
      return { left: 0, width, height: _.max(_.map(placeables, 'height')) ?? 0 };
    } else {
      throw new Error('Invalid options for space');
    }
  };

export const Space = LayoutFn((props: SpaceProps) => spaceMeasurePolicy(props));
Space.displayName = 'Space';
