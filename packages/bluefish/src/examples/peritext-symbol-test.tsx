import { forwardRef, useEffect, useId, useRef, useState } from 'react';
import { Rect } from '../components/Rect';
import { Text } from '../components/Text';
import { Row } from '../components/Row';
import { SVG } from '../components/SVG';
import {
  BBoxWithChildren,
  Measure,
  useBluefishLayoutInternal,
  withBluefish,
  useBluefishContext,
  useName,
  Symbol,
} from '../bluefish';
import { Ref } from '../components/Ref';
import { Group } from '../components/Group';
import { Line } from '../components/Line';
import { Arrow } from '../components/Arrow';
import { Space } from '../components/Space';
import { Connector } from '../components/Connector';
import _ from 'lodash';
import { Align } from '../components/Align';
import { Col } from '../components/Col';
import { useNameList } from '../bluefish';

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
  const tile = useName('tile');
  const opIdLabel = useName('opIdLabel');
  const leftHandle = useName('leftHandle');
  const rightHandle = useName('rightHandle');
  const letter = useName('letter');

  return (
    // TODO: use x and y to position the group
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

export type MarkOpProps = {
  action: string;
  markType: string;
  backgroundColor: string;
  borderColor: string;
  opId: string;
  start: { opId: string };
  end: { opId: string };
};

export const MarkOp: React.FC<MarkOpProps & { symbol?: Symbol }> = withBluefish(function MarkOp({
  action,
  markType,
  backgroundColor,
  borderColor,
  start,
  end,
  opId,
}) {
  const rect = useName('rect');
  const text = useName('text');

  return (
    <Group>
      <Rect symbol={rect} fill={backgroundColor} stroke={borderColor} rx={5} height={20} />
      {/* TODO: text measurement is broken, since the text isn't actually centered */}
      <Text symbol={text} contents={`${action} ${markType}`} />
      {/* ...however, using a rect instead results in a properly centered component */}
      {/* <Rect name={opId + '-text'} ref={textRef} width={50} height={15} fill={'magenta'} /> */}
      <Align left={[<Ref to={rect} />, <Ref to={start.opId} />]} />
      <Align right={[<Ref to={rect} />, <Ref to={end.opId} />]} />
      <Align center={[<Ref to={text} />, <Ref to={text} />]} />
    </Group>
  );
});

export type PeritextProps = {
  chars: CharProps[];
  markOps: MarkOpProps[];
};

export const Peritext: React.FC<PeritextProps & { spacing?: number }> = ({ chars, markOps, spacing }) => {
  const charsList = useName('chars');
  const markOpsList = useName('markOps');

  const markOpNames = useNameList(_.range(markOps.length).map((i) => `markOp-${i}`));
  const charNames = useNameList(chars.map((char) => `char-${char.opId}`));

  return (
    <SVG width={1000} height={500}>
      {/* TODO: if I don't have the group component here, then the refs don't resolve properly... */}
      <Group>
        {/* chars */}
        <Row symbol={charsList} spacing={spacing ? +spacing : 10} alignment={'middle'}>
          {chars.map((char, i) => (
            <CharSymbol symbol={charNames[i]} {...char} />
          ))}
        </Row>
      </Group>
    </SVG>
  );
};

/* TODO: add al this back! */
//  {/* markOps */}
//         {/* TODO: Do I need to extract the aligns out for bbox purposes? */}
//         <Space symbol={markOpsList} vertically by={8}>
//           {markOps.map((markOp, i) => (
//             /* TODO: need to find the ids */
//             <MarkOp symbol={markOpNames[i]} {...markOp} />
//           ))}
//         </Space>
//         {/* space markOps from chars */}
//         <Space vertically by={8}>
//           <Ref to={charsList} />
//           <Ref to={markOpsList} />
//         </Space>
//       </Group>
//       <Group>
//         {/* TODO: need to find the ids */}
//         {markOps.map((markOp) => (
//           // <Connector
//           //   $from={{ the: 'centerLeft', of: markOp.start.opId }}
//           //   $to={{ the: 'centerLeft', of: markOp.opId }}
//           // />
//           <Group>
//             <Connector
//               $from={'centerLeft'}
//               $to={'centerLeft'}
//               stroke={markOp.borderColor}
//               strokeWidth={1}
//               strokeDasharray={3}
//             >
//               <Ref to={markOp.start.opId} />
//               <Ref to={markOp.opId} />
//             </Connector>
//             <Connector
//               $from={'centerRight'}
//               $to={'centerRight'}
//               stroke={markOp.borderColor}
//               strokeWidth={1}
//               strokeDasharray={3}
//             >
//               <Ref to={markOp.end.opId} />
//               <Ref to={markOp.opId} />
//             </Connector>
//           </Group>
//         ))}
