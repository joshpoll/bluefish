import { withBluefish } from '../../../../../bluefish';
import { AlignNew } from '../../../../../components/AlignNew';
import { Col, Group, Line, Rect, Text } from '../../../../../main';

export type CellStatProps = {
  statistic: [number, string];
  cellSize?: number;
  columnWidth?: number;
  height?: number;
};

// TODO: cellSize is no longer used! remove?
export const CellStat = withBluefish((props: CellStatProps) => {
  const { statistic, cellSize = 15, columnWidth = 30, height = 3 } = props;

  const nonNanValue = Number.isNaN(statistic[0]) ? 0 : statistic[0];

  return (
    <Rect width={columnWidth} height={height} fill="#eeeeee" />
    // <Col alignment="left" spacing={0}>
    //   <Text font-size="10px" fill="#888888" contents={statistic[1]} />
    //   <AlignNew alignment="centerLeft">
    //     <Rect width={columnWidth} height={height} fill="#eeeeee" />
    //     <Rect width={nonNanValue * columnWidth} height={3} fill="#0066cc" />
    //   </AlignNew>
    // </Col>
  );
});
