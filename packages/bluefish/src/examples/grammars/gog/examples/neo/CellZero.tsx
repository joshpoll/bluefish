import { withBluefish } from '../../../../../bluefish';
import { Group, Line, Rect } from '../../../../../main';

export type CellZeroProps = {
  x?: number;
  y?: number;
  cellSize?: number;
};

export const CellZero = withBluefish((props: CellZeroProps) => {
  const { x = 0, y = 0, cellSize = 10 } = props;

  return (
    <Group>
      <Line
        x1={x + (cellSize / 8) * 3}
        y1={y + (cellSize / 8) * 3}
        x2={x + (cellSize / 8) * 5}
        y2={y + (cellSize / 8) * 5}
        stroke="#eeeeee"
      />
      <Rect fill="none" stroke="#eeeeee" x={x} y={y} width={cellSize} height={cellSize} />
    </Group>
  );
});
