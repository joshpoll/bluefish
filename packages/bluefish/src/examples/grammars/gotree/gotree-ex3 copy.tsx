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
  encoding?: {
    node?: React.ComponentType<NodeProps<T>>;
  };
}>;

export const Tree = withBluefish(<T,>({ data, encoding }: TreeProps<T>) => {
  const { value, subtrees = [] } = data;
  const NodeEncoding = encoding?.node ?? Node;

  const node = useName('node');
  const subtreeGroup = useName('subtrees');
  const subtreeNames = useNameList(_.range(subtrees.length).map((i) => `child-${i}`));

  return (
    <Group>
      <NodeEncoding name={node} value={value} />
      <Row name={subtreeGroup} alignment="top" spacing={10}>
        {subtrees.map((child, i) => (
          <Tree name={subtreeNames[i]} data={child} encoding={encoding as any} />
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

export const Tree3 = withBluefish(function _Tree<T>({ data, encoding }: TreeProps<T>) {
  const { value, subtrees } = data;
  const NodeEncoding = encoding?.node ?? Node;

  const node = useName('node');
  const subtreesName = useName('subtrees');
  const childNames = useNameList(_.range(subtrees?.length || 0).map((i) => `child-${i}`));

  return (
    <Group>
      {/* we extracted out the node */}
      <NodeEncoding name={node} value={value} />
      <Row name={subtreesName} alignment={'top'} spacing={10}>
        {(subtrees || []).map((child, i) => (
          // we're passing the encoding down to the children. there are ways to remove this
          // boilerplate (or at least replace it with different boilerplate...)
          <Tree3 name={childNames[i]} data={child} encoding={encoding as any} /> /* TODO: remove any... */
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
