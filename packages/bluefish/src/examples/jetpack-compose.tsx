import { scaleLinear } from 'd3-scale';
import { lookup, useName, useNameList, withBluefish } from '../bluefish';
import { Contain } from '../components/Contain';
import { Distribute } from '../components/Distribute';
import { Rect } from '../components/Rect';
import { SVG } from '../components/SVG';
import { Align, Col, Group, Padding, Ref, Row, Text } from '../main';
import { Plot2 as Plot, Plot2 } from './grammars/gog/Plot';
import { NewAxis } from './grammars/gog/marks/NewAxis';
import { ScaledRect } from './grammars/gog/marks/Rect';

const ComposeText = withBluefish((props: { contents: string; fontSize?: string; fill?: string; x?: number }) => {
  return (
    <Text
      contents={props.contents}
      fontFamily="'Nunito Sans', sans-serif"
      fontWeight="700"
      fontSize={props.fontSize ?? '20'}
      fill={props.fill ?? 'black'}
      style={{ letterSpacing: '1px' }}
      x={props.x ?? undefined}
    />
  );
});

// Make expanded view as well
const dayToSleepBars = [
  { day: 'Sun', sleep: 7, startTime: 22, selected: true },
  { day: 'Mon', sleep: 6.5, startTime: 21 },
  { day: 'Tue', sleep: 8, startTime: 21 },
  { day: 'Wed', sleep: 7, startTime: 21 },
  { day: 'Thu', sleep: 7.2, startTime: 22 },
  { day: 'Fri', sleep: 8, startTime: 22 },
  { day: 'Sat', sleep: 9, startTime: 23 },
];

const displayedHours = [20, 21, 22, 23, 0, 1, 2];
const displayedResolutions = [{ name: 'day' }, { name: 'week', selected: true }, { name: 'month' }, { name: '6M' }];

// Scaffolding for basic perf testing
const numEntries = 20;
const dayToSleepBars2 = [...Array(numEntries)].map((i, ind) => ({ day: `day-${ind}`, sleep: Math.random() * 2 + 6 }));

const sleepBarWidth = (sleepTime: number) => 50 * sleepTime;

type ColorOffset = { offset: number; color: string };

type GradientProps = {
  id: string;
  colorOffsets: ColorOffset[];
  x1?: number;
  x2?: number;
  y1?: number;
  y2?: number;
};
const Gradient = withBluefish((props: GradientProps) => {
  return (
    <g>
      <linearGradient id={props.id} x1={props.x1} x2={props.x2} y1={props.y1} y2={props.y2}>
        {props.colorOffsets.map((colorOffset) => (
          <stop offset={`${colorOffset.offset}%`} stopColor={colorOffset.color} />
        ))}
      </linearGradient>
    </g>
  );
});

