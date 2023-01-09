import { withBluefish, useSymbol, useSymbolArray, lookup } from '../bluefish';
import { CharProps } from './peritext';
import { Group as Group2 } from '../components/Group2';
import { Rect as Rect2 } from '../components/Rect2';
import { Text as Text2 } from '../components/Text2';
import { Align2 as Align3 } from '../components/Align3';
import { Ref } from '../components/Ref';
import { Col } from '../components/Col2';
import { Row } from '../components/Row';
import { Connector } from '../main';
import _ from 'lodash';
import { useEffect, useId } from 'react';

export const CharSymbol = withBluefish(function Char({ value, marks, opId }: CharProps) {
  // const tile = opId + '-tile';
  // const opIdLabel = opId + '-label';
  // const leftHandle = opId + '-leftHandle';
  // const rightHandle = opId + '-rightHandle';
  // const letter = opId + '-letter';
  const tile = useSymbol('tile');
  const opIdLabel = useSymbol('opIdLabel');
  const leftHandle = useSymbol('leftHandle');
  const rightHandle = useSymbol('rightHandle');
  const letter = useSymbol('letter');
  const group = useSymbol('group');

  return (
    // TODO: use x and y to position the group
    // TODO: removing the group symbol here breaks this!
    <Group2 symbol={group} name={opId}>
      <Rect2 symbol={tile} height={65} width={50} rx={5} fill={'#eee'} />
      <Rect2 symbol={leftHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
      <Rect2 symbol={rightHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
      <Text2
        symbol={letter}
        contents={value === ' ' ? '␣' : value.toString()}
        fontSize={'30px'}
        fontWeight={marks.includes('bold') ? 'bold' : 'normal'}
        fontStyle={marks.includes('italic') ? 'italic' : 'normal'}
      />
      <Text2 symbol={opIdLabel} contents={opId} fontSize={'12px'} fill={'#999'} />
      <Align3 center={[<Ref to={letter} />, <Ref to={tile} />]} />
      <Align3 topCenter={[<Ref to={opIdLabel} />, <Ref to={tile} />]} />
      <Align3 center={<Ref to={leftHandle} />} centerLeft={<Ref to={tile} />} />
      <Align3 center={<Ref to={rightHandle} />} centerRight={<Ref to={tile} />} />
    </Group2>
  );
});

type TreeData = {
  name: string;
  value: Omit<CharProps, 'opId' | 'deleted'>;
  subtrees?: TreeData[];
};

export const TreeSymbol = withBluefish(function _Tree({ data }: { data: TreeData }) {
  const { name, value, subtrees } = data;

  const node = useSymbol('node');
  const subtreesName = useSymbol('subtrees');
  // list of indices like [0, 1, 2, ...]
  const childNames = useSymbolArray(_.range(subtrees?.length || 0).map((i) => `child-${i}`));
  const group = useSymbol('group');

  return (
    // TODO: removing the group symbol breaks stuff
    <Group2 symbol={group}>
      <CharSymbol symbol={node} {...value} opId={name} deleted />
      <Row symbol={subtreesName} alignment={'top'} spacing={10}>
        {(subtrees || []).map((child, i) => (
          <TreeSymbol symbol={childNames[i]} data={child} />
        ))}
      </Row>
      {subtrees ? (
        <Col alignment={'center'} spacing={10}>
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
    </Group2>
  );
});
