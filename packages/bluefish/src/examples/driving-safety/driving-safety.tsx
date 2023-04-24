import { scaleLinear } from 'd3-scale';
import _ from 'lodash';
import { lookup, useName } from '../../bluefish';
import { Align } from '../../components/Align';
import { Distribute } from '../../components/Distribute';
import { Col, Padding, withBluefish, Text, Rect, Ref, Group } from '../../main';
import { NewDot } from '../grammars/gog/marks/NewDot';
import { NewLine } from '../grammars/gog/marks/NewLine';
import { Plot2 as Plot } from '../grammars/gog/Plot';
import { driving_data_per_capita } from './data';

export const DrivingSafety = withBluefish(() => {
  const line = useName('line');
  const dots = useName('dots');
  const annotation = useName('annotation');

  return (
    <Group>
      <Col spacing={5} alignment={'center'}>
        <Padding left={40} top={10} right={20} bottom={30}>
          <Plot
            height={600}
            data={driving_data_per_capita}
            x={({ width }) =>
              scaleLinear(
                [
                  _.min(driving_data_per_capita.map((d) => +d.vmt))!,
                  _.max(driving_data_per_capita.map((d) => +d.vmt))!,
                ],
                [0, width],
              )
            }
            y={({ height }) =>
              scaleLinear(
                [
                  _.min(driving_data_per_capita.map((d) => +d.fatalities))!,
                  _.max(driving_data_per_capita.map((d) => +d.fatalities))!,
                ],
                [height, 0],
              )
            }
            color={() => () => 'black'}
          >
            <NewLine name={line} x="vmt" y="fatalities" />
            <NewDot
              name={dots}
              x="vmt"
              y="fatalities"
              label={{
                field: 'year',
                avoid: [
                  /* line */
                ],
              }}
            />
          </Plot>
        </Padding>
        <Text contents={'this is a test caption'} />
        {/* <Rect width={100} height={100} fill={'red'} /> */}
      </Col>
      {/* TODO: these ref positions are messed up! */}
      <Rect name={annotation} height={100} fill={'red'} />
      <Distribute direction="vertical" spacing={5}>
        <Ref select={annotation} />
        <Ref select={lookup(dots, 'dot-6')} />
      </Distribute>
      <Align>
        <Ref select={annotation} guidePrimary="left" />
        <Ref select={lookup(dots, 'dot-10')} guidePrimary="right" />
      </Align>
      <Align>
        <Ref select={annotation} guidePrimary="right" />
        <Ref select={lookup(dots, 'dot-20')} guidePrimary="left" />
      </Align>
    </Group>
  );
});
