import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { Col } from '../components/Col';
import { Rect } from '../components/Rect';
import { Text } from '../components/Text';
import { Row } from '../components/Row';
import { SVG } from '../components/SVG';
import { Align } from '../components/Align';
import {
  BBoxWithChildren,
  Measure,
  useBluefishLayout,
  withBluefish,
  withBluefishComponent,
  useBluefishContext,
} from '../bluefish';
import { Ref } from '../components/Ref';
import { Group } from '../components/Group';
import { Line } from '../components/Line';
import { Arrow } from '../components/Arrow';
import { Space } from '../components/Space';
import { Connector } from '../components/Connector';

export type CharProps = {
  value: string;
  opId: string;
  deleted: boolean;
  marks: ('italic' | 'bold')[];
};

export const Char = forwardRef(({ value, marks, opId }: CharProps, ref: any) => {
  const tile = useRef(null);
  const leftHandle = useRef(null);
  const rightHandle = useRef(null);
  const letter = useRef(null);
  const opIdLabel = useRef(null);

  return (
    // TODO: use x and y to position the group
    <Group ref={ref} name={opId}>
      <Rect ref={tile} height={65} width={50} rx={5} fill={'#eee'} />
      <Rect ref={leftHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
      <Rect name={'rightHandle'} ref={rightHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
      <Text
        ref={letter}
        contents={value === ' ' ? '␣' : value.toString()}
        fontSize={'30px'}
        fontWeight={marks.includes('bold') ? 'bold' : 'normal'}
        fontStyle={marks.includes('italic') ? 'italic' : 'normal'}
      />
      <Text ref={opIdLabel} contents={opId} fontSize={'12px'} fill={'#999'} />
      <Align center>
        <Ref to={letter} />
        <Ref to={tile} />
      </Align>
      <Align topCenter>
        <Ref to={opIdLabel} />
        <Ref to={tile} />
      </Align>
      <Align center to={'centerLeft'}>
        <Ref to={leftHandle} />
        <Ref to={tile} />
      </Align>
      <Align center to={'centerRight'}>
        <Ref to={rightHandle} />
        <Ref to={tile} />
      </Align>
    </Group>
  );
});

export type MarkOpProps = {
  action: string;
  markType: string;
  backgroundColor: string;
  borderColor: string;
  opId: string;
  start: { opId: string };
  end: { opId: string };
};

export const MarkOp: React.FC<MarkOpProps> = forwardRef(
  ({ action, markType, backgroundColor, borderColor, start, end, opId }, ref: any) => {
    const rectRef = useRef(null);
    const textRef = useRef(null);

    return (
      <Group ref={ref} name={opId}>
        <Rect name={opId + '-rect'} ref={rectRef} fill={backgroundColor} stroke={borderColor} rx={5} height={20} />
        <Text name={opId + '-text'} ref={textRef} contents={`${action} ${markType}`} />
        <Align name={'align me!'} left>
          <Ref to={rectRef} />
          <Ref to={start.opId} />
        </Align>
        <Align right>
          <Ref to={rectRef} />
          <Ref to={end.opId} />
        </Align>
        <Align center>
          <Ref to={textRef} />
          <Ref to={rectRef} />
        </Align>
      </Group>
    );
  },
);

export type PeritextProps = {
  chars: CharProps[];
  markOps: MarkOpProps[];
};

export const Peritext: React.FC<PeritextProps> = ({ chars, markOps }) => {
  const charsRef = useRef(null);
  const markOpsRef = useRef(null);

  return (
    <SVG width={1000} height={500}>
      {/* chars */}
      <Row ref={charsRef} spacing={15} alignment={'middle'}>
        {chars.map((char) => (
          <Char {...char} />
        ))}
      </Row>
      {/* markOps */}
      <Space ref={markOpsRef} vertically by={8}>
        {markOps.map((markOp) => (
          <MarkOp {...markOp} />
        ))}
      </Space>
      {/* space markOps from chars */}
      <Space vertically by={8}>
        <Ref to={charsRef} />
        <Ref to={markOpsRef} />
      </Space>
      <Group>
        {markOps.map((markOp) => (
          <Group>
            <Connector $from={'centerLeft'} $to={'centerLeft'}>
              <Ref to={markOp.start.opId} />
              <Ref to={markOp.opId} />
            </Connector>
            <Connector $from={'centerRight'} $to={'centerRight'}>
              <Ref to={markOp.end.opId} />
              <Ref to={markOp.opId} />
            </Connector>
          </Group>
        ))}
      </Group>
    </SVG>
  );
};
