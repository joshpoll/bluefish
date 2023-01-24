import _ from 'lodash';
import { lookup, PropsWithBluefish, useName, useNameList, withBluefish } from '../../../bluefish';
import { Col, Connector, Group, Rect, Ref, Row, Text, Align } from '../../../main';
import { Circle } from '../../../components/Circle';

export type NodeProps<T> = PropsWithBluefish<{
  value: T;
}>;

export const Node = withBluefish(function _Node<T>({ value }: NodeProps<T>) {
  const circle = useName('circle');
  const text = useName('text');

  return (
    <Group>
      <Circle name={circle} r={25} fill={'#eee'} />
      <Text name={text} contents={`${value}`} fontSize={'20px'} />
      <Align center={[<Ref to={text} />, <Ref to={circle} />]} />
    </Group>
  );
});

type TreeData<T> = {
  value: T;
  subtrees?: TreeData<T>[];
};

export type TreeProps<T> = PropsWithBluefish<{
  data: TreeData<T>;
}>;

export const Tree2 = withBluefish(function _Tree<T>({ data }: TreeProps<T>) {
  const { value, subtrees } = data;

  const node = useName('node');
  const subtreesName = useName('subtrees');
  const childNames = useNameList(_.range(subtrees?.length || 0).map((i) => `child-${i}`));

  return (
    <Group>
      <Node name={node} value={value} />
      <Row name={subtreesName} alignment={'top'} spacing={10}>
        {(subtrees || []).map((child, i) => (
          <Tree2 name={childNames[i]} data={child} />
        ))}
      </Row>
      {subtrees ? (
        <Col alignment={'center'} spacing={20}>
          <Ref to={node} />
          <Ref to={subtreesName} />
        </Col>
      ) : null}
      {(subtrees || []).map((child, i) => (
        <Connector $from={'bottomCenter'} $to={'topCenter'} stroke={'black'} strokeWidth={2}>
          <Ref to={node} />
          <Ref to={lookup(childNames[i], 'node')} />
        </Connector>
      ))}
    </Group>
  );
});
