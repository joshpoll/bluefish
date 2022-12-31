import { withBluefish3, useSymbol } from '../bluefish';
import { CharProps } from './peritext';
import { Group as Group2 } from '../components/Group2';
import { Rect as Rect2 } from '../components/Rect2';
import { Text as Text2 } from '../components/Text2';
import { Align2 as Align3 } from '../components/Align3';
import { Ref } from '../components/Ref';

export const CharSymbol = withBluefish3(function Char({ value, marks, opId }: CharProps) {
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

  return (
    // TODO: use x and y to position the group
    <Group2 name={opId}>
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
