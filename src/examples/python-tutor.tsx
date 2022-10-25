import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { Col } from '../components/Col';
import { Rect } from '../components/Rect';
import { Text } from '../components/Text';
import { Row } from '../components/Row';
import { SVG } from '../components/SVG';
import { Align, Alignment2D, splitAlignment } from '../components/Align';
import {
  BBoxWithChildren,
  Measure,
  useBluefishLayout,
  withBluefish,
  withBluefishComponent,
  useBluefishContext,
  withBluefishFn,
} from '../bluefish';
import { Ref } from '../components/Ref';
import { Group } from '../components/Group';
import { Line } from '../components/Line';
import { Arrow } from '../components/Arrow';
import { Space } from '../components/Space';
import { Connector } from '../components/Connector';
import { Rectangle } from 'paper/dist/paper-core';
import { NewBBox } from '../NewBBox';
import { LinkV2 } from './basic-tree';

export type Point = {
  pointObject: { opId: string };
  value: string;
  opId: string;
};

export const Variable = forwardRef(({ pointObject, value, opId }: Point, ref: any) => {
  const textRef = useRef(null);
  const boxRef = useRef(null);
  const variableRef = useRef(null);
  return (
    <Group ref={ref} name={opId}>
      <Row name={variableRef} alignment={'middle'} spacing={8}>
        <Text ref={textRef} contents={value.toString()} fontSize={'24px'} fill={'black'} />
        <Rect ref={boxRef} height={40} width={40} fill={'#e2ebf6'} stroke={'grey'} />
      </Row>
      {/* <Align centerLeft>
        <Ref to={boxRef} />
        <Ref to={textRef} />
      </Align> */}
    </Group>
  );
});

export type ObjectProps = {
  nextObject: { opId: string };
  objectType: string;
  value: string;
  opId: string;
};

export type LinkProps = {
  opId: string;
  start: { opId: string };
  end: { opId: string };
};

export const Link = forwardRef(({ opId, start, end }: LinkProps, ref: any) => {
  return (
    <LinkV2
      ref={ref}
      name={opId}
      $from={'centerRight'}
      $to={'centerLeft'}
      stroke={'#000000'}
      strokeWidth={5}
      strokeDasharray={0}
    >
      <Ref to={start.opId} />
      <Ref to={end.opId} />
    </LinkV2>
  );
});

export const Objects = forwardRef(({ nextObject, objectType, value, opId }: ObjectProps, ref: any) => {
  const itemRef = useRef(null);
  const boxRef = useRef(null);
  const valueRef = useRef(null);
  const labelRef = useRef(null);
  const linkRef = useRef(null);

  return (
    <SVG width={500} height={500}>
      <Group ref={ref} name={opId}>
        <Rect ref={boxRef} height={60} width={80} fill={'#ffffc6'} stroke={'grey'} />
        <Rect ref={itemRef} height={60} width={80} fill={'#ffffc6'} stroke={'grey'} />
        <Text ref={valueRef} contents={value} fontSize={'24px'} fill={'black'} />
        <Text ref={labelRef} contents={objectType} fontSize={'16px'} fill={'grey'} />

        <Align center>
          <Ref to={valueRef} />
          <Ref to={itemRef} />
        </Align>

        <Align left to={'centerRight'}>
          <Ref to={boxRef} />
          <Ref to={itemRef} />
        </Align>
      </Group>
      {/* <Link ref={linkRef} opId={'objectLink'} start={{ opId: opId }} end={{ opId: nextObject.opId }} /> */}
    </SVG>
  );
});

// Global frame contains list of variables
// Each variable has either reference to object or value
export type GlobalFrameProps = {
  variables: Point[];
  opId: string;
};

export const GlobalFrame = forwardRef(({ variables, opId }: GlobalFrameProps, ref: any) => {
  const frame = useRef(null);
  const opIdLabel = useRef(null);
  const frameVariables = useRef(null);

  return (
    <Group ref={ref} name={opId}>
      <Rect ref={frame} height={300} width={200} fill={'#e2ebf6'} />
      <Text ref={opIdLabel} contents={'Global Frame'} fontSize={'24px'} fill={'black'} />
      <Col name={`frameVariables`} ref={frameVariables} spacing={20} alignment={'right'}>
        {variables.map((point) => (
          <Variable {...point} />
        ))}
      </Col>

      <Align topCenter>
        <Ref to={opIdLabel} />
        <Ref to={frame} />
      </Align>
      <Align centerRight>
        <Ref to={frameVariables} />
        <Ref to={frame} />
      </Align>
    </Group>
  );
});


// Puts together objects and Global frame

export type PythonTutorProps = {
  variables: Point[];
  opId: string;
  objects: ObjectProps[];
};

export const PythonTutor = forwardRef(({ variables, opId, objects }: PythonTutorProps, ref: any) => {
  const globalFrame = useRef(null);
  const rowRef = useRef(null);

  return (
    <SVG width={500} height={500}>
      <Group ref={ref} name={opId}>
        <GlobalFrame variables={variables} opId={'globalFrame'} ref={globalFrame} />
        <Row ref={rowRef} spacing={50} alignment={'middle'} name={'objectRects'}>
          {objects.map((obj) => (<Objects {...obj} />))}
        </Row>

        {/* <Align left to={'centerRight'}>
                    <Ref to={rowRef} />
                    <Ref to={globalFrame} />
                </Align> */}

        <Space name={'space1'} horizontally by={120}>
          <Ref to={globalFrame} />
          <Ref to={rowRef} />
        </Space>

        <Space name={'space2'} vertically by={-60}>
          <Ref to={globalFrame} />
          <Ref to={rowRef} />
        </Space>

      </Group>
    </SVG>
  );
});