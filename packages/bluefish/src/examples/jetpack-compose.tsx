import { useName, useNameList, withBluefish } from '../bluefish';
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

const dayToSleepBars = [
  { day: 'Sun', sleep: 7 },
  { day: 'Mon', sleep: 6.5 },
  { day: 'Tue', sleep: 8 },
  { day: 'Wed', sleep: 7 },
  { day: 'Thu', sleep: 7.2 },
  { day: 'Fri', sleep: 8 },
  { day: 'Sat', sleep: 9 },
];

const sleepBarWidth = (sleepTime: number) => 50 * sleepTime;

export const JetpackCompose: React.FC<{}> = withBluefish(() => {
  const resolution = useName('resolution');
  const hours = useName('hours');
  const sleepBarRows = useName('sleepBarRows');
  const sleepBars = useNameList(dayToSleepBars.map((item, i) => `sleepBar-${i}`));

  return (
    <SVG width={1000} height={800}>
      {/* <linearGradient id="sampleGradient">
        <stop offset="0%" stop-color="#F1E9BC" />
        <stop offset="100%" stop-color="#F2E3AC" />
      </linearGradient> */}
      <Padding all={10}>
        <Group>
          <Distribute direction="vertical" spacing={40}>
            <Row spacing={100} alignment="middle" name={resolution}>
              <ComposeText contents="Day" fontSize="20" fill="#717171" />
              <Group>
                <Align alignment="center">
                  <Rect width={80} height={30} fill="#fff" rx="10px" stroke="#EEDFAB" strokeWidth={2} />
                  <ComposeText contents="Week" fontSize="20" />
                </Align>
              </Group>
              <ComposeText contents="Month" fontSize="20" fill="#717171" />
              <ComposeText contents="6M" fontSize="20" fill="#717171" />
            </Row>
            <Group>
              <Align alignment="centerRight">
                <Rect width={450} height={35} fill="#EFD489" rx="10px" />
                <Padding name={hours} left={0} right={20} top={5} bottom={5}>
                  <Row spacing={60} alignment="middle">
                    <ComposeText contents="20" />
                    <ComposeText contents="21" />
                    <ComposeText contents="22" />
                    <ComposeText contents="23" />
                    <ComposeText contents="0" />
                    <ComposeText contents="1" />
                    <ComposeText contents="2" />
                  </Row>
                </Padding>
              </Align>
            </Group>

            <Col spacing={20} alignment="center" name={sleepBarRows}>
              {dayToSleepBars.map((dayToSleepBar, ind) => (
                <Row alignment="middle" totalWidth={600}>
                  <ComposeText contents={dayToSleepBar.day} />
                  <Rect
                    width={sleepBarWidth(dayToSleepBar.sleep)}
                    height={30}
                    fill="#F1E9BC"
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
