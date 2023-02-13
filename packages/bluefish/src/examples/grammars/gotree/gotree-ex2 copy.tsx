import _ from 'lodash';
import { lookup, PropsWithBluefish, useName, useNameList, withBluefish } from '../../../bluefish';
import { Col, Connector, Group, Rect, Ref, Row, Text } from '../../../main';
import { Circle } from '../../../components/Circle';
import { AlignNew as Align } from '../../../components/AlignNew';

export type NodeProps<T> = PropsWithBluefish<{
  value: T;
}>;

export const Node = withBluefish(<T,>({ value }: NodeProps<T>) => {
  return (
    <Align alignment="center">
      <Circle r={25} fill="#eee" />
      <Text contents={`${value}`} fontSize="20px" />
    </Align>
  );
});

type TreeData<T> = {
  value: T;
  subtrees?: TreeData<T>[];
};

export type TreeProps<T> = PropsWithBluefish<{
  data: TreeData<T>;
}>;

export const Tree = withBluefish(<T,>({ data }: TreeProps<T>) => {
  const { value, subtrees = [] } = data;

  const node = useName('node');
  const subtreeGroup = useName('subtrees');
  const subtreeNames = useNameList(_.range(subtrees.length).map((i) => `child-${i}`));

  return (
    <Group>
      <Node name={node} value={value} />
      <Row name={subtreeGroup} alignment="top" spacing={10}>
        {subtrees.map((child, i) => (
          <Tree name={subtreeNames[i]} data={child} />
        ))}
      </Row>
      {subtrees.length > 0 ? (
        <Col alignment="center" spacing={20}>
          <Ref to={node} />
          <Ref to={subtreeGroup} />
        </Col>
      ) : null}
      {subtrees.map((child, i) => (
        <Connector stroke="black" strokeWidth={2}>
          <Ref to={node} guidePrimary="bottomCenter" />
          <Ref to={lookup(subtreeNames[i], 'node')} guidePrimary="topCenter" />
        </Connector>
      ))}
    </Group>
  );
});
