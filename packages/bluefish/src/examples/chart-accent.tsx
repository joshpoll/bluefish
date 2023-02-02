import { Plot2 as Plot, Plot2 } from './grammars/gog/Plot';
import { SVG } from '../components/SVG';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import _ from 'lodash';
import { Circle, Col, Group, Padding } from '../main';
import { NewDot } from './grammars/gog/marks/NewDot';
import { NewLine } from './grammars/gog/marks/NewLine';
import { useName } from '../bluefish';
import { Text } from '../components/Text';
import { Axis } from './grammars/gog/marks/Axis';
import { NewAxis } from './grammars/gog/marks/NewAxis';
import { ticks } from 'd3-array';
import { AlignNew } from '../components/AlignNew';

type tempSchema = {
  city: string;
  temperature: number;
  month: number;
}[];

const temps = [
  { city: 'Chicago', temperature: 27, month: 1 },
  { city: 'Chicago', temperature: 30, month: 2 },
  { city: 'Chicago', temperature: 39, month: 3 },
  { city: 'Chicago', temperature: 49, month: 4 },
  { city: 'Chicago', temperature: 59, month: 5 },
  { city: 'Chicago', temperature: 70, month: 6 },
  { city: 'Chicago', temperature: 76, month: 7 },
  { city: 'Chicago', temperature: 75, month: 8 },
  { city: 'Chicago', temperature: 67, month: 9 },
  { city: 'Chicago', temperature: 55, month: 10 },
  { city: 'Chicago', temperature: 43, month: 11 },
  { city: 'Chicago', temperature: 32, month: 12 },
  { city: 'Phoenix', temperature: 55, month: 1 },
  { city: 'Phoenix', temperature: 59, month: 2 },
  { city: 'Phoenix', temperature: 65, month: 3 },
  { city: 'Phoenix', temperature: 73, month: 4 },
  { city: 'Phoenix', temperature: 82, month: 5 },
  { city: 'Phoenix', temperature: 92, month: 6 },
  { city: 'Phoenix', temperature: 95, month: 7 },
  { city: 'Phoenix', temperature: 93, month: 8 },
  { city: 'Phoenix', temperature: 88, month: 9 },
  { city: 'Phoenix', temperature: 76, month: 10 },
  { city: 'Phoenix', temperature: 63, month: 11 },
  { city: 'Phoenix', temperature: 55, month: 12 },
];

const xScale = (width: number) => scaleLinear([0, 13], [0, width]);
const yScale = (height: number) => scaleLinear([0, 100], [height, 0]);

const ChartLegend: React.FC<{}> = () => {
  return (
    <Group>
      <Col spacing={5} alignment={'left'}>
        <AlignNew>
          <Circle guidePrimary={'centerRight'} r={3} color={'blue'} />
          <Text guidePrimary={'centerLeft'} contents={'Chicago'} />
        </AlignNew>
      </Col>
    </Group>
  );
};

export const ChartAccent: React.FC<{}> = () => {
  const line1 = useName('line1');
  const line2 = useName('line2');
  const freezing = useName('freezing');
  const chicagoAvgRef = useName('chicagoAverage');

  const chicagoTemps = temps.filter((temp) => temp.city === 'Chicago');
  const phoenixTemps = temps.filter((temp) => temp.city === 'Phoenix');

  const chicagoAvg = chicagoTemps.reduce((prev, cur) => prev + cur.temperature / (chicagoTemps.length * 1.0), 0);

  return (
    <SVG width={500} height={500}>
      <Col spacing={5} alignment={'center'}>
        <Padding left={10} top={10} right={10} bottom={20}>
          <Text contents={'Average Monthly Temperature'} />
        </Padding>
        <Padding left={20} top={10} right={20} bottom={10}>
          <Plot
            height={200}
            data={temps}
            x={({ width }) =>
              () =>
                xScale(width)}
            y={({ height }) =>
              () =>
                yScale(height)}
            color={() => () => 'black'}
          >
            <NewLine name={line1} x={'month'} y={'temperature'} stroke={'blue'} color={'blue'} data={chicagoTemps} />
            <NewDot x={'month'} y={'temperature'} color={'blue'} stroke={'blue'} data={chicagoTemps} />
            <NewLine name={line2} x={'month'} y={'temperature'} color={'green'} data={phoenixTemps} />
            <NewDot x={'month'} y={'temperature'} data={phoenixTemps} />
            <NewLine
              name={freezing}
              x={'month'}
              y={'temperature'}
              color={'black'}
              strokeWidth={1}
              data={[
                { temperature: 32, month: 0 },
                { temperature: 32, month: 13 },
              ]}
            />
            <NewLine
              name={chicagoAvgRef}
              x={'month'}
              y={'temperature'}
              color={'blue'}
              strokeWidth={1}
              data={[
                { temperature: chicagoAvg, month: 0 },
                { temperature: chicagoAvg, month: 13 },
              ]}
            />
            <NewAxis x={'month'} y={'temperature'} color={'black'} ticks={Array.from(Array(14).keys())} axis={'x'} />
            <NewAxis x={'month'} y={'temperature'} color={'black'} ticks={ticks(0, 100, 10)} axis={'y'} />
          </Plot>
        </Padding>

        {/* <Rect width={100} height={100} fill={'red'} /> */}
      </Col>
    </SVG>
  );
};
