import _ from 'lodash';
import { lookup, PropsWithBluefish, useName, useNameList, withBluefish } from '../../../bluefish';
import { Col, Connector, Group, Rect, Ref, Row, Text } from '../../../main';
import { AlignNew as Align } from '../../../components/AlignNew';
import { Circle } from '../../../components/Circle';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateReds, interpolateBlues } from 'd3-scale-chromatic';
import { Contain } from '../../../components/Contain';

type TreeData = {
  value: number;
  subtrees?: TreeData[];
};

export type NodeProps = PropsWithBluefish<{ value: number }>;

export type TreeProps = PropsWithBluefish<{
  data: TreeData;
  encoding: {
    node: React.ComponentType<NodeProps>;
    link: React.ComponentType<PropsWithBluefish>;
    rootSubTree: React.ComponentType<PropsWithBluefish>;
    subTreeSubTree: React.ComponentType<PropsWithBluefish>;
  };
}>;

export const circle = withBluefish(({ value }: NodeProps) => {
  const colorScale = scaleSequential(interpolateBlues).domain([-0.2, 1.1]);

  return <Circle r={25} fill={colorScale(value)} />;
});

export const rect = withBluefish(({ value }: NodeProps) => {
  const colorScale = scaleSequential(interpolateReds).domain([-0.2, 1.1]);

  const widthScale = scaleLinear().domain([1, 0]).range([0, 200]);

  return <Rect width={widthScale(value)} height={50} fill={colorScale(value)} />;
});

export const text = withBluefish(({ value }: NodeProps) => {
  return (
    <Contain>
      <Circle r={20} fill="white" /* stroke="black" */ />
      <Text contents={`${value}`} />;
    </Contain>
  );
});

export const link = withBluefish(({ children }: PropsWithBluefish) => {
  return (
    <Connector $from={'center'} $to={'topCenter'} stroke={'black'} strokeWidth={2}>
      {children}
    </Connector>
  );
});

export const none = withBluefish(({ children }: PropsWithBluefish) => {
  return <>{children}</>;
});

export const row = (props?: any) => {
  const alignment = props?.alignment ?? 'top';
  const spacing = props?.spacing ?? 10;

  return withBluefish(({ children }: PropsWithBluefish) => (
    <Row alignment={alignment} spacing={spacing}>
      {children}
    </Row>
  ));
};

export const col = (props?: any) => {
  const alignment = props?.alignment ?? 'center';
  const spacing = props?.spacing ?? 20;

  return withBluefish(({ children }: PropsWithBluefish) => (
    <Col alignment={alignment} spacing={spacing}>
      {children}
    </Col>
  ));
};

export const Tree3 = withBluefish(({ data, encoding }: TreeProps) => {
  const { value, subtrees = [] } = data;

  const node = useName('node');
  const subtreeGroup = useName('subtrees');
  const subtreeNames = useNameList(_.range(subtrees.length).map((i) => `child-${i}`));

  return (
    <Group>
      <encoding.node name={node} value={value} />
      <encoding.rootSubTree name={subtreeGroup}>
        {subtrees.map((child, i) => (
          <Tree3 name={subtreeNames[i]} data={child} encoding={encoding} />
        ))}
      </encoding.rootSubTree>
      {subtrees.length > 0 ? (
        <encoding.subTreeSubTree>
          <Ref select={node} />
          <Ref select={subtreeGroup} />
        </encoding.subTreeSubTree>
      ) : null}
      {subtrees.map((_, i) => (
        <encoding.link>
          <Ref select={node} guidePrimary="center" />
          <Ref select={lookup(subtreeNames[i], 'node')} guidePrimary="topCenter" />
        </encoding.link>
      ))}
      {/* overdraw */}
      <Align alignment="center">
        <Ref select={node} />
        <encoding.node value={value} />
      </Align>
    </Group>
  );
});
