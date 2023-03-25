// import _ from 'lodash';
// import { lookup, PropsWithBluefish, useName, useNameList, withBluefish } from '../../../bluefish';
// import { Col, Connector, Group, Rect, Ref, Row, Text } from '../../../main';
// import { Circle } from '../../../components/Circle';
// import { VerticalAlignment } from '../../../components/Row';
// import { HorizontalAlignment } from '../../../components/Col';
// import { AlignNew as Align } from '../../../components/AlignNew';

// export type NodeProps<T> = PropsWithBluefish<{
//   value: T;
// }>;

// export const Node = withBluefish(<T,>({ value }: NodeProps<T>) => {
//   return (
//     <Align alignment="center">
//       <Circle r={25} fill="#eee" />
//       <Text contents={`${value}`} fontSize="20px" />
//     </Align>
//   );
// });

// type TreeData<T> = {
//   value: T;
//   subtrees?: TreeData<T>[];
// };

// // export const Tree = withBluefish(<T,>({ data, encoding }: TreeProps<T>) => {
// //   const { value, subtrees = [] } = data;
// //   const NodeEncoding = encoding?.node ?? Node;
// //   const LinkEncoding = encoding?.link ?? Link;
// //   const RootSubtreeEncoding = encoding?.rootSubtree ?? RootSubtree;
// //   const SubtreeSubtreeEncoding = encoding?.subtreeSubtree ?? SubtreeSubtree;

// //   const node = useName('node');
// //   const subtreeGroup = useName('subtrees');
// //   const subtreeNames = useNameList(_.range(subtrees.length).map((i) => `child-${i}`));

// //   return (
// //     <Group>
// //       <NodeEncoding name={node} value={value} />
// //       <SubtreeSubtreeEncoding name={subtreeGroup}>
// //         {subtrees.map((child, i) => (
// //           <Tree name={subtreeNames[i]} data={child} encoding={encoding as any} />
// //         ))}
// //       </SubtreeSubtreeEncoding>
// //       {subtrees.length > 0 ? (
// //         <RootSubtreeEncoding>
// //           <Ref to={node} />
// //           <Ref to={subtreeGroup} />
// //         </RootSubtreeEncoding>
// //       ) : null}
// //       {subtrees.map((child, i) => (
// //         <LinkEncoding>
// //           <Ref to={node} guidePrimary="bottomCenter" />
// //           <Ref to={lookup(subtreeNames[i], 'node')} guidePrimary="topCenter" />
// //         </LinkEncoding>
// //       ))}
// //     </Group>
// //   );
// // });

// export type LinkProps = PropsWithBluefish;

// export const Link = withBluefish(function _Link({ children }: LinkProps) {
//   return (
//     <Connector stroke="black" strokeWidth={2}>
//       {children}
//     </Connector>
//   );
// });

// export type RootSubtreeProps = PropsWithBluefish;

// export const RootSubtree = withBluefish(({ children }: RootSubtreeProps) => {
//   return (
//     <Col alignment="center" spacing={20}>
//       {children}
//     </Col>
//   );
// });

// export const RELATIONS = {
//   row: ({ alignment = 'top', spacing = 10 }: { alignment?: VerticalAlignment; spacing?: number }) =>
//     withBluefish(({ children }: PropsWithBluefish) => (
//       <Row alignment={alignment} spacing={spacing}>
//         {children}
//       </Row>
//     )),
//   col: ({ alignment = 'center', spacing = 20 }: { alignment?: HorizontalAlignment; spacing?: number }) =>
//     withBluefish(({ children }: PropsWithBluefish) => (
//       <Col alignment={alignment} spacing={spacing}>
//         {children}
//       </Col>
//     )),
// };

// export type SubtreeSubtreeProps = PropsWithBluefish;

// export const SubtreeSubtree = withBluefish(({ children }: SubtreeSubtreeProps) => {
//   return (
//     <Row alignment="top" spacing={10}>
//       {children}
//     </Row>
//   );
// });

// type Relation =
//   | {
//       row: { alignment?: VerticalAlignment; spacing?: number };
//     }
//   | {
//       col: { alignment?: HorizontalAlignment; spacing?: number };
//     };

// export type TreeProps<T> = PropsWithBluefish<{
//   data: TreeData<T>;
//   encoding?: {
//     node?: React.ComponentType<NodeProps<T>>;
//     link?: React.ComponentType<LinkProps>;
//     rootSubtree?: Relation;
//     subtreeSubtree?: Relation;
//   };
// }>;

// const compileRelation = (relation: Relation) => {
//   if ('row' in relation) {
//     return RELATIONS.row(relation.row);
//   } else {
//     return RELATIONS.col(relation.col);
//   }
// };

// export const Tree5 = withBluefish(function _Tree<T>({ data, encoding }: TreeProps<T>) {
//   const { value, subtrees } = data;
//   const NodeEncoding = encoding?.node ?? Node;
//   const LinkEncoding = encoding?.link ?? Link;
//   const RootSubtreeEncoding = compileRelation(
//     encoding?.rootSubtree ?? {
//       col: {
//         alignment: 'center',
//         spacing: 20,
//       },
//     },
//   );
//   const SubtreeSubtreeEncoding = compileRelation(
//     encoding?.subtreeSubtree ?? {
//       row: {
//         alignment: 'top',
//         spacing: 10,
//       },
//     },
//   );

//   const node = useName('node');
//   const subtreesName = useName('subtrees');
//   const childNames = useNameList(_.range(subtrees?.length || 0).map((i) => `child-${i}`));

//   return (
//     <Group>
//       {/* we extracted out the node */}
//       <NodeEncoding name={node} value={value} />
//       <  name={subtreesName}>
//         {(subtrees || []).map((child, i) => (
//           // we're passing the encoding down to the children. there are ways to remove this
//           // boilerplate (or at least replace it with different boilerplate...)
//           <Tree5 name={childNames[i]} data={child} encoding={encoding as any} /> /* TODO: remove any... */
//         ))}
//       </SubtreeSubtreeEncoding>
//       {subtrees ? (
//         <RootSubtreeEncoding>
//           <Ref to={node} />
//           <Ref to={subtreesName} />
//         </RootSubtreeEncoding>
//       ) : null}
//       {(subtrees || []).map((child, i) => (
//         <LinkEncoding>
//           <Ref to={node} />
//           <Ref to={lookup(childNames[i], 'node')} />
//         </LinkEncoding>
//       ))}
//     </Group>
//   );
// });

export default {};
