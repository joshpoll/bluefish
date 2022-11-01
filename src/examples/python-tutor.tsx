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
import { Ref, resolveRef } from '../components/Ref';
import { Group } from '../components/Group';
import { Line } from '../components/Line';
import { Arrow } from '../components/Arrow';
import { Space } from '../components/Space';
import { Connector } from '../components/Connector';
import { Rectangle } from 'paper/dist/paper-core';
import { NewBBox } from '../NewBBox';
import { LinkV2 } from './basic-tree';
import { stringify } from 'querystring';
import { Circle } from '../components/Circle';

export type Point = {
  pointObject: { opId: string } | null;
  name: string;
  value?: string;
  opId: string;
};

export const Variable = forwardRef(({ pointObject, name, value, opId }: Point, ref: any) => {
  const textRef = useRef(null);
  const valueRef = useRef(null);
  const boxRef = useRef(null);
  const boxRefBorderLeft = useRef(null);
  const boxRefBorderBottom = useRef(null);

  const variableRef = useRef(null);
  const fontFamily = 'verdana, arial, helvetica, sans-serif';
  return (
    <Group ref={ref} name={opId}>
      <Space name={variableRef} horizontally by={5}>
        <Text ref={textRef} contents={name.toString()} fontSize={'24px'} fontFamily={fontFamily} fill={'black'} />
        <Rect ref={boxRef} height={40} width={40} fill={'#e2ebf6'} />
      </Space>

      <Rect ref={boxRefBorderLeft} height={40} width={2} fill={'#a6b3b6'} />
      <Rect ref={boxRefBorderBottom} height={2} width={40} fill={'#a6b3b6'} />
      <Text
        ref={valueRef}
        contents={value?.toString() ?? ''}
        fontFamily={fontFamily}
        fontSize={'24px'}
        fill={'black'}
      />
      <Align bottomCenter>
        <Ref to={boxRefBorderBottom} />
        <Ref to={boxRef} />
      </Align>
      <Align centerLeft>
        <Ref to={boxRefBorderLeft} />
        <Ref to={boxRef} />
      </Align>
      <Align center>
        <Ref to={valueRef} />
        <Ref to={boxRef} />
      </Align>
    </Group>
  );
});

export type LinkProps = {
  opId: string;
  start: { opId: string };
  end: { opId: string };
};

export const Link = forwardRef(({ opId, start, end }: LinkProps, ref: any) => {
  const circleRef = useRef(null);
  const groupRef = useRef(null);
  return (
    <Group ref={groupRef}>
      <LinkV2
        ref={ref}
        name={opId}
        $from={'center'}
        $to={'centerLeft'}
        stroke={'cornflowerblue'}
        strokeWidth={3}
        strokeDasharray={0}
      >
        <Ref to={start.opId} />
        <Ref to={end.opId} />
      </LinkV2>
      {/* <Circle ref={circleRef} fill={'#394850'} r={20} cx={20} cy={20} /> */}
      {/* <Align center to={'centerLeft'}>
        <Ref to={start.opId} />
        <Ref to={circleRef} />
      </Align> */}
    </Group>
  );
});

export type ObjectProps = {
  nextObject: { opId: string } | null;
  objectType: string;
  value: string;
  opId: string;
};

export const Objects = forwardRef(({ nextObject, objectType, value, opId }: ObjectProps, ref: any) => {
  const itemRef = useRef(null);
  const boxRef = useRef(null);
  const valueRef = useRef(null);
  const labelRef = useRef(null);
  const zeroRef = useRef(null);
  const oneRef = useRef(null);
  const elemRef = useRef(null);

  const fontFamily = 'verdana, arial, helvetica, sans-serif';

  return (
    <Group ref={ref} name={opId}>
      <Text ref={labelRef} contents={objectType} fontFamily={fontFamily} fontSize={'16px'} fill={'grey'} />

      {/* separate names for each rectangle so that the arrow can go from the center of pointer to the center left of pointed */}
      <Group ref={elemRef}>
        <Rect ref={boxRef} name={`pointer${opId}`} height={60} width={80} fill={'#ffffc6'} stroke={'grey'} />
        <Rect ref={itemRef} name={`pointed${opId}`} height={60} width={80} fill={'#ffffc6'} stroke={'grey'} />
        <Text ref={valueRef} contents={value} fontSize={'24px'} fill={'black'} />
        <Text ref={zeroRef} contents={'0'} fontFamily={fontFamily} fontSize={'16px'} fill={'grey'} />
        <Text ref={oneRef} contents={'1'} fontFamily={fontFamily} fontSize={'16px'} fill={'grey'} />

        <Align center>
          <Ref to={valueRef} />
          <Ref to={itemRef} />
        </Align>

        <Align left to={'centerRight'}>
          <Ref to={boxRef} />
          <Ref to={itemRef} />
        </Align>

        <Align topLeft>
          <Ref to={oneRef} />
          <Ref to={boxRef} />
        </Align>
      </Group>

      <Space vertically by={10}>
        <Ref to={labelRef} />
        <Ref to={elemRef} />
      </Space>
    </Group>
  );
});

