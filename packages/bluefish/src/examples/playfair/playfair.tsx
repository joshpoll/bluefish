import { scaleBand, scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import _ from 'lodash';
import { withBluefish } from '../../bluefish';
import { NewBarY } from '../grammars/gog/marks/NewBarY';
import { Plot2 as Plot } from '../grammars/gog/Plot';
import { wheat } from './data';
import { NewDot } from '../grammars/gog/marks/NewDot';
import { NewLine } from '../grammars/gog/marks/NewLine';

export const Playfair = withBluefish(() => {
  // TODO: these marks need to share an axis
  return (
    <Plot
      data={wheat}
      x={({ width }) =>
        scaleBand(
          wheat.map((d) => d.year),
          [0, width],
        ).padding(0.1)
      }
      y={({ height }) => scaleLinear([0, _.max(wheat.map((d) => +d.wheat))!], [0, height])}
      color={() =>
        scaleSequential(interpolateBlues).domain([
          _.min(wheat.map((d) => +d.wheat))!,
          _.max(wheat.map((d) => +d.wheat))!,
        ])
      }
    >
      <NewBarY spacing={0} x={'year'} y={'wheat'} color={'wheat'} />
      <NewLine x={'year'} y={'wages'} />
    </Plot>
  );
});
