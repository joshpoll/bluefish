import { lookup, useName, useNameList, withBluefish } from '../bluefish';
import { Contain } from '../components/Contain';
import { Distribute } from '../components/Distribute';
import { Rect } from '../components/Rect';
import { SVG } from '../components/SVG';
import { Align, Group, Padding, Ref, Row, Text } from '../main';

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
const displayedResolutions = [{ name: 'Day' }, { name: 'Week', selected: true }, { name: 'Month' }, { name: '6M' }];

// When alignment is fixed, remove this
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

// A linear gradient component to insert into shape fills
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

// Component wrapped in a rectangle to indicate selected resolution
const SelectedResolution = withBluefish((props: { resolutionName: string }) => {
  return (
    <Group>
      <Align>
        <Padding {...{ left: 30, right: 0, bottom: 2, top: 0 }} guidePrimary="center">
          <Rect width={80} height={30} fill="#fff" rx="10px" stroke="#EEDFAB" strokeWidth={2} />
        </Padding>
        <Padding {...{ left: 0, right: 0, bottom: 0, top: 0 }} guidePrimary="center">
          <ComposeText contents={props.resolutionName} fontSize="20" />
        </Padding>
      </Align>
    </Group>
  );
});

export const JetpackCompose: React.FC<{}> = withBluefish(() => {
  const resolution = useName('resolution');
  const hours = useName('hours');
  const mainContent = useName('mainContent');
  const sleepBars = useNameList(dayToSleepBars.map((item, i) => `sleepBar-${i}`));

  const sleepBarContainer = useName('sleepBarContainer');
  const days = useNameList(dayToSleepBars.map((item, i) => `day-${i}`));
  const daysGroup = useName('daysGroup');

  return (
    <SVG width={1000} height={800}>
      {/* Define Gradients for styling */}
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

      <Padding all={20}>
        <Group>
          {/* Resolution information */}
          <Row spacing={100} alignment="middle" name={resolution}>
            {displayedResolutions.map((resolution) =>
              resolution.selected === true ? (
                <SelectedResolution resolutionName={resolution.name} />
              ) : (
                <ComposeText contents={resolution.name} fontSize="20" fill="#717171" />
              ),
            )}
          </Row>

          {/* Content excluding resolution information */}
          <Group name={mainContent} x={0}>
            <Group name={daysGroup}>
              {dayToSleepBars.map((dayToSleepBar, ind) =>
                dayToSleepBar.selected === true ? (
                  <Padding top={10} bottom={0} left={0} right={0} name={days[ind]}>
                    <ComposeText contents={dayToSleepBar.day} key={`day-${ind}`} x={0} />
                  </Padding>
                ) : (
                  <ComposeText contents={dayToSleepBar.day} key={`day-${ind}`} name={days[ind]} x={0} />
                ),
              )}
            </Group>

            {/* Hours container */}
            <Contain padding={{ left: 30, right: 30, top: 15, bottom: 15 }} name={hours}>
              <Rect fill="url(#hoursBarGradient)" rx="15px" />
              <Row spacing={60} alignment="middle">
                {displayedHours.map((hour, ind) => (
                  <ComposeText contents={hour.toString()} key={`hour-${ind}`} />
                ))}
              </Row>
            </Contain>

            {/* Distribute hours row horizontally from days */}
            <Distribute spacing={50} direction={'horizontal'}>
              <Ref to={daysGroup} />
              <Ref to={hours} />
            </Distribute>

            {/* Distribute hours row vertically from days */}
            <Distribute spacing={30} direction={'vertical'}>
              <Ref to={hours} />
              <Ref to={daysGroup} />
            </Distribute>

            {/* Rectangles for individual sleep bars */}
            <Distribute spacing={10} direction={'vertical'} name={sleepBarContainer}>
              {dayToSleepBars.map((dayToSleepBar, ind) => (
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

            {/* Distribute sleep bar rectangles vertically from hours */}
            <Distribute spacing={30} direction={'vertical'}>
              <Ref to={hours} />
              <Ref to={sleepBarContainer} />
            </Distribute>

            {/* Align right of hours and sleep bars */}
            <Align alignment="right">
              <Ref to={hours} />
              {sleepBars.map((sleepBar) => (
                <Ref to={sleepBar} />
              ))}
            </Align>

            {/* Align hour texts to individual sleep bars */}
            {dayToSleepBars.map((dayToSleepBar, ind) => (
              <Align alignment={dayToSleepBar.selected ? 'top' : 'centerVertically'}>
                <Ref to={days[ind]} />
                <Ref to={sleepBars[ind]} />
              </Align>
            ))}
          </Group>

          {/* Center the resolution bar to the main content */}
          <Align alignment="centerHorizontally">
            <Ref to={resolution} />
            <Ref to={mainContent} />
          </Align>

          {/* Distribute main content vertically from resolution bar */}
          <Distribute direction="vertical" spacing={30}>
            <Ref to={resolution} />
            <Ref to={mainContent} />
          </Distribute>
        </Group>
      </Padding>
    </SVG>
  );
});
