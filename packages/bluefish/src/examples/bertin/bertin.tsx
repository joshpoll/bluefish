// See https://observablehq.com/@observablehq/bertin-hotel

import { useName, withBluefish, useNameList, lookup } from '../../bluefish';
import { Group, Padding, Rect, Ref, Row, Text } from '../../main';
import { data, order, positioning, positioningOrdered } from './data';
import * as _ from 'lodash';
import { groupBy, tidy, summarize, max, mean } from '@tidyjs/tidy';
import { Plot2 as Plot } from '../grammars/gog/Plot';
import { GroupBy } from '../grammars/gog/marks/GroupBy';
import { scaleBand, scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateReds } from 'd3-scale-chromatic';
import { BarY } from '../grammars/gog/marks/NewBarY';
import { AlignNew } from '../../components/AlignNew';

const dataSubset = data; /* .slice(0, 2); */

const groupedData = tidy(
  dataSubset,
  groupBy(
    'type',
    [
      summarize({
        maxCount: max('count'),
        meanCount: mean('count'),
      }),
    ],
    groupBy.object({ single: true }),
  ),
);

export const BertinHotel = withBluefish((props: any) => {
  const groupBys = useName('groupBys');

  // const catNames = useNameList(positioningOrdered);

  return (
    <Group>
      <Plot
        data={dataSubset}
        x={({ width }) =>
          scaleBand(
            data.map((d) => d.month),
            [0, width],
          )
            .domain([
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ])
            .padding(0.1)
        }
        y={({ height }) => scaleLinear([0, _.max(dataSubset.map((d) => d.count))!], [0, height])}
        color={() => (x: any) => x}
        height={500}
        width={0}
      >
        {/* <NewBarY totalWidth={10} spacing={0} x={'month'} y={'count'} color={'count'} data={dataSubset} /> */}
        {/* <Partition>? */}
        <GroupBy
          name={groupBys}
          field={'type'}
          totalWidth={500}
          horizontalSpacing={5}
          verticalSpacing={5}
          // numCols={1}
          positioning={positioningOrdered.map((cat) => [cat])}
        >
          {({ key, data }) => {
            return (
              <BarY
                name={key}
                totalWidth={300}
                spacing={0}
                x={'month'}
                y={'count'}
                color={(d: any) => (d.count > groupedData[d.type].meanCount ? 'black' : 'none')}
                stroke="black"
                data={data}
              />
            );
          }}
        </GroupBy>
      </Plot>
      {positioningOrdered.map((cat) => {
        return (
          // <Row spacing={5} alignment="top">
          <AlignNew alignment="top">
            <Ref select={lookup(groupBys, cat)} />
            <Text x={300} contents={cat} />;
          </AlignNew>
          // </Row>
        );
      })}
    </Group>
  );
});
