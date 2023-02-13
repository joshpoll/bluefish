import { fruit_data } from './fruit-data';
import { buildMatrix } from './confusions';
import { defaults, Spec } from './specification';
import { Entry } from './matrix-computations';
import { Statistic, toMapping, toStatistic } from './view';
import { layoutClassic } from './layout';
import { CellBlank } from './CellBlank';
import { CellZero } from './CellZero';
import { CellColor } from './CellColor';
import { CellSquare } from './CellSquare';
import { useName, withBluefish, useNameList } from '../../../../../bluefish';
import { Align, Group, Ref, Row, Text } from '../../../../../main';
import { Col } from '../../../../../components/Col';
import { Distribute } from '../../../../../components/Distribute';
import { AlignNew } from '../../../../../components/AlignNew';
import { CellStat } from './CellStat';

// Encoding
const cellSize = 18;
const hierarchyExtent = 150;
const hierarchyIndent = 14;
const statisticsWidth = 60;
const statisticsPadding = 10;

const padding = 4;
const axisTitle = 30;

const spec: Spec = {
  ...defaults,
  classes: ['fruit', 'taste'],
  normalization: 'total',
};

const matrix = buildMatrix(spec, fruit_data.data.values);

const hierarchy = matrix.axis;
const columns = (spec.measures ? spec.measures.map((m) => toStatistic(matrix, m)) : []) as Array<Statistic>;

const layout = layoutClassic((n: Entry) => !spec.collapsed.includes(n.data.id), hierarchy);

const isFrontier = (entry: Entry) => entry.isLeaf() || spec.collapsed.includes(entry.data.id);

// const statisticsExtent = columns.length * statisticsWidth;

// // TODO: Consider creating a "factory component" that does these computations
// const confusionsExtent = layout.length * cellSize;

// const totalExtent =
//   padding +
//   axisTitle +
//   hierarchyExtent +
//   confusionsExtent +
//   statisticsPadding +
//   statisticsExtent +
//   columns.length * padding +
//   padding;

// $: highlightRow = layout.find((n) => ($currentCell ? n.node === $currentCell[0] : false));
// $: highlightCol = layout.find((n) => ($currentCell ? n.node === $currentCell[1] : false));

const mapping = toMapping(matrix, new Set(spec.collapsed), spec.normalization);

// $: height = totalExtent - statisticsExtent - statisticsPadding;

// function clearFilter() {
//   $spec.filter = [];
//   $spec = $spec;
// }

/* NOTES:

- We totally got rid of the pos!!! That was annoying to compute so luckily we can just get rid of it!?

*/

export const Matrix = withBluefish(() => {
  const matrixObj = useName('matrix');
  // copilot suggested `useNameList('row', layout.length)`. hmmm
  const rows = useNameList(layout.map((l) => `row-${l.node.data.id}`));
  const stats = useName('stats');
  const cellStats = useNameList(columns.flatMap((_, i) => layout.map((_, j) => `cellStat-${i}-${j}`)));
  const cols = useNameList(columns.map((_, i) => `col-${i}`));
  console.log('cellStats', cellStats);

  console.log('[matrix] layout', layout);
  return (
    <Group>
      {/* <g transform={`translate(${hierarchyExtent},${hierarchyExtent})`}> */}
      {/* TODO: this translation doesn't work! */}
      <Col name={matrixObj} x={hierarchyExtent} y={hierarchyExtent} spacing={0} alignment="center">
        {layout.map(({ node: actual, pos: actualPos }, i) => (
          // <g transform={`translate(0,${actualPos[1] * cellSize})`}>
          <Row name={rows[i]} spacing={0} alignment="middle">
            {layout.map(({ node: predict, pos: predictPos }) => {
              if (!isFrontier(predict) || !isFrontier(actual)) {
                return <CellBlank /* actual={actual} predict={predict} */ cellSize={cellSize} />;
              } else if (matrix.frequency(actual, predict) === 0) {
                return <CellZero /* actual={actual} predict={predict} */ cellSize={cellSize} />;
              } else if (spec.encoding === 'color') {
                return (
                  <CellColor
                    /* actual={actual}
                  predict={predict} */
                    cellSize={cellSize}
                    value={mapping.value(actual, predict)}
                  />
                );
              } else if (spec.encoding === 'size') {
                return (
                  <CellSquare
                    /* actual={actual}
                  predict={predict} */
                    cellSize={cellSize}
                    value={mapping.value(actual, predict)}
                    color="rgb(26,133,255)"
                  />
                );
              } else {
                // impossible
                return null;
              }
            })}
          </Row>
        ))}
      </Col>
      {columns.map((statistic, i) => (
        <>
          {layout.map(({ node: row, pos: rowPos }, j) => (
            // horizontally align cell stats to rows
            <AlignNew alignment="bottom">
              <CellStat
                name={cellStats[i * layout.length + j]}
                columnWidth={statisticsWidth}
                cellSize={cellSize}
                statistic={statistic.value(row)}
              />
              <Ref to={rows[j]} />
            </AlignNew>
          ))}
          {/* vertically align cell states in the same column to each other */}
          <AlignNew name={cols[i]} alignment="left">
            {layout.map((_, j) => (
              <Ref to={cellStats[i * layout.length + j]} />
            ))}
          </AlignNew>
        </>
      ))}
      <Distribute name={stats} direction="horizontal" spacing={padding}>
        {columns.map((statistic, i) => (
          <Col alignment="left" spacing={0}>
            {/* TODO: I think this position underspecified... */}
            <Text contents={statistic.name()} />
            <Ref to={cols[i]} />
            {/* <AlignNew alignment="left">
              {layout.map(({ node: row, pos: rowPos }, j) => (
                // <CellStat columnWidth={statisticsWidth} cellSize={cellSize}
                // statistic={statistic.value(row)} />
                <Ref to={cellStats[i * layout.length + j]} />
              ))}
            </AlignNew> */}
          </Col>
        ))}
      </Distribute>
      <Row alignment="top" spacing={statisticsPadding}>
        <Ref to={matrixObj} />
        <Ref to={stats} />
      </Row>
    </Group>
  );
});
