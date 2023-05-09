import { useName, withBluefish } from '../../bluefish';
import { Align } from '../../components/Align';
import { Group } from '../../components/Group';
import { Rect } from '../../components/Rect';
import { Ref } from '../../components/Ref';
import { Row } from '../../components/Row';
import { Text } from '../../components/Text';

export const Variable = withBluefish(function _Variable({ data }: { data: any }) {
  const { pointObject, name, value, opId } = data;

  // References
  const valueName = useName(`value-${opId}`);
  const box = useName(`box-${opId}`);
  const boxBorderLeft = useName(`boxBorderLeft-${opId}`);
  const boxBorderBottom = useName(`boxBorderBottom-${opId}`);

  console.log('creating variable:', opId);

  // Declares font used in Python Tutor Diagrams
  const fontFamily = 'verdana, arial, helvetica, sans-serif';

  return (
    <Group name={opId}>
      {/* Creates frame of Variable component (text label & box for value) */}
      <Row spacing={5} alignment="middle">
        <Text contents={name} fontSize={'24px'} fontFamily={fontFamily} fill={'black'} />
        <Rect name={box} height={40} width={40} fill={'#e2ebf6'} />
      </Row>
      {/* Creates left and bottom edge borders */}
      <Rect name={boxBorderLeft} height={40} width={2} fill={'#a6b3b6'} />
      <Rect name={boxBorderBottom} height={2} width={40} fill={'#a6b3b6'} />
      {/* Creates text labels of variable */}
      <Text name={valueName} contents={value} fontFamily={fontFamily} fontSize={'24px'} fill={'black'} />
      {/* Align text and border components to variable frame */}
      <Align alignment="bottomCenter">
        <Ref to={boxBorderBottom} />
        <Ref to={box} />
      </Align>
      <Align alignment="centerLeft">
        <Ref to={boxBorderLeft} />
        <Ref to={box} />
      </Align>
      <Align alignment="topCenter">
        <Ref to={valueName} />
        <Ref to={box} />
      </Align>
    </Group>
  );
});
