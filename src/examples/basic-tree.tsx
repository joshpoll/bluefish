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
    <LinkV2
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
    </LinkV2>
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

export type FlexTreeProps = {
  spacing: number; // spacing between each level of tree
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
      {levels.map((level, index) => (
        <Row name={`level${index}`} spacing={20} alignment={'middle'}>
          {level.nodes.map((node) => (
            <Node {...nodesMap.get(node)!} />
          ))}
        </Row>
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
    </SVG>
  );
});

export const FlexTree = forwardRef(({ spacing, nodes, parentChild, levels }: FlexTreeProps, ref: any) => {
  // const nodesRef = useRef(null);
  const links = parentChild.map((pair, index) => {
    return { opId: `link${index}`, start: { opId: pair.parent.opId }, end: { opId: pair.child.opId } };
  });
  console.log(links);
  const nodesMap: Map<string, NodeProps> = new Map();

  nodes.forEach((node) => nodesMap.set(node.opId, node));
  console.log(nodesMap);

  return (
    <SVG width={2000} height={2000}>
      <Row spacing={spacing} alignment={'top'}>
        {levels.map((level, index: number) => (
          <Col name={`col${index}`} spacing={20} alignment={'center'}>
            {level.nodes.map((node) => (
              <Node {...nodesMap.get(node)!} />
            ))}
          </Col>
        ))}
      </Row>

      {links.map((link) => (
        <FlexLink {...link} />
      ))}
    </SVG>
  );
});

export type LinkV2Props = React.SVGProps<SVGLineElement> & {
  $from: Alignment2D;
  $to: Alignment2D;
};

export const LinkV2 = withBluefishFn(
  (props): Measure => {
    return (measurables, constraints: any) => {
      const [from, to] = measurables.map((m) => m.measure(constraints));
      const [fromYDir, fromXDir] = splitAlignment(props.$from);
      const [toYDir, toXDir] = splitAlignment(props.$to);

      let fromX, fromY, toX, toY;
      if (fromXDir === 'left') {
        fromX = from.left;
      } else if (fromXDir === 'right') {
        fromX = from.right;
      } else {
        fromX = from.left! + from.width! / 2;
      }

      if (fromYDir === 'top') {
        fromY = from.top;
      } else if (fromYDir === 'bottom') {
        fromY = from.bottom;
      } else {
        fromY = from.top! + from.height! / 2;
      }

      if (toXDir === 'left') {
        toX = to.left;
      } else if (toXDir === 'right') {
        toX = to.right;
      } else {
        toX = to.left! + to.width! / 2;
      }

      if (toYDir === 'top') {
        toY = to.top;
      } else if (toYDir === 'bottom') {
        toY = to.bottom;
      } else {
        toY = to.top! + to.height! / 2;
      }

      return {
        left: fromX,
        top: fromY,
        right: toX,
        bottom: toY,
      };
    };
  },
  (props: LinkV2Props & { $bbox?: Partial<NewBBox> }) => {
    const { $bbox, $from, $to, ...rest } = props;
    return <line {...rest} x1={$bbox?.left ?? 0} x2={$bbox?.right ?? 0} y1={$bbox?.top ?? 0} y2={$bbox?.bottom ?? 0} />;
  },
);

export const ParseTree = forwardRef(({ spacing, nodes, parentChild, levels }: FlexTreeProps, ref: any) => {
  // const nodesRef = useRef(null);
  const links = parentChild.map((pair, index) => {
    return { opId: `link${index}`, start: { opId: pair.parent.opId }, end: { opId: pair.child.opId } };
  });
  console.log(links);
  const nodesMap: Map<string, NodeProps> = new Map();

  nodes.forEach((node) => nodesMap.set(node.opId, node));
  console.log(nodesMap);

  return (
    <SVG width={1500} height={1500}>
      <Group>
        <Col name={'combiner'} alignment={'center'} spacing={100}>
          {levels.map((level, index) => (
            <Group name={`level${index}`}>
              <Row name={`row${index}`} spacing={20} alignment={'middle'}>
                {level.nodes.map((node) => (
                  <Node {...nodesMap.get(node)!} />
                ))}
              </Row>
            </Group>
          ))}
        </Col>

        {/* <Group>
          <Space name={'space-level1'} vertically by={130}>
            <Ref to={'level0'} />
            <Ref to={'level1'} />
          </Space>

          <Space name={'space-level2'} vertically by={260}>
            <Ref to={'level0'} />
            <Ref to={'level2'} />
          </Space>
        </Group> */}

        {links.map((link) => (
          <Link {...link} />
        ))}
      </Group>
    </SVG>
  );
});
