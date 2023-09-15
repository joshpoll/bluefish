import { useName, withBluefish } from '../bluefish';
import { Background } from '../components/Background';
import { Distribute } from '../components/Distribute';
import { Align, Circle, Col, Connector, Group, Padding, Rect, Ref, Row, SVG, Text } from '../main';

export const Planets = withBluefish(() => {
  const planets = useName('planets');
  const mercury = useName('mercury');
  const label = useName('label');
  const annotationBox = useName('annotationBox');

  return (
    <SVG width={500} height={500}>
      <Padding all={80}>
        <Group>
          <Row spacing={50} alignment="middle" name={planets}>
            <Circle name={mercury} r={15} fill={'#EBE3CF'} strokeWidth={3} stroke={'black'} />
            <Circle r={36} fill={'#DC933C'} strokeWidth={3} stroke={'black'} />

            <Circle r={38} fill={'#179DD7'} strokeWidth={3} stroke={'black'} />
            <Circle r={21} fill={'#F1CF8E'} strokeWidth={3} stroke={'black'} />
          </Row>
          {/* <Col alignment="center" spacing={10} name={annotationBox}>
            <Text
              name={label}
              contents={'Mercury'}
              fontFamily="Alegreya Sans, sans-serif"
              fontWeight={700}
              fontSize={14}
            />
            <Ref select={mercury} />
          </Col> */}

          <Align alignment="centerHorizontally">
            <Text
              name={label}
              contents={'Mercury'}
              fontFamily="Alegreya Sans, sans-serif"
              fontWeight={700}
              fontSize={14}
            />
            <Ref select={mercury} />
          </Align>
          <Distribute direction="vertical" spacing={45}>
            <Ref to={label} />
            <Ref to={planets} />
          </Distribute>

          <Connector stroke={'black'} strokeWidth={3}>
            <Ref select={label} guidePrimary={'bottomCenter'} />
            <Ref select={mercury} guidePrimary={'topCenter'} />
          </Connector>

          <Background padding={{ all: 15 }}>
            <Ref select={planets} />
            <Rect fill="None" strokeWidth={3} stroke="Black" />
          </Background>
          {/* <Background padding={{ left: 10, right: 30, top: 10, bottom: 10 }}>
            <Group>
              <Ref select={label} />
              <Ref select={mercury} />
            </Group>
            <Rect fill="None" strokeWidth={3} stroke="Black" />
          </Background> */}
        </Group>
      </Padding>
    </SVG>
  );
});
