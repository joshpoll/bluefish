import { useName, withBluefish } from '../bluefish';
import { Background } from '../components/Background';
import { ConnectorArrow } from '../components/ConnectorArrow';
import { Distribute } from '../components/Distribute';
import { Align, Circle, Col, Connector, Group, Padding, Rect, Ref, Row, SVG, Text, Arrow } from '../main';

export const Planets = withBluefish(() => {
  const mercury = useName('mercury');
  const label = useName('label');
  const planets = useName('planets');

  return (
    <SVG width={500} height={500}>
      <Padding all={80}>
        <Group>
          <Background>
            <Row spacing={50} alignment="middle" name={planets}>
              <Circle name={mercury} r={15} fill="#EBE3CF" />
              <Circle r={36} fill="#DC933C" />
              <Circle r={38} fill="#179DD7" />
              <Circle r={21} fill="#F1CF8E" />
            </Row>
          </Background>
          <Align alignment="center">
            <Text name={label} contents="Mercury" />
            <Ref select={mercury} />
          </Align>
          <Distribute direction="vertical" spacing={45}>
            <Ref to={label} />
            <Ref to={planets} />
          </Distribute>
					{/*<Arrow>
            <Ref select={label} />
            <Ref select={mercury} />
          </Arrow>*/}
        </Group>
      </Padding>
    </SVG>
  );
});

/*
const [mercury, mercuryBounds] = useMeasure();
const [label, labelBounds] = useMeasure();

<Group>
  <Row spacing={50} alignment="middle">
    <Circle ref={mercury} r={15} fill="#EBE3CF" />
    <Circle r={36} fill="#DC933C" />
    <Circle r={38} fill="#179DD7" />
    <Circle r={21} fill="#F1CF8E" />
  </Row>
  <Text
    ref={label}
    contents="Mercury"
    x={mercuryBounds.centerX - labelBounds.width / 2}
    y={mercuryBounds.top - labelBounds.height - 10}
  />
  <Rect
    x={Math.min(mercuryBounds.left, labelBounds.left)}
    y={Math.min(mercuryBounds.top, labelBounds.top)}
    width={Math.max(mercuryBounds.right, labelBounds.right) - Math.min(mercuryBounds.left, labelBounds.left)}
    height={Math.max(mercuryBounds.bottom, labelBounds.bottom) - Math.min(mercuryBounds.top, labelBounds.top)}
  />
</Group>;
//*/
