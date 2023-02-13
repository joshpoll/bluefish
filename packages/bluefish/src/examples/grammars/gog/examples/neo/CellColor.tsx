import { scheme } from 'vega-scale';
import { withBluefish } from '../../../../../bluefish';
import { Rect } from '../../../../../main';

export type CellColorProps = {
  x?: number;
  y?: number;
  cellSize?: number;
  value: number;
};

const interpolateColors = scheme('lighttealblue');

export const CellColor = withBluefish((props: CellColorProps) => {
  const { x = 0, y = 0, cellSize = 10, value } = props;

  return <Rect stroke="#eeeeee" x={x} y={y} width={cellSize} height={cellSize} fill={interpolateColors(value)} />;
});
