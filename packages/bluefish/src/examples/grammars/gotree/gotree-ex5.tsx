import _ from 'lodash';
import { lookup, PropsWithBluefish, useName, useNameList, withBluefish } from '../../../bluefish';
import { Col, Connector, Group, Rect, Ref, Row, Text, Align } from '../../../main';
import { Circle } from '../../../components/Circle';
import { VerticalAlignment } from '../../../components/Row';
import { HorizontalAlignment } from '../../../components/Col';

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

export type RootSubtreeProps = PropsWithBluefish;

export const RootSubtree = withBluefish(function _RootSubtree({ children }: RootSubtreeProps) {
  return (
    <Col alignment={'center'} spacing={20}>
      {children}
    </Col>
  );
});

export const RELATIONS = {
  row: ({ alignment = 'top', spacing = 10 }: { alignment?: VerticalAlignment; spacing?: number }) =>
    withBluefish(({ children }: PropsWithBluefish) => (
      <Row alignment={alignment} spacing={spacing}>
        {children}
      </Row>
    )),
  col: ({ alignment = 'center', spacing = 20 }: { alignment?: HorizontalAlignment; spacing?: number }) =>
    withBluefish(({ children }: PropsWithBluefish) => (
      <Col alignment={alignment} spacing={spacing}>
        {children}
      </Col>
    )),
};

export type SubtreeSubtreeProps = PropsWithBluefish;

export const SubtreeSubtree = withBluefish(function _SubtreeSubtree({ children }: SubtreeSubtreeProps) {
  return (
    <Row alignment={'top'} spacing={10}>
      {children}
    </Row>
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
    rootSubtree?: React.ComponentType<RootSubtreeProps>;
    subtreeSubtree?: React.ComponentType<SubtreeSubtreeProps>;
  };
}>;

export const Tree5 = withBluefish(function _Tree<T>({ data, encoding }: TreeProps<T>) {
  const { value, subtrees } = data;
  const NodeEncoding = encoding?.node ?? Node;
  const LinkEncoding = encoding?.link ?? Link;
  const RootSubtreeEncoding = encoding?.rootSubtree ?? RootSubtree;
  const SubtreeSubtreeEncoding = encoding?.subtreeSubtree ?? SubtreeSubtree;

  const node = useName('node');
  const subtreesName = useName('subtrees');
  const childNames = useNameList(_.range(subtrees?.length || 0).map((i) => `child-${i}`));

  return (
    <Group>
      {/* we extracted out the node */}
      <NodeEncoding name={node} value={value} />
      <SubtreeSubtreeEncoding name={subtreesName}>
        {(subtrees || []).map((child, i) => (
          // we're passing the encoding down to the children. there are ways to remove this
          // boilerplate (or at least replace it with different boilerplate...)
          <Tree5 name={childNames[i]} data={child} encoding={encoding as any} /> /* TODO: remove any... */
        ))}
      </SubtreeSubtreeEncoding>
      {subtrees ? (
        <RootSubtreeEncoding>
          <Ref to={node} />
          <Ref to={subtreesName} />
        </RootSubtreeEncoding>
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
