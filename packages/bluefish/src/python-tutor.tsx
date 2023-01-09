import { forwardRef, useRef } from 'react';
import { Group, Rect, Space, Align, Ref, SVG, Text } from './main';
import { Col } from './components/Col2';

const Variable = forwardRef(function _Variable({ data }: { data: any }, ref) {
  const { pointObject, name, value, opId } = data;

  // References
  const textRef = useRef(null);
  const valueRef = useRef(null);
  const boxRef = useRef(null);
  const boxRefBorderLeft = useRef(null);
  const boxRefBorderBottom = useRef(null);
  const variableRef = useRef(null);

  // Declares font used in Python Tutor Diagrams
  const fontFamily = 'verdana, arial, helvetica, sans-serif';

  return (
    <Group ref={ref} name={opId}>
      {/* Creates frame of Variable component (text label & box for value) */}
      <Space name={variableRef} horizontally by={5}>
        <Text ref={textRef} contents={name} fontSize={'24px'} fontFamily={fontFamily} fill={'black'} />
        <Rect ref={boxRef} height={40} width={40} fill={'#e2ebf6'} />
      </Space>
      {/* Creates left and bottom edge borders */}
      <Rect ref={boxRefBorderLeft} height={40} width={2} fill={'#a6b3b6'} />
      <Rect ref={boxRefBorderBottom} height={2} width={40} fill={'#a6b3b6'} />
      {/* Creates text labels of variable */}
      <Text ref={valueRef} contents={value} fontFamily={fontFamily} fontSize={'24px'} fill={'black'} />
      {/* Align text and border components to variable frame */}
      <Align bottomCenter={[<Ref to={boxRefBorderBottom} />, <Ref to={boxRef} />]}></Align>
      <Align centerLeft={[<Ref to={boxRefBorderLeft} />, <Ref to={boxRef} />]}></Align>
      <Align topCenter={[<Ref to={valueRef} />, <Ref to={boxRef} />]}></Align>
    </Group>
  );
});

export const GlobalFrame = forwardRef(function _GlobalFrame({ variables, opId }: { variables: any; opId: any }, ref) {
  // References
  const frame = useRef(null);
  const opIdLabel = useRef(null);
  const frameVariables = useRef(null);
  const frameBorder = useRef(null);

  // Font declaration
  const fontFamily = 'Andale mono, monospace';

  return (
    <Group ref={ref} name={opId}>
      {/* Global Frame and relevant text */}
      <Rect ref={frame} height={300} width={200} fill={'#e2ebf6'} />
      <Rect ref={frameBorder} height={300} width={5} fill={'#a6b3b6'} />
      <Text ref={opIdLabel} contents={'Global Frame'} fontSize={'24px'} fontFamily={fontFamily} fill={'black'} />
      <Align topCenter={[<Ref to={opIdLabel} />, <Ref to={frame} />]}></Align>
      {/* TODO: this Space and Align should be a Col, but Col overwrites *all* placeable positions
            even though opIdLabel has already been placed */}
      <Space vertically by={10}>
        <Ref to={opIdLabel} />
        <Col name={`frameVariables`} ref={frameVariables} spacing={10} alignment={'right'}>
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
