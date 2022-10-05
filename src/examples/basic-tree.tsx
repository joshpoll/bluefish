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
import { Rectangle } from 'paper/dist/paper-core';

export type NodeProps = {
  value: string;
  opId: string;
};

export const Node = forwardRef(({ value, opId }: NodeProps, ref: any) => {
  const nodeCircle = useRef(null);
  const letter = useRef(null);

  return (
    <Group ref={ref} name={opId}>
      <Rect ref={nodeCircle} height={100} width={100} rx={40} fill={'#ADD8E6'} />
      <Text ref={letter} contents={value.toString()} fontSize={'50px'} fontWeight={'bold'} fontStyle={'normal'} />
      <Align center>
        <Ref to={letter} />
        <Ref to={nodeCircle} />
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
  return (
    <Connector
      ref={ref}
      name={opId}
      $from={'bottomCenter'}
      $to={'topCenter'}
      stroke={'#000000'}
      strokeWidth={5}
      strokeDasharray={0}
    >
      <Ref to={start.opId} />
      <Ref to={end.opId} />
    </Connector>
  );
});

// a link for a flex tree that goes horizontally from a start node to an end node
export const FlexLink = forwardRef(({ opId, start, end }: LinkProps, ref: any) => {
  return (
    <Connector
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
    </Connector>
  );
});

export type ParentChild = {
  parent: { opId: string };
  child: { opId: string };
};

export type Level = {
  depth: number;
  nodes: string[]; // id's of nodes
};

export type TreeProps = {
  nodes: NodeProps[];
  parentChild: ParentChild[];
  levels: Level[];
};

export const Tree = forwardRef(({ nodes, parentChild, levels }: TreeProps, ref: any) => {
  const nodesRef = useRef(null);
  const links = parentChild.map((pair, index) => {
    return { opId: `link${index}`, start: { opId: pair.parent.opId }, end: { opId: pair.child.opId } };
  });
  const nodesMap: Map<string, NodeProps> = new Map();

  nodes.forEach((node) => nodesMap.set(node.opId, node));

  return (
    <SVG width={1500} height={1500}>
      <Group>
        {/* hacky, fix later ; also not exactly sure why i need a group*/}
        {levels.map((level, index) => (
          <Group name={`level${index}`}>
            <Row name={`row${index}`} spacing={20} alignment={'middle'}>
              {level.nodes.map((node) => (
                <Node {...nodesMap.get(node)!} />
              ))}
            </Row>
          </Group>
        ))}
        <Space name={'space-levels'} vertically by={200}>
          <Ref to={'level0'} />
          <Ref to={'level1'} />
        </Space>

        {/* <Col name={'nodes'} ref={nodesRef} spacing={20} alignment={'center'}>
          {nodes.map((node) => (
            <Node {...node} />
          ))}
        </Col> */}
        {links.map((link) => (
          <Link {...link} />
        ))}
      </Group>
    </SVG>
  );
});

export const FlexTree = forwardRef(({ nodes, parentChild, levels }: TreeProps, ref: any) => {
  // const nodesRef = useRef(null);
  const links = parentChild.map((pair, index) => {
    return { opId: `link${index}`, start: { opId: pair.parent.opId }, end: { opId: pair.child.opId } };
  });
  const nodesMap: Map<string, NodeProps> = new Map();

  nodes.forEach((node) => nodesMap.set(node.opId, node));

  console.log('level keys: ', levels.keys());

  return (
    <SVG width={2000} height={2000}>
      <Group>
        {levels.map((level, index: number) => (
          <Group name={`level${index}`}>
            <Col name={`col${index}`} spacing={20} alignment={'center'}>
              {level.nodes.map((node) => (
                <Node {...nodesMap.get(node)!} />
              ))}
            </Col>
          </Group>
        ))}

        {/* {Array.from(Array(levels.length - 1).keys()).map((level: number) => (
          <Space name={`space-level-${level}`} horizontally by={200}>
            <Ref to={`level${level + 1}`} />
            <Ref to={`level${level}`} />
          </Space>
        ))} */}

        {/* extract this out into actual logic */}
        <Space name={'space-levels-0'} horizontally by={600}>
          <Ref to={'level0'} />
          <Ref to={'level3'} />
        </Space>
        <Space name={'space-levels-1'} horizontally by={400}>
          <Ref to={'level0'} />
          <Ref to={'level2'} />
        </Space>
        <Space name={'space-levels-2'} horizontally by={200}>
          <Ref to={'level0'} />
          <Ref to={'level1'} />
        </Space>

        {/* <Space name={'space-levels-2'} horizontally by={200}>
          <Ref to={'level3'} />
          <Ref to={'level2'} />
        </Space> */}

        {/* <Col name={'nodes'} ref={nodesRef} spacing={20} alignment={'center'}>
          {nodes.map((node) => (
            <Node {...node} />
          ))}
        </Col> */}
        {links.map((link) => (
          <FlexLink {...link} />
        ))}
      </Group>
    </SVG>
  );
});
