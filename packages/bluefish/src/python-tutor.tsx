import { forwardRef, useRef } from 'react';
import { Group, Rect, Space, Align, Ref, SVG, Text } from './main';
import { Col } from './components/Col';
import { useName, withBluefish } from './bluefish';

const Variable = withBluefish(function _Variable({ data }: { data: any }) {
  const { pointObject, name, value, opId } = data;

  // References
  const valueName = useName('value');
  const box = useName('box');
  const boxBorderLeft = useName('boxBorderLeft');
  const boxBorderBottom = useName('boxBorderBottom');
  const variable = useName('variable');

  // Declares font used in Python Tutor Diagrams
  const fontFamily = 'verdana, arial, helvetica, sans-serif';

  return (
    <Group>
      {/* Creates frame of Variable component (text label & box for value) */}
      <Space symbol={variable} horizontally by={5}>
        <Text contents={name} fontSize={'24px'} fontFamily={fontFamily} fill={'black'} />
        <Rect symbol={box} height={40} width={40} fill={'#e2ebf6'} />
      </Space>
      {/* Creates left and bottom edge borders */}
      <Rect symbol={boxBorderLeft} height={40} width={2} fill={'#a6b3b6'} />
      <Rect symbol={boxBorderBottom} height={2} width={40} fill={'#a6b3b6'} />
      {/* Creates text labels of variable */}
      <Text symbol={valueName} contents={value} fontFamily={fontFamily} fontSize={'24px'} fill={'black'} />
      {/* Align text and border components to variable frame */}
      <Align bottomCenter={[<Ref to={boxBorderBottom} />, <Ref to={box} />]}></Align>
      <Align centerLeft={[<Ref to={boxBorderLeft} />, <Ref to={box} />]}></Align>
      <Align topCenter={[<Ref to={valueName} />, <Ref to={box} />]}></Align>
    </Group>
  );
});

export const GlobalFrame = withBluefish(function _GlobalFrame({ variables, opId }: { variables: any; opId: any }) {
  // References
  const frame = useName('frame');
  const opIdLabel = useName('opIdLabel');
  const frameVariables = useName('frameVariables');
  const frameBorder = useName('frameBorder');

  // Font declaration
  const fontFamily = 'Andale mono, monospace';

  return (
    <Group>
      {/* Global Frame and relevant text */}
      <Rect symbol={frame} height={300} width={200} fill={'#e2ebf6'} />
      <Rect symbol={frameBorder} height={300} width={5} fill={'#a6b3b6'} />
      <Text symbol={opIdLabel} contents={'Global Frame'} fontSize={'24px'} fontFamily={fontFamily} fill={'black'} />
      <Align topCenter={[<Ref to={opIdLabel} />, <Ref to={frame} />]}></Align>
      {/* TODO: this Space and Align should be a Col, but Col overwrites *all* placeable positions
            even though opIdLabel has already been placed */}
      <Space vertically by={10}>
        <Ref to={opIdLabel} />
        <Col symbol={frameVariables} spacing={10} alignment={'right'}>
          {variables.map((variable: any) => (
            <Variable data={variable} />
          ))}
        </Col>
      </Space>
      <Align right={[<Ref to={frameVariables} />, <Ref to={opIdLabel} />]}></Align>
      <Align centerLeft={[<Ref to={frameBorder} />, <Ref to={frame} />]}></Align>
    </Group>
  );
});
