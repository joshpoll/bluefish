import { polio_data, PolioData } from './polio-data';
import { withBluefish } from '../../../../bluefish';
import { groupBy } from 'lodash';
import { Plot2 as Plot } from '../Plot';
import { NewBarY } from '../marks/NewBarY';
import { scaleBand, scaleLinear, scaleSequential } from 'd3-scale';
import _ from 'lodash';
import { interpolateReds } from 'd3-scale-chromatic';
import { GroupBy } from '../marks/GroupBy';
import { Rect } from '../../../../main';

const USMap = [
  ['AK', null, null, null, null, null, null, null, null, null, 'ME'],
  [null, null, null, null, null, 'WI', null, null, null, 'VT', 'NH'],
  ['WA', 'ID', 'MT', 'ND', 'MN', 'IL', 'MI', null, 'NY', 'MA', null],
  ['OR', 'NV', 'WY', 'SD', 'IA', 'IN', 'OH', 'PA', 'NJ', 'CT', 'RI'],
  ['CA', 'UT', 'CO', 'NE', 'MO', 'KY', 'WV', 'VA', 'MD', 'DE', null],
  [null, 'AZ', 'NM', 'KS', 'AR', 'TN', 'NC', 'SC', 'DC', null, null],
  [null, null, null, 'OK', 'LA', 'MS', 'AL', 'GA', null, null, null],
  ['HI', null, null, 'TX', null, null, null, null, 'FL', null, 'PR'],
];

// map from x,y to state
const positioning = ({ x, y }: { x: number; y: number }) => USMap[y][x];

export const Polio = withBluefish((props: any) => {
  return (
    <Plot
      data={polio_data}
      x={({ width }) =>
        scaleBand(
          polio_data.map((d) => d.year),
          [0, width],
        ).padding(0.1)
      }
      y={({ height }) => scaleLinear([0, _.max(polio_data.map((d) => d.total))!], [0, height])}
      color={() =>
        scaleSequential(interpolateReds).domain([
          _.min(polio_data.map((d) => d.total))!,
          _.max(polio_data.map((d) => d.total))!,
        ])
      }
    >
      {/* <Partition>? */}
      <GroupBy
        field={'state'}
        totalWidth={500}
        horizontalSpacing={5}
        verticalSpacing={5}
        // numRows={10}
        positioning={USMap}
      >
        {({ key, data }) => <NewBarY totalWidth={40} spacing={0} x={'year'} y={'total'} color={'total'} data={data} />}
      </GroupBy>
    </Plot>
  );
});
