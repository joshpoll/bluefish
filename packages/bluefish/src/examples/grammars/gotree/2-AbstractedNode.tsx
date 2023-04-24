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

export type NodeProps = PropsWithBluefish<{ value: number }>;

export type TreeProps = PropsWithBluefish<{
  data: TreeData;
  $node: React.ComponentType<NodeProps>;
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

export const Tree2 = withBluefish(({ data, $node }: TreeProps) => {
  const { value, subtrees = [] } = data;

  const node = useName('node');
  const subtreeGroup = useName('subtrees');
  const subtreeNames = useNameList(_.range(subtrees.length).map((i) => `child-${i}`));

  return (
    <Group>
      <$node name={node} value={value} />
      <Row name={subtreeGroup} alignment="top" spacing={10}>
        {subtrees.map((child, i) => (
          <Tree2 name={subtreeNames[i]} data={child} $node={$node} />
        ))}
      </Row>
      {subtrees.length > 0 ? (
        <Col alignment="center" spacing={20}>
          <Ref select={node} />
          <Ref select={subtreeGroup} />
        </Col>
      ) : null}
      {subtrees.map((_, i) => (
        <Connector stroke="black" strokeWidth={2}>
          <Ref select={node} guidePrimary="center" />
          <Ref select={lookup(subtreeNames[i], 'node')} guidePrimary="topCenter" />
        </Connector>
      ))}
      {/* overdraw */}
      <Align alignment="center">
        <Ref select={node} />
        <$node value={value} />
      </Align>
    </Group>
  );
});
