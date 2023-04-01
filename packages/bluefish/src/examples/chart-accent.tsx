import { Plot2 as Plot, Plot2 } from './grammars/gog/Plot';
import { SVG } from '../components/SVG';
import { scaleLinear } from 'd3-scale';
import { line } from 'd3-shape';
import _ from 'lodash';
import { Align, Circle, Col, Connector, Group, Line, Padding, Rect, Ref, Row } from '../main';
import { NewDot } from './grammars/gog/marks/NewDot';
import { NewLine } from './grammars/gog/marks/NewLine';
import { lookup, useBluefishSymbolContext, useName, useNameList, withBluefish } from '../bluefish';
import { Text } from '../components/Text';
import { Axis } from './grammars/gog/marks/Axis';
import { NewAxis } from './grammars/gog/marks/NewAxis';
import { ticks } from 'd3-array';
import { AlignNew } from '../components/AlignNew';
import { Anchors, PointLabel } from '../components/Label/PointLabel';
import { NewRect } from './grammars/gog/marks/NewRect';

type tempSchema = {
  city: string;
  temperature: number;
  month: number;
}[];

const temps: tempSchema = [
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

const legend = [
  { color: '#5ca3d1', title: 'Chicago' },
  { color: '#7c9834', title: 'Phoenix' },
];

type Legend = {
  color: string;
  title: string;
};

export type ChartLegendProps = {
  items: Legend[];
};

const xScale = (width: number) => scaleLinear([0, 13], [0, width]);
const yScale = (height: number) => scaleLinear([0, 100], [height, 0]);

const ChartLegend = withBluefish((props: ChartLegendProps) => {
  const circle = useNameList(props.items.map((item) => `circle-${item.title}`));
  const legend = useNameList(props.items.map((item) => `legend-${item.title}`));

  return (
    <Col aria-label={`Chart Legend Items`} spacing={5} alignment={'center'}>
      {props.items.map((item, ind) => (
        <AlignNew aria-hidden={false} aria-label={`Legend item with name ${item.title}`}>
          <Circle
            aria-hidden={true}
            name={circle[ind]}
            guidePrimary={'centerRight'}
            r={5}
            fill={item.color}
            cx={0}
            cy={0}
          />
          <Padding aria-hidden={true} guidePrimary={'centerLeft'} all={5}>
            <Text name={legend[ind]} contents={item.title} />
          </Padding>
        </AlignNew>
      ))}
    </Col>
  );
});

type LineLabelProps = {
  contents: string;
  fontSize?: string;
  color?: string;
};

const LineLabel = withBluefish((props: LineLabelProps) => {
  const text = useName('text');
  const line1 = useName('line-1');
  const line2 = useName('line-2');

  return (
    <Group>
      <Row spacing={5} alignment={'middle'}>
        <Text name={text} contents={props.contents} fill={props.color ?? 'black'} fontSize={props.fontSize ?? '10pt'} />
        <Line name={line1} color={props.color ?? 'black'} x1={0} x2={10} />
      </Row>
    </Group>
  );
});

export const ChartAccent: React.FC<{}> = withBluefish(() => {
  const line1 = useName('line1');
  const line2 = useName('line2');
  const freezing = useName('freezing');
  const chicagoAvgRef = useName('chicagoAverage');
  const phoenixDots = useName('phoenixDots');
  const chicagoDots = useName('chicagoDots');
  const novDecDots = useName('novDecDots');
  const rectAnnotation = useName('rectAnnotation');
  const rectAnnotation2 = useName('rectAnnotation2');
  const xAxis = useName('xAxis');
  const yAxis = useName('yAxis');
  const springLabel = useName('springLabel');

  const chicagoTemps = temps.filter((temp) => temp.city === 'Chicago');
  const phoenixTemps = temps.filter((temp) => temp.city === 'Phoenix');

  const chicagoAvg = chicagoTemps.reduce((prev, cur) => prev + cur.temperature / (chicagoTemps.length * 1.0), 0);

  return (
    <SVG width={1000} height={450}>
      <Col spacing={5} alignment={'center'} aria-label={'Column'}>
        <Padding aria-label={'Title'} left={10} top={10} right={10} bottom={20}>
          <Text aria-label={'Average Monthly Temperature'} contents={'Average Monthly Temperature'} />
        </Padding>
        <Row spacing={10} alignment={'top'} aria-label={'Chart Body'}>
          <Padding left={30} top={10} right={30} bottom={10} aria-label={'Chart'}>
            <Plot
              height={300}
              width={700}
              data={temps}
              x={({ width }) =>
                () =>
                  xScale(width)}
              y={({ height }) =>
                () =>
                  yScale(height)}
              color={() => () => 'black'}
            >
              <NewLine
                aria-label={'Chicago Temperature Line'}
                name={line1}
                x={'month'}
                y={'temperature'}
                color={'#5ca3d1'}
                data={chicagoTemps}
                curved={false}
              />
              <NewDot
                aria-label={'Chicago Temperature Points'}
                x={'month'}
                y={'temperature'}
                color={'#5ca3d1'}
                stroke={'#5ca3d1'}
                data={chicagoTemps}
              />
              <NewDot
                aria-label={'Chicago Temperatures Below Freezing'}
                x={'month'}
                y={'temperature'}
                color={'#5ca3d1'}
                stroke={'black'}
                strokeWidth={1.5}
                data={chicagoTemps.filter((data) => data.temperature < 32)}
                label={'temperature'}
                labelProps={{ fill: '#5ca3d1', fontSize: '9pt' }}
              />
              <NewLine
                aria-label={'Phoenix Temperature Line'}
                name={line2}
                x={'month'}
                y={'temperature'}
                color={'#7c9834'}
                stroke={'2'}
                data={phoenixTemps}
                curved={false}
              />
              <NewDot
                aria-label={'Phoenix Temperature Points'}
                name={phoenixDots}
                x={'month'}
                y={'temperature'}
                color={'#eaf3d9'}
                strokeWidth={1.5}
                data={phoenixTemps}
              />
              <NewDot
                aria-hidden={true}
                x={'month'}
                y={'temperature'}
                color={'#7c9834'}
                data={[phoenixTemps[4], phoenixTemps[6]]}
              />
              <PointLabel
                aria-label={`Label for Maximum Phoenix Temperature Point. Max: 95`}
                texts={[
                  {
                    label: (
                      <Row guidePrimary={'topCenter'} spacing={2} alignment={'bottom'}>
                        <Padding
                          aria-label={'Annotation for label'}
                          left={10}
                          right={0}
                          bottom={10}
                          top={10}
                          guidePrimary={'center'}
                        >
                          <Text contents="(e)" aria-hidden={true} fill={'black'} fontSize={'16pt'} />
                        </Padding>
                        <Padding top={10} right={0} left={0} bottom={20}>
                          <Text contents={`Max: 95`} fontSize={'10pt'} />
                        </Padding>
                      </Row>
                    ),
                    ref: lookup(phoenixDots, 'dot-6'),
                  },
                ]}
                compare={undefined}
                offset={[1]}
                anchor={Anchors}
                avoidElements={[<Ref to={phoenixDots} />]}
                avoidRefElements
                padding={20}
              />

              <NewLine
                aria-label={'Freezing Temperature'}
                name={freezing}
                x={'month'}
                y={'temperature'}
                color={'#777777'}
                stroke={'1'}
                data={[
                  { temperature: 32, month: 0 },
                  { temperature: 32, month: 13 },
                ]}
              />
              <PointLabel
                aria-label={'Label for Freezing Line. Freezing Point: 32 Degrees'}
                texts={[
                  {
                    label: <Text fill={'#777777'} contents={`Freezing Point: 32`} fontSize={'10pt'} />,
                    ref: freezing,
                  },
                ]}
                compare={undefined}
                offset={[1]}
                anchor={Anchors}
                avoidElements={[]}
                avoidRefElements
                padding={0}
              />
              <NewDot
                aria-label={'November and December Temperatures'}
                x={'month'}
                y={'temperature'}
                name={novDecDots}
                color={'#f0b14f'}
                stroke={'#a16c00'}
                data={temps.filter((data) => {
                  return data.month >= 11;
                })}
                label={{ field: 'temperature', avoid: [line1, line2] }}
                labelProps={{ fill: '#f0b14f', fontSize: '9pt' }}
              />
              <NewLine
                aria-label={'Chicago Average Temperature Line'}
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
              <PointLabel
                aria-label={`Label for Chicago's Average Temperature Line. Average: ${chicagoAvg.toFixed(2)}`}
                texts={[
                  {
                    label: (
                      <Padding top={0} bottom={0} left={30} right={0}>
                        <Text contents={`Chicago's Avg: ${chicagoAvg.toFixed(2)}`} fontSize={'10pt'} fill={'#5ca3d1'} />
                      </Padding>
                    ),
                    ref: chicagoAvgRef,
                  },
                ]}
                compare={undefined}
                offset={[1]}
                anchor={Anchors}
                avoidElements={[]}
                avoidRefElements
                padding={0}
              />
              <NewLine
                aria-label={'Line Annotation'}
                x={'month'}
                y={'temperature'}
                color={'#f0b14f'}
                stroke={'2'}
                data={[
                  { temperature: 10, month: 9.5 },
                  { temperature: 10, month: 12.5 },
                ]}
              />
              <NewLine
                aria-label={'Line Annotation'}
                x={'month'}
                y={'temperature'}
                color={'#f0b14f'}
                stroke={'2'}
                data={[
                  { temperature: 10, month: 7.5 },
                  { temperature: 10, month: 8.5 },
                ]}
              />
              <NewAxis
                name={xAxis}
                x={'month'}
                y={'temperature'}
                color={'black'}
                vals={Array.from(Array(14).keys())}
                ticks={['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', '']}
                axis={'x'}
              />
              <NewAxis
                name={yAxis}
                x={'month'}
                y={'temperature'}
                color={'black'}
                vals={ticks(0, 100, 10)}
                ticks={ticks(0, 100, 10)}
                axis={'y'}
              />

              <AlignNew aria-hidden={false} aria-label={'Spring Annotation Group'}>
                <NewRect
                  aria-label={'Rectangle from 2.5 to 5.5 on the x-axis'}
                  guidePrimary={'topCenter'}
                  name={rectAnnotation}
                  // opacity={0.3}
                  fillOpacity={0.3}
                  color={'gray'}
                  x={'month'}
                  y={'temperature'}
                  corner1={{ temperature: 0, month: 2.5 }}
                  corner2={{ temperature: 100, month: 5.5 }}
                />
                <Row name={springLabel} guidePrimary={'topCenter'} spacing={2} alignment={'bottom'}>
                  <Padding
                    aria-label={'Annotation for label'}
                    left={5}
                    right={0}
                    bottom={0}
                    top={0}
                    guidePrimary={'center'}
                  >
                    <Text contents="(g)" aria-hidden={true} fill={'black'} fontSize={'16pt'} />
                  </Padding>
                  <Padding
                    aria-label={'Text label reading Spring'}
                    left={5}
                    right={40}
                    bottom={0}
                    top={0}
                    guidePrimary={'center'}
                  >
                    <Text contents="Spring" aria-hidden={true} fill={'#999999'} />
                  </Padding>
                </Row>
              </AlignNew>
              <NewRect
                name={rectAnnotation2}
                aria-label={'Rectangle Annotation from 8.5 to 10.5 on the x-axis'}
                // opacity={0.3}
                fillOpacity={0.2}
                color={'#f0b14f'}
                stroke={'#f0b14f'}
                strokeWidth={2}
                x={'month'}
                y={'temperature'}
                corner1={{ temperature: 60, month: 8.5 }}
                corner2={{ temperature: 95, month: 10.5 }}
              />
              <PointLabel
                aria-label={`Label for Rect Annotation`}
                texts={[
                  {
                    label: (
                      <Padding
                        aria-label={'Annotation for label'}
                        left={5}
                        right={0}
                        bottom={0}
                        top={15}
                        guidePrimary={'center'}
                      >
                        <Text contents="(k)" aria-hidden={true} fill={'black'} fontSize={'16pt'} />
                      </Padding>
                    ),
                    ref: rectAnnotation2,
                  },
                ]}
                compare={undefined}
                offset={[1]}
                anchor={['top-right']}
                avoidElements={[<Ref to={phoenixDots} />, <Ref to={springLabel} />]}
                avoidRefElements
                padding={0}
              />
              <PointLabel
                aria-label={`Label for Phoenix Temperature in May. May: 82`}
                texts={[
                  {
                    label: (
                      <Row guidePrimary={'topCenter'} spacing={2} alignment={'bottom'}>
                        <Padding
                          aria-label={'Annotation for label'}
                          left={5}
                          right={0}
                          bottom={0}
                          top={15}
                          guidePrimary={'center'}
                        >
                          <Text contents="(a)" aria-hidden={true} fill={'black'} fontSize={'16pt'} />
                        </Padding>
                        <Padding top={15} right={30} left={0} bottom={0}>
                          <Text contents={`Phoenix in May: 82`} fontSize={'10pt'} />
                        </Padding>
                      </Row>
                    ),
                    ref: lookup(phoenixDots, 'dot-4'),
                  },
                ]}
                compare={undefined}
                offset={[1]}
                anchor={Anchors}
                avoidElements={[<Ref to={phoenixDots} />, <Ref to={springLabel} />]}
                avoidRefElements
                padding={0}
              />
            </Plot>
          </Padding>
          <Group aria-label={'Chart Legend'}>
            <ChartLegend items={legend} />
          </Group>
        </Row>

        {/* <Rect width={100} height={100} fill={'red'} /> */}
      </Col>
    </SVG>
  );
});

// //  d3 syntax:
// d3.selectAll(element).attr(width, 90);

// // selection by component name/lookup? Is that even possible ==> if each component keeps track of what it's called
// // i.e.
// Bluefish.selectAll(NewDot).attr()

// // should return component but also props for filtering?
// Bluefish.selectAll(NewDot).filter(d => d.month === )
