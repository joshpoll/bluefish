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

export type LinkProps = PropsWithBluefish;

export const Link = withBluefish(function _Link({ children }: LinkProps) {
  return (
    <Connector $from={'bottomCenter'} $to={'topCenter'} stroke={'black'} strokeWidth={2}>
      {children}
    </Connector>
  );
});

type TreeData<T> = {
  value: T;
  subtrees?: TreeData<T>[];
};

export type TreeProps<T> = PropsWithBluefish<{
  data: TreeData<T>;
  // we added an encoding prop
  encoding?: {
    node?: React.ComponentType<NodeProps<T>>;
    link?: React.ComponentType<LinkProps>;
  };
}>;

export const Tree4 = withBluefish(function _Tree<T>({ data, encoding }: TreeProps<T>) {
  const { value, subtrees } = data;
  const NodeEncoding = encoding?.node ?? Node;
  const LinkEncoding = encoding?.link ?? Link;

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
          <Tree4 name={childNames[i]} data={child} encoding={encoding as any} /> /* TODO: remove any... */
        ))}
      </Row>
      {subtrees ? (
        <Col alignment={'center'} spacing={20}>
          <Ref to={node} />
          <Ref to={subtreesName} />
        </Col>
      ) : null}
      {(subtrees || []).map((child, i) => (
        <LinkEncoding>
          <Ref to={node} />
          <Ref to={lookup(childNames[i], 'node')} />
        </LinkEncoding>
      ))}
    </Group>
  );
});
