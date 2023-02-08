import { scaleLinear } from 'd3-scale';
import { withBluefish } from '../../../../../bluefish';
import { Group, Rect } from '../../../../../main';

export type CellSquareProps = {
  x?: number;
  y?: number;
  cellSize?: number;
  value: number;
  color?: string;
};

export const CellSquare = withBluefish((props: CellSquareProps) => {
  const { x = 0, y = 0, cellSize = 10, color = 'rgb(0,0,0)', value } = props;

  const minWidth = 2;
  const scale = scaleLinear().range([minWidth ** 2, cellSize ** 2]);
  const sideLength = Math.sqrt(scale(value));

  // center the square
  const cX = x + (cellSize - sideLength) / 2;
  const cY = y + (cellSize - sideLength) / 2;

  return (
    <Group>
      <Rect x={cX} y={cY} width={sideLength} height={sideLength} fill={color} />
      <Rect fill="none" stroke="#eeeeee" x={x} y={y} width={cellSize} height={cellSize} />
    </Group>
  );
});
