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
  classes: ['fruit'],
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

export const Matrix = () => {
  /* 
  <g transform="translate({hierarchyExtent},{hierarchyExtent})">
            {#each layout as { node: actual, pos: actualPos }}
                <g transform="translate(0,{actualPos[1] * cellSize})">
                    {#each layout as { node: predict, pos: predictPos }}
                        {#if !isFrontier(predict) || !isFrontier(actual)}
                            <CellBlank
                                x={predictPos[1] * cellSize}
                                {actual}
                                {predict}
                                {cellSize}
                            />
                        {:else if matrix.frequency(actual, predict) === 0}
                            <CellZero
                                x={predictPos[1] * cellSize}
                                {actual}
                                {predict}
                                {cellSize}
                            />
                        {:else if $spec.encoding === "color"}
                            <CellColor
                                x={predictPos[1] * cellSize}
                                {actual}
                                {predict}
                                {cellSize}
                                value={mapping.value(actual, predict)}
                            />
                        {:else if $spec.encoding === "size"}
                            <CellSquare
                                x={predictPos[1] * cellSize}
                                {actual}
                                {predict}
                                {cellSize}
                                value={mapping.value(actual, predict)}
                                color="rgb(26,133,255)"
                            />
                        {/if}
                    {/each}
                </g>
            {/each}
        </g>
   */
  // convert the above svelte code to React
  return (
    <g transform={`translate(${hierarchyExtent},${hierarchyExtent})`}>
      {layout.map(({ node: actual, pos: actualPos }) => (
        <g transform={`translate(0,${actualPos[1] * cellSize})`}>
          {layout.map(({ node: predict, pos: predictPos }) => {
            if (!isFrontier(predict) || !isFrontier(actual)) {
              return (
                <CellBlank x={predictPos[1] * cellSize} /* actual={actual} predict={predict} */ cellSize={cellSize} />
              );
            } else if (matrix.frequency(actual, predict) === 0) {
              return (
                <CellZero x={predictPos[1] * cellSize} /* actual={actual} predict={predict} */ cellSize={cellSize} />
              );
            } else if (spec.encoding === 'color') {
              return (
                <CellColor
                  x={predictPos[1] * cellSize}
                  /* actual={actual}
                  predict={predict} */
                  cellSize={cellSize}
                  value={mapping.value(actual, predict)}
                />
              );
            } else if (spec.encoding === 'size') {
              return (
                <CellSquare
                  x={predictPos[1] * cellSize}
                  /* actual={actual}
                  predict={predict} */
                  cellSize={cellSize}
                  value={mapping.value(actual, predict)}
                  color="rgb(26,133,255)"
                />
              );
            }
          })}
        </g>
      ))}
    </g>
  );
};
