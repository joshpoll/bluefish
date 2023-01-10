import { withBluefish, useSymbol, useSymbolArray, lookup } from '../bluefish';
import { CharProps } from './peritext';
import { Group } from '../components/Group';
import { Rect } from '../components/Rect';
import { Text } from '../components/Text';
import { Align } from '../components/Align';
import { Ref } from '../components/Ref';
import { Col } from '../components/Col';
import { Row } from '../components/Row';
import { Connector } from '../main';
import _ from 'lodash';
import { useEffect, useId } from 'react';

export const CharSymbol = withBluefish(function Char({ value, marks, opId }: CharProps) {
  const tile = useSymbol('tile');
  const opIdLabel = useSymbol('opIdLabel');
  const leftHandle = useSymbol('leftHandle');
  const rightHandle = useSymbol('rightHandle');
  const letter = useSymbol('letter');

  return (
    // TODO: use x and y to position the group
    // TODO: removing the group symbol here breaks this!
    <Group>
      <Rect symbol={tile} height={65} width={50} rx={5} fill={'#eee'} />
      <Rect symbol={leftHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
      <Rect symbol={rightHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
      <Text
        symbol={letter}
        contents={value === ' ' ? '␣' : value.toString()}
        fontSize={'30px'}
        fontWeight={marks.includes('bold') ? 'bold' : 'normal'}
        fontStyle={marks.includes('italic') ? 'italic' : 'normal'}
      />
      <Text symbol={opIdLabel} contents={opId} fontSize={'12px'} fill={'#999'} />
      <Align center={[<Ref to={letter} />, <Ref to={tile} />]} />
      <Align topCenter={[<Ref to={opIdLabel} />, <Ref to={tile} />]} />
      <Align center={<Ref to={leftHandle} />} centerLeft={<Ref to={tile} />} />
      <Align center={<Ref to={rightHandle} />} centerRight={<Ref to={tile} />} />
    </Group>
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
  const childNames = useSymbolArray(_.range(subtrees?.length || 0).map((i) => `child-${i}`));

  return (
    <Group>
      {/* <Rect symbol={node} height={65} width={50} rx={5} fill={'#eee'} /> */}
      <CharSymbol symbol={node} {...value} opId={name} deleted />
      <Row symbol={subtreesName} alignment={'top'} spacing={10}>
        {(subtrees || []).map((child, i) => (
          <TreeSymbol symbol={childNames[i]} data={child} />
        ))}
      </Row>
      {subtrees ? (
        <Col /* symbol={col} */ alignment={'center'} spacing={10}>
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