export type FillerProp = {
  opId: string;
};

export const Filler = forwardRef(({ opId }: FillerProp, ref: any) => {
  const boxRef = useRef(null);

  return (
    <Group ref={ref} name={opId}>
      <Rect ref={boxRef} height={60} width={160} fill={'#FFFFFF'} />
    </Group>
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
  const frameBorder = useRef(null);
  const fontFamily = 'Andale mono, monospace';

  return (
    <Group ref={ref} name={opId}>
      <Rect ref={frame} height={300} width={200} fill={'#e2ebf6'} />
      <Rect ref={frameBorder} height={300} width={5} fill={'#a6b3b6'} />
      <Text ref={opIdLabel} contents={'Global Frame'} fontSize={'24px'} fontFamily={fontFamily} fill={'black'} />
      <Space name={`frameVariables`} ref={frameVariables} vertically by={10}>
        {variables.map((point) => (
          <Variable {...point} />
        ))}
      </Space>
      <Align centerLeft>
        <Ref to={frameBorder} />
        <Ref to={frame} />
      </Align>
      <Align topCenter>
        <Ref to={opIdLabel} />
        <Ref to={frame} />
      </Align>
      <Align centerRight to={'centerRight'}>
        <Ref to={frame} />
        <Ref to={frameVariables} />
      </Align>
    </Group>
  );
});

export type Level = {
  depth: number;
  nodes: string[]; // id's of nodes
};

// Puts together objects and Global frame

export type PythonTutorProps = {
  variables: Point[];
  opId: string;
  objects: ObjectProps[];
  rows: Level[];
};

export const PythonTutor = forwardRef(({ variables, opId, objects, rows }: PythonTutorProps, ref: any) => {
  const globalFrame = useRef(null);
  const rowRef = useRef(null);

  // lookup map for the yellow objects
  const objMap: Map<string, ObjectProps> = new Map();
  objects.forEach((obj) => objMap.set(obj.opId, obj));
  const objectLinks = objects
    .filter((object) => object.nextObject !== null)
    .map((object, index) => {
      return {
        opId: `objectLink${index}`,
        start: { opId: `pointer${object.opId}` },
        end: { opId: `pointed${object.nextObject!.opId}` },
      };
    });
  const variableLinks = variables
    .filter((variable) => variable.pointObject !== null)
    .map((variable, index) => {
      return {
        opId: `variableLink${index}`,
        start: { opId: variable.opId },
        end: { opId: `pointed${variable.pointObject!.opId}` },
      };
    });

  // For object structure:
  // Rows -> nodes in row; if no node at position, then input is '' in which case Filler object is used
  // Rows (with filler and object components) are wrapped in space components
  // Entire collection of rows / spaces are wrapped in group
  // Group is offset from global frame

  return (
    <SVG width={1000} height={500}>
      <Group ref={ref} name={opId}>
        <GlobalFrame variables={variables} opId={'globalFrame'} ref={globalFrame} />

        <Group ref={rowRef} name={'rows'}>
          <Space name={'rowSpace'} vertically by={100}>
            {rows.map((level, index) => (
              <Row name={`row${index}`} spacing={50} alignment={'middle'}>
                {level.nodes.map((obj) => (obj == '' ? <Filler opId={'fill'} /> : <Objects {...objMap.get(obj)!} />))}
              </Row>
            ))}
          </Space>
        </Group>

        <Space name={'space1'} horizontally by={120}>
          <Ref to={globalFrame} />
          <Ref to={rowRef} />
        </Space>

        <Space name={'space2'} vertically by={-250}>
          <Ref to={globalFrame} />
          <Ref to={rowRef} />
        </Space>

        {objectLinks.map((link) => (
          <Group>
            <Link {...link} />
            {/* <Circle name={link.opId + 'circle'} fill={'#394850'} r={20} /> */}
            {/* <Align left>
              <Ref to={link.opId + 'circle'} />
              <Ref to={link.opId} />
            </Align> */}
          </Group>
        ))}
        {variableLinks.map((link) => (
          <Group>
            <Link {...link} />
            {/* <Circle name={link.opId + 'circle'} fill={'#394850'} r={20} /> */}
            {/* <Align left to={'centerLeft'}>
              <Ref to={link.opId + 'circle'} />
              <Ref to={link.opId} />
            </Align> */}
          </Group>
        ))}
      </Group>
    </SVG>
  );
});
