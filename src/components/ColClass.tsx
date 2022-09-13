import _ from 'lodash';
import { withBluefishLayout, Measure, Constraints, Placeable } from '../bluefishClass';

export type HorizontalAlignment = 'left' | 'center' | 'right';

export type ColProps = ({ spacing: number } | { totalHeight: number }) & {
  x?: number;
  y?: number;
  alignment: HorizontalAlignment;
};

const colMeasurePolicy =
  (options: ColProps): Measure =>
  (measurables, constraints: Constraints) => {
    console.log('colMeasurePolicy: measurables', measurables);
    const placeables = measurables.map((measurable) => measurable.measure(constraints)) as Placeable[];
    console.log('colMeasurePolicy: placeables', placeables);

    // alignment
    const width = _.max(_.map(placeables, 'measuredWidth')) ?? 0;

    switch (options.alignment) {
      case 'left':
        placeables.forEach((placeable) => {
          placeable.place({ x: 0 });
        });
        break;
      case 'center':
        placeables.forEach((placeable) => {
          placeable.place({ x: (width - placeable.measuredWidth) / 2 });
        });
        break;
      case 'right':
        placeables.forEach((placeable) => {
          placeable.place({ x: width - placeable.measuredWidth });
        });
    }

    // spacing
    const height =
      'totalHeight' in options
        ? options.totalHeight
        : _.sumBy(placeables, (p) => p.measuredHeight) + options.spacing * (placeables.length - 1);

    let spacing: number;
    if ('totalHeight' in options) {
      const occupiedHeight = _.sumBy(placeables, 'measuredHeight');
      spacing = (options.totalHeight - occupiedHeight) / (placeables.length - 1);
    } else {
      spacing = options.spacing;
    }

    let y = 0;
    placeables.forEach((placeable) => {
      placeable.place({ y });
      y += placeable.measuredHeight + spacing;
    });

    return { width, height };
  };

export const ColClass = withBluefishLayout(colMeasurePolicy)((props) => {
  return <g transform={`translate(${props.x ?? 0}, ${props.y ?? 0})`}>{props.children}</g>;
});