export const JetpackCompose: React.FC<{}> = withBluefish(() => {
  const resolution = useName('resolution');
  const hours = useName('hours');
  const hoursList = useNameList(displayedHours.map((hour) => `hour-${hour}`));
  const sleepBarRows = useName('sleepBarRows');
  const sleepBars = useNameList(dayToSleepBars.map((item, i) => `sleepBar-${i}`));
  const days = useNameList(dayToSleepBars.map((item, i) => `day-${i}`));
  const daysColumn = useName('daysColumn');
  const selectedResolution = useName('selectedResolution');
  const selectedResolutionRect = useName('selectedResolutionRect');

  console.log('hours list', hoursList);

  const xScale = (width: number) => scaleLinear([0, 5], [0, width]);
  // const yScale = (height: number) => scaleLinear([0, 100], [height, 0]);
  return (
    <SVG width={1000} height={800}>
      {/* Define Gradients */}
      <Gradient
        id="sleepBarGradient"
        colorOffsets={[
          { offset: 0, color: '#F1E9BC' },
          { offset: 100, color: '#f7d590' },
        ]}
        x1={0}
        x2={0}
        y1={0}
        y2={1}
      />
      <Gradient
        id="hoursBarGradient"
        colorOffsets={[
          { offset: 0, color: '#f8e7a0' },
          { offset: 100, color: '#f8d183' },
        ]}
      />
      <Padding all={10}>
        <Group>
          <Distribute direction="vertical" spacing={30}>
            {/* Top-level resolution bar */}
            <Group name={resolution}>
              <Row spacing={100} alignment="middle">
                {displayedResolutions.map((resolution) =>
                  resolution.selected === true ? (
                    <Group name={selectedResolution}>
                      <Align alignment="center">
                        <Padding {...{ left: 20, right: 0, bottom: 2, top: 0 }}>
                          {/* not a great fix but makes the alignment actually on center */}
                          <Rect
                            width={80}
                            height={30}
                            fill="#fff"
                            rx="10px"
                            stroke="#EEDFAB"
                            strokeWidth={2}
                            name={selectedResolutionRect}
                          />
                        </Padding>

                        <Padding {...{ left: 0, right: 0, bottom: 2, top: 0 }}>
                          <ComposeText contents={resolution.name} fontSize="20" />
                        </Padding>
                      </Align>
                    </Group>
                  ) : (
                    <ComposeText contents={resolution.name} fontSize="20" fill="#717171" />
                  ),
                )}
              </Row>
            </Group>

            {/* Hours container */}
            <Contain padding={{ left: 30, right: 30, top: 15, bottom: 15 }} name={hours}>
              <Rect fill="url(#hoursBarGradient)" rx="10px" />
              <Row spacing={60} alignment="middle">
                {displayedHours.map((hour, ind) => (
                  <ComposeText contents={hour.toString()} name={hoursList[ind]} key={`hour-${ind}`} />
                ))}
              </Row>
            </Contain>

            {/* Main Sleep bars content, including the intervals and days */}
            <Group name={sleepBarRows} x={0}>
              <Group name={daysColumn}>
                {dayToSleepBars.map((dayToSleepBar, ind) => (
                  <ComposeText contents={dayToSleepBar.day} key={`day-${ind}`} name={days[ind]} x={0} />
                ))}
              </Group>

              <Distribute spacing={20} direction={'vertical'}>
                {dayToSleepBars.map((dayToSleepBar, ind) => (
                  // Use some sort of scaled rectangle here
                  <Rect
                    height={dayToSleepBar.selected === true ? 100 : 30}
                    width={sleepBarWidth(dayToSleepBar.sleep)}
                    fill="url(#sleepBarGradient)"
                    rx="10px"
                    name={sleepBars[ind]}
                    key={`sleepbar-${ind}`}
                  />
                ))}
              </Distribute>
            </Group>
          </Distribute>
          {/* Alignment */}

          <Distribute spacing={60} direction={'horizontal'}>
            <Ref to={daysColumn} guidePrimary={'centerRight'} />
            <Ref to={hours} guidePrimary={'centerLeft'} />
          </Distribute>

          {dayToSleepBars.map((bar, ind) => {
            return (
              <Align alignment="left">
                <Ref to={hoursList.filter((hour) => hour.symbol.description === `hour-${bar.startTime}`)[0]} />
                <Ref to={sleepBars[ind]} />
              </Align>
            );
          })}

          <Align alignment="right">
            <Ref to={hours} />
            {sleepBars.map((sleepBar) => (
              <Ref to={sleepBar} />
            ))}
          </Align>

          {dayToSleepBars.map((dayToSleepBar, ind) => (
            <Align alignment={dayToSleepBar.selected ? 'top' : 'centerVertically'}>
              <Ref to={days[ind]} />
              <Ref to={sleepBars[ind]} />
            </Align>
          ))}

          <Align alignment="centerHorizontally">
            <Ref to={resolution} />
            <Ref to={sleepBarRows} />
          </Align>
        </Group>
      </Padding>
    </SVG>
  );
});
