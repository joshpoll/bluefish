import _ from 'lodash';
import { Measure, Constraints, Placeable, NewPlaceable, withBluefish, useBluefishLayout } from '../bluefish';
import { NewBBoxClass } from '../NewBBox';
import { PropsWithChildren } from 'react';

// export type DistributeProps = SpaceVerticalProps | SpaceHorizontalProps;
export type DistributeProps = {
  direction: 'vertical' | 'horizontal';
  total?: number;
  spacing?: number;
};

const distributeMeasurePolicy =
  (options: DistributeProps): Measure =>
  (measurables, constraints: Constraints) => {
    const placeables = measurables.map((measurable) => measurable.measure(constraints));

    if (options.direction === 'horizontal' && options.spacing === 3.7) {
      //console.log('distribute placeables', placeables);
    }

    if (options.direction === 'vertical') {
      let height: number;
      let spacing: number;
      if (options.spacing !== undefined && options.total !== undefined) {
        spacing = options.spacing;
        height = options.total;
        // assign additional space to items that don't have an extent
        const unassignedHeight = height - (_.sumBy(placeables, 'height') ?? 0);
        const unassignedPlaceables = placeables.filter((placeable) => placeable.height === undefined);
        const unassignedSpacing = unassignedHeight / unassignedPlaceables.length;
        for (const placeable of unassignedPlaceables) {
          placeable.height = unassignedSpacing;
        }
      } else if (options.spacing !== undefined) {
        spacing = options.spacing;
        height = _.sumBy(placeables, 'height') + spacing * (placeables.length - 1);
      } else if (options.total !== undefined) {
        height = options.total;
        const occupiedHeight = _.sumBy(placeables, 'height');
        spacing = (options.total - occupiedHeight) / (placeables.length - 1);
      } else {
        throw new Error('invalid options');
      }

      const fixedElement = placeables.findIndex((placeable) => placeable.top !== undefined);

      // use spacing and height to evenly distribute elements while ensuring that the fixed element
      // is fixed
      const startingY =
        fixedElement === -1
          ? 0
          : placeables[fixedElement].top! -
            spacing * fixedElement -
            _.sumBy(placeables.slice(0, fixedElement), 'height');

      // subtract off spacing and the sizes of the first fixedElement elements
      let y = startingY;
      for (const placeable of placeables) {
        placeable.top = y;
        y += placeable.height! + spacing;
      }

      // TODO: is the width computation correct? should it take position into account?
      return { top: startingY, width: _.max(_.map(placeables, 'width')) ?? 0, height };
    } else if (options.direction === 'horizontal') {
      let width: number;
      let spacing: number;
      if (options.spacing !== undefined && options.total !== undefined) {
        spacing = options.spacing;
        width = options.total;
        // assign additional space to items that don't have an extent
        const unassignedWidth = width - (_.sumBy(placeables, 'width') ?? 0);
        const unassignedPlaceables = placeables.filter((placeable) => placeable.width === undefined);
        const unassignedSpacing = unassignedWidth / unassignedPlaceables.length;
        for (const placeable of unassignedPlaceables) {
          placeable.width = unassignedSpacing;
        }
      } else if (options.spacing !== undefined) {
        spacing = options.spacing;
        width = _.sumBy(placeables, 'width') + spacing * (placeables.length - 1);
      } else if (options.total !== undefined) {
        width = options.total;
        const occupiedWidth = _.sumBy(placeables, 'width');
        spacing = (options.total - occupiedWidth) / (placeables.length - 1);
      } else {
        throw new Error('invalid options');
      }

      const fixedElement = placeables.findIndex((placeable) => placeable.left !== undefined);

      // use spacing and width to evenly distribute elements while ensuring that the fixed element
      // is fixed
      const startingX =
        fixedElement === -1
          ? 0
          : placeables[fixedElement].left! -
            spacing * fixedElement -
            _.sumBy(placeables.slice(0, fixedElement), 'width');

      // subtract off spacing and the sizes of the first fixedElement elements
      let x = startingX;
      for (const placeable of placeables) {
        placeable.left = x;
        x += placeable.width! + spacing;
      }

      // TODO: is the height computation correct? should it take position into account?
      return { left: startingX, width, height: _.max(_.map(placeables, 'height')) ?? 0 };
    } else {
      throw new Error('Invalid options for space');
    }
  };

export const Distribute = withBluefish((props: PropsWithChildren<DistributeProps>) => {
  const { id, domRef, bbox, children } = useBluefishLayout({}, props, distributeMeasurePolicy(props));

  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})`}
    >
      {children}
    </g>
  );
});
Distribute.displayName = 'Distribute';
