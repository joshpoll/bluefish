import _ from 'lodash';
import { lookup, PropsWithBluefish, useName, useNameList, withBluefish } from '../../../bluefish';
import { Col, Connector, Group, Rect, Ref, Row, Text } from '../../../main';
import { Align } from '../../../components/Align';
import { Circle } from '../../../components/Circle';
import { scaleSequential } from 'd3-scale';
import { interpolateReds, interpolateBlues } from 'd3-scale-chromatic';
import { Contain } from '../../../components/Contain';

type TreeData = {
  value: number;
  subtrees?: TreeData[];
};

export type NodeProps = PropsWithBluefish<{ value: number; leaf?: boolean }>;

export type TreeProps = PropsWithBluefish<{
  data: TreeData;
  encoding: {
    node: React.ComponentType<NodeProps>;
    link: React.ComponentType<PropsWithBluefish>;
    rootSubTree: React.ComponentType<PropsWithBluefish>;
    subTreeSubTree: React.ComponentType<PropsWithBluefish>;
  };
  overdraw?: boolean;
}>;

export const CircleNode = withBluefish(({ value }: NodeProps) => {
  const colorScale = scaleSequential(interpolateBlues).domain([-0.2, 1.1]);

  return <Circle r={25} fill={colorScale(value)} />;
});

export const RectNode = withBluefish(({ value }: NodeProps) => {
  const colorScale = scaleSequential(interpolateReds).domain([-0.2, 1.1]);

  return <Rect width={50} height={50} fill={colorScale(value)} />;
});

export const TextNode = withBluefish(({ value }: NodeProps) => {
  return (
    <Contain padding={{ all: 10 }}>
      <Circle fill="white" />
      <Text contents={`${value}`} />;
    </Contain>
  );
});

export const Tree4 = withBluefish(({ data, encoding, overdraw }: TreeProps) => {
  const { value, subtrees = [] } = data;

  const node = useName('node');
  const subtreeGroup = useName('subtrees');
  const subtreeNames = useNameList(_.range(subtrees.length).map((i) => `child-${i}`));

  return (
    <Group>
      <encoding.node name={node} value={value} leaf={subtrees.length === 0} />
      <encoding.subTreeSubTree name={subtreeGroup}>
        {subtrees.map((child, i) => (
          <Tree4 name={subtreeNames[i]} data={child} encoding={encoding} />
        ))}
      </encoding.subTreeSubTree>
      {subtrees.length > 0 ? (
        <encoding.rootSubTree>
          <Ref select={node} />
          <Ref select={subtreeGroup} />
        </encoding.rootSubTree>
      ) : null}
      {subtrees.map((_, i) => (
        <encoding.link>
          <Ref select={node} />
          <Ref select={lookup(subtreeNames[i], 'node')} />
        </encoding.link>
      ))}
      {/* overdraw */}
      {overdraw !== false ? (
        <Align alignment="center">
          <Ref select={node} />
          <encoding.node value={value} />
        </Align>
      ) : null}
    </Group>
  );
});
