import _ from 'lodash';
import { lookup, PropsWithBluefish, useName, useNameList, withBluefish } from '../../../bluefish';
import { Col, Connector, Group, Padding, Rect, Ref, Row, Text } from '../../../main';
import { AlignNew as Align } from '../../../components/AlignNew';
import { Circle } from '../../../components/Circle';
import { scaleSequential } from 'd3-scale';
import { interpolateReds, interpolateBlues } from 'd3-scale-chromatic';

type TreeData = {
  value: number;
  subtrees?: TreeData[];
};

export type TreeProps = PropsWithBluefish<{
  data: TreeData;
}>;

export const Tree1 = withBluefish(({ data }: TreeProps) => {
  const { value, subtrees = [] } = data;

  const colorScale = scaleSequential(interpolateBlues).domain([-0.2, 1.1]);

  const node = useName('node');
  const subtreeGroup = useName('subtrees');
  const subtreeNames = useNameList(_.range(subtrees.length).map((i) => `child-${i}`));

  return (
    <Group>
      <Circle name={node} r={25} fill={colorScale(value)} />
      <Row name={subtreeGroup} alignment="top" spacing={10}>
        {subtrees.map((child, i) => (
          <Tree1 name={subtreeNames[i]} data={child} />
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
        <Circle r={25} fill={colorScale(value)} />
      </Align>
    </Group>
  );
});
