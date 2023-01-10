import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { Rect } from '../components/Rect';
import { Text } from '../components/Text';
import { Text as Text2 } from '../components/Text';
import { Row } from '../components/Row';
import { SVG } from '../components/SVG';
import { BBoxWithChildren, Measure, useBluefishLayout, withBluefish, useBluefishContext, useSymbol } from '../bluefish';
import { Ref } from '../components/Ref';
import { Group } from '../components/Group';
import { Group as Group2 } from '../components/Group';
import { Line } from '../components/Line';
import { Arrow } from '../components/Arrow';
import { Space } from '../components/Space';
import { Connector } from '../components/Connector';
import _ from 'lodash';
import { Align } from '../components/Align';
import { Align as Align3 } from '../components/Align';

export type CharProps = {
  value: string;
  opId: string;
  deleted: boolean;
  marks: ('italic' | 'bold')[];
};

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

  return (
    // TODO: use x and y to position the group
    <Group2 name={opId}>
      <Rect symbol={tile} height={65} width={50} rx={5} fill={'#eee'} />
      <Rect symbol={leftHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
      <Rect symbol={rightHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
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

export type MarkOpProps = {
  action: string;
  markType: string;
  backgroundColor: string;
  borderColor: string;
  opId: string;
  start: { opId: string };
  end: { opId: string };
};

export type PeritextProps = {
  chars: CharProps[];
  markOps: MarkOpProps[];
};

export const Peritext: React.FC<PeritextProps & { spacing?: number }> = ({ chars, markOps, spacing }) => {
  const group = useSymbol('group');
  const charsRow = useSymbol('chars');

  return (
    <SVG width={1000} height={500}>
      {/* TODO: if I don't have the group component here, then the refs don't resolve properly... */}
      <Group2 symbol={group}>
        {/* chars */}
        <Row name={'chars'} spacing={spacing ? +spacing : 10} alignment={'middle'}>
          {chars.map((char) => (
            <CharSymbol {...char} />
          ))}
        </Row>
      </Group2>
    </SVG>
  );
};
