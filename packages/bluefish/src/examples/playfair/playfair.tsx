import { scaleBand, scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import _ from 'lodash';
import { withBluefish } from '../../bluefish';
import { BarY } from '../grammars/gog/marks/NewBarY';
import { Plot2 as Plot } from '../grammars/gog/Plot';
import { monarch, wheat } from './data';
import { NewDot } from '../grammars/gog/marks/NewDot';
import { NewLine } from '../grammars/gog/marks/NewLine';
import { NewRect } from '../grammars/gog/marks/Rect';
import { Group } from '../../main';

export const Playfair = withBluefish(() => {
  // TODO: these marks need to share an axis
  return (
    <Group>
      <Plot
        data={wheat}
        x={({ width }) =>
          scaleBand(
            wheat.map((d) => d.year),
            [0, width],
          ).padding(0.1)
        }
        y={({ height }) => scaleLinear([0, _.max(wheat.map((d) => +d.wheat))!], [0, height])}
        color={() => (x: any) => x}
      >
        <BarY spacing={0} x={'year'} y={'wheat'} color="#aaa" stroke="#999" />
        <NewLine x={'year'} y={'wages'} />
        <NewRect
          data={monarch}
          x1="start"
          x2="end"
          y1="start"
          y2={20}
          color={(d) => (d.commonwealth === true ? 'none' : 'black')}
          stroke="black"
        />
      </Plot>
      {/* Then out here we can align the monarch rects */}
      {/* Then we can add the annotations to each of the rects */}
    </Group>
  );
});
