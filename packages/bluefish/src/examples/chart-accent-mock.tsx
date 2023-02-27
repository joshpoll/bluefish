import { scaleLinear } from 'd3-scale';
import { useName, withBluefish } from '../bluefish';
import { DotScale, NewDot } from './grammars/gog/marks/NewDot';
import { NewLine } from './grammars/gog/marks/NewLine';
import { Plot2 as Plot, Plot2 } from './grammars/gog/Plot';

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

export const ChartAccent: React.FC<{}> = withBluefish(() => {
  const line1 = useName('line1');
  const line2 = useName('line2');
  const freezing = useName('freezing');
  const chicagoAvgRef = useName('chicagoAverage');
  // const dots = useName('dots');
  const phoenixDots = useName('phoenixDots');
  const chicagoDots = useName('chicagoDots');

  const chicagoTemps = temps.filter((temp) => temp.city === 'Chicago');
  const phoenixTemps = temps.filter((temp) => temp.city === 'Phoenix');

  const chicagoAvg = chicagoTemps.reduce((prev, cur) => prev + cur.temperature / (chicagoTemps.length * 1.0), 0);

  return (
    <Plot
      height={400}
      width={800}
      data={temps}
      x={({ width }) =>
        () =>
          xScale(width)}
      y={({ height }) =>
        () =>
          yScale(height)}
      color={() => () => 'black'}
    >
      <NewLine name={line1} x={'month'} y={'temperature'} color={'#5ca3d1'} data={chicagoTemps} curved={false} />
      <NewDot
        name={chicagoDots}
        x={'month'}
        y={'temperature'}
        color={'#5ca3d1'}
        stroke={'#5ca3d1'}
        data={chicagoTemps}
      />
      <NewDot
        x={'month'}
        y={'temperature'}
        color={'#5ca3d1'}
        stroke={'black'}
        data={chicagoTemps.filter((data) => data.temperature < 32)}
        label={'temperature'}
      />
      <NewLine name={line2} x={'month'} y={'temperature'} color={'#7c9834'} data={phoenixTemps} curved={false} />
      <NewDot name={phoenixDots} x={'month'} y={'temperature'} color={'#eaf3d9'} data={phoenixTemps} />
      <NewLine
        name={freezing}
        x={'month'}
        y={'temperature'}
        color={'black'}
        stroke={'1'}
        data={[
          { temperature: 32, month: 0 },
          { temperature: 32, month: 13 },
        ]}
      />
      <NewLine
        name={chicagoAvgRef}
        x={'month'}
        y={'temperature'}
        color={'#5ca3d1'}
        stroke={'1'}
        data={[
          { temperature: chicagoAvg, month: 0 },
          { temperature: chicagoAvg, month: 13 },
        ]}
      />

      {/* Psuedo code */}
      <Ref select={[chicagoDots, DotScale, filter((props) => props.data.temperature <= 32)]} />
      <Ref select={[phoenixDots, DotScale, filter((props) => props.data.month === 7)]} />
      <Ref select={[phoenixDots, DotScale, filter((props) => props.data.month >= 11)]} />
      <Ref select={[chicagoDots, DotScale, filter((props) => props.data.month >= 11)]} />
      <Ref select={[phoenixDots, DotScale, filter((props) => props.data.month === 5)]} />
    </Plot>
  );
});
