import { withBluefish, useName, useNameList, lookup } from '../bluefish';
import { CharProps } from './peritext-symbol-test';
import { Group } from '../components/Group';
import { Rect } from '../components/Rect';
import { Text } from '../components/Text';
import { Align } from '../components/Align';
import { Ref } from '../components/Ref';
import { Col } from '../components/Col';
import { Row } from '../components/Row';
import { Connector } from '../main';
import _ from 'lodash';

export const CharSymbol = withBluefish(function Char({ value, marks, opId }: CharProps) {
  const tile = useName('tile');
  const opIdLabel = useName('opIdLabel');
  const leftHandle = useName('leftHandle');
  const rightHandle = useName('rightHandle');
  const letter = useName('letter');

  return (
    // TODO: use x and y to position the group
    <Group>
      <Rect name={tile} height={65} width={50} rx={5} fill={'#eee'} />
      <Rect name={leftHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
      <Rect name={rightHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
      <Text
        name={letter}
        contents={value === ' ' ? '␣' : value.toString()}
        fontSize={'30px'}
        fontWeight={marks.includes('bold') ? 'bold' : 'normal'}
        fontStyle={marks.includes('italic') ? 'italic' : 'normal'}
      />
      <Text name={opIdLabel} contents={opId} fontSize={'12px'} fill={'#999'} />
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

  const node = useName('node');
  const subtreesName = useName('subtrees');
  const childNames = useNameList(_.range(subtrees?.length || 0).map((i) => `child-${i}`));

  return (
    <Group>
      <CharSymbol name={node} {...value} opId={name} deleted />
      <Row name={subtreesName} alignment={'top'} spacing={10}>
        {(subtrees || []).map((child, i) => (
          <TreeSymbol name={childNames[i]} data={child} />
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
    </Group>
  );
});
