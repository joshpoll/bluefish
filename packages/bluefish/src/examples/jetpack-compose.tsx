import { useName, useNameList, withBluefish } from '../bluefish';
import { Contain } from '../components/Contain';
import { Distribute } from '../components/Distribute';
import { Rect } from '../components/Rect';
import { SVG } from '../components/SVG';
import { Align, Col, Group, Padding, Ref, Row, Text } from '../main';

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
  { day: 'Sun', sleep: 7, selected: true },
  { day: 'Mon', sleep: 6.5 },
  { day: 'Tue', sleep: 8 },
  { day: 'Wed', sleep: 7 },
  { day: 'Thu', sleep: 7.2 },
  { day: 'Fri', sleep: 8 },
  { day: 'Sat', sleep: 9 },
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
          <stop offset={`${colorOffset.offset}%`} stop-color={colorOffset.color} />
        ))}
      </linearGradient>
    </g>
  );
});

export const JetpackCompose: React.FC<{}> = withBluefish(() => {
  const resolution = useName('resolution');
  const hours = useName('hours');
  const sleepBarRows = useName('sleepBarRows');
  const sleepBars = useNameList(dayToSleepBars.map((item, i) => `sleepBar-${i}`));
  const selectedResolution = useName('selectedResolution');
  const selectedResolutionRect = useName('selectedResolutionRect');

  const hoursBarLength = displayedHours.length * 70 + 10;

  return (
    <SVG width={1000} height={800}>
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
          <Distribute direction="vertical" spacing={50}>
            <Row spacing={100} alignment="middle" name={resolution}>
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
            <Group>
              {/* make this a contain */}
              <Align alignment="centerRight">
                <Rect width={hoursBarLength} height={40} fill="url(#hoursBarGradient)" rx="10px" />
                <Padding name={hours} left={0} right={50} top={5} bottom={5}>
                  <Row spacing={60} alignment="middle">
                    {displayedHours.map((hour) => (
                      <ComposeText contents={hour.toString()} />
                    ))}
                  </Row>
                </Padding>
              </Align>
            </Group>

            {/* Make a sort of plot where the rectangles scale */}
            <Col spacing={20} alignment="center" name={sleepBarRows}>
              {dayToSleepBars.map((dayToSleepBar, ind) => (
                <Row alignment={dayToSleepBar.selected === true ? 'top' : 'middle'} totalWidth={hoursBarLength + 80}>
                  <ComposeText contents={dayToSleepBar.day} />
                  <Rect
                    width={sleepBarWidth(dayToSleepBar.sleep)}
                    height={dayToSleepBar.selected === true ? 80 : 30}
                    fill="url(#sleepBarGradient)"
                    rx="10px"
                    name={sleepBars[ind]}
                  />
                </Row>
              ))}
            </Col>
          </Distribute>
          <Align x={0} alignment="right">
            <Ref to={hours} />
            <Ref to={sleepBarRows} />
          </Align>

          <Align x={0} alignment="centerHorizontally">
            <Ref to={resolution} />
            <Ref to={sleepBarRows} />
          </Align>
        </Group>
      </Padding>
    </SVG>
  );
});
