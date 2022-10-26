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
import _ from 'lodash';

export type CharProps = {
  value: string;
  opId: string;
  deleted: boolean;
  marks: ('italic' | 'bold')[];
};

export const Char = forwardRef(function Char({ value, marks, opId }: CharProps, ref: any) {
  const tile = useRef(null);
  const leftHandle = useRef(null);
  const rightHandle = useRef(null);
  const letter = useRef(null);
  const opIdLabel = useRef(null);

  return (
    // TODO: use x and y to position the group
    <Group ref={ref} name={opId}>
      <Rect ref={tile} name={opId + '-rect'} height={65} width={50} rx={5} fill={'#eee'} />
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

export const MarkOp: React.FC<MarkOpProps> = forwardRef(function MarkOp(
  { action, markType, backgroundColor, borderColor, start, end, opId },
  ref: any,
) {
  const rectRef = useRef(null);
  const textRef = useRef(null);

  return (
    <Group>
      <Group ref={ref} name={opId}>
        <Rect name={opId + '-rect'} ref={rectRef} fill={backgroundColor} stroke={borderColor} rx={5} height={20} />
        {/* TODO: text measurement is broken, since the text isn't actually centered */}
        <Text name={opId + '-text'} ref={textRef} contents={`${action} ${markType}`} />
        {/* ...however, using a rect instead results in a properly centered component */}
        {/* <Rect name={opId + '-text'} ref={textRef} width={50} height={15} fill={'magenta'} /> */}
        <Align name={opId + '-align-1'} left>
          <Ref to={rectRef} />
          <Ref to={start.opId} />
        </Align>
        <Align name={opId + '-align-2'} right>
          <Ref to={rectRef} />
          <Ref to={end.opId} />
        </Align>
        <Align name={opId + '-align-3'} center>
          <Ref to={textRef} />
          <Ref to={rectRef} />
        </Align>
      </Group>
      {/* make a row component and a column component */}
      <Row spacing={10} alignment={'bottom'} name={opId + '-row'}>
        <Rect name={opId + '-row-rect'} fill={'#eee'} />
        <Rect name={opId + '-row-rect-2'} fill={'#eee'} />
      </Row>
      <Col totalHeight={50} alignment={'center'} name={opId + '-col'}>
        <Rect name={opId + '-col-rect'} fill={'#eee'} />
        <Rect name={opId + '-col-rect-2'} fill={'#eee'} />
      </Col>
      {/* align the two components */}
      <Align name={opId + '-align-4'} center>
        <Ref to={opId + '-row'} />
        <Ref to={opId + '-col'} />
      </Align>
    </Group>

    // proposed API:
    // <Group rels={({ rect, text }) => (<>
    //   <Align left>
    //       <Ref to={startRef} />
    //       {rect}
    //     </Align>
    //     <Align right>
    //       <Ref to={endRef} />
    //       {rect}
    //     </Align>
    //     <Align center>
    //       {rect}
    //       {text}
    //     </Align>
    //   </>)}>
    //   {/* TODO: remove width */}
    //   <Rect name={'rect'} fill={backgroundColor} stroke={borderColor} rx={5} width={50} height={20} />
    //   <Text name={'text'} contents={`${action} ${markType}`} />
    // </Group>

    // <Group ref={ref} name={opId}>
    //   {/* TODO: remove width */}
    //   <Rect ref={rectRef} fill={backgroundColor} stroke={borderColor} rx={5} width={50} height={20} />
    //   <Text ref={textRef} contents={`${action} ${markType}`} />
    //   {/* TODO: starting to think the naming is backwards. currently second arg to align mutates, but first doesn't.
    //       maybe I should flip them?
    //     Rationale: Read it as "align first to second," which implies that the first is mutated. */}
    //   <Align left>
    //     <Ref to={rectRef} />
    //     <Ref to={startRef} />
    //   </Align>
    //   <Align right>
    //     <Ref to={rectRef} />
    //     <Ref to={endRef} />
    //   </Align>
    //   <Align center>
    //     <Ref to={textRef} />
    //     <Ref to={rectRef} />
    //   </Align>
    //   <Arrow from={startRef} to={rectRef} />
    //   <Arrow from={rectRef} to={endRef} />
    // </Group>
  );
});

export type PeritextProps = {
  chars: CharProps[];
  markOps: MarkOpProps[];
};

export const Peritext: React.FC<PeritextProps & { spacing?: number }> = ({ chars, markOps, spacing }) => {
  const charsRef = useRef(null);
  const markOpsRef = useRef(null);

  const context = useBluefishContext();

  return (
    <SVG width={1000} height={500}>
      {/* TODO: if I don't have the group component here, then the refs don't resolve properly... */}
      <Group name={'group'}>
        {/* chars */}
        <Row name={'chars'} ref={charsRef} spacing={spacing ? +spacing : 10} alignment={'middle'}>
          {chars.map((char) => (
            <Char {...char} />
          ))}
        </Row>
        {/* markOps */}
        <Space name={'markOps'} ref={markOpsRef} vertically by={8}>
          {markOps.map((markOp) => (
            <MarkOp {...markOp} />
          ))}
        </Space>
        {/* space markOps from chars */}
        <Space name={'space test'} vertically by={8}>
          <Ref to={charsRef} />
          <Ref to={markOpsRef} />
        </Space>
        <Group>
          {markOps.map((markOp) => (
            // <Connector
            //   $from={{ the: 'centerLeft', of: markOp.start.opId }}
            //   $to={{ the: 'centerLeft', of: markOp.opId }}
            // />
            <Group>
              <Connector
                $from={'centerLeft'}
                $to={'centerLeft'}
                stroke={markOp.borderColor}
                strokeWidth={1}
                strokeDasharray={3}
              >
                <Ref to={markOp.start.opId} />
                <Ref to={markOp.opId} />
              </Connector>
              <Connector
                $from={'centerRight'}
                $to={'centerRight'}
                stroke={markOp.borderColor}
                strokeWidth={1}
                strokeDasharray={3}
              >
                <Ref to={markOp.end.opId} />
                <Ref to={markOp.opId} />
              </Connector>
            </Group>
          ))}
        </Group>
      </Group>
    </SVG>
  );
};
