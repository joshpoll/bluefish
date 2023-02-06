import { scheme } from 'vega-scale';

export type CellColorProps = {
  x?: number;
  y?: number;
  cellSize?: number;
  value: number;
};

const interpolateColors = scheme('lighttealblue');

export const CellColor = (props: CellColorProps) => {
  const { x = 0, y = 0, cellSize = 10, value } = props;

  return <rect stroke="#eeeeee" x={x} y={y} width={cellSize} height={cellSize} fill={interpolateColors(value)} />;
};
