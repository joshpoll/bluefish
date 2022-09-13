import { useRef } from 'react';
import { Col } from '../components/Col';
import { Rect } from '../components/Rect';
import { Text } from '../components/Text';
import { Row } from '../components/Row';
import { SVG } from '../components/SVG';
import { Align } from '../components/Align';
import { withGXM } from '../bluefish';

export type CharProps = {
  value: string;
  opId: string;
  deleted: boolean;
  marks: ('italic' | 'bold')[];
};

export const Char = withGXM<CharProps>(
  (_measurables, constraints) => {
    return {
      width: constraints.width ?? 0,
      height: constraints.height ?? 0,
    };
  },
  ({ value, marks, opId }) => {
    const tile = useRef(null);
    const leftHandle = useRef(null);
    const rightHandle = useRef(null);
    const letter = useRef(null);
    const opIdLabel = useRef(null);

    return (
      // <Group>
      <>
        <Rect ref={tile} height={65} width={50} rx={5} fill={'#eee'} />
        <Rect ref={leftHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
        <Rect ref={rightHandle} height={30} width={10} fill={'#fff'} rx={5} stroke={'#ddd'} />
        <Text
          ref={letter}
          contents={value === ' ' ? '␣' : value.toString()}
          fontSize={'30px'}
          fontWeight={marks.includes('bold') ? 'bold' : 'normal'}
          fontStyle={marks.includes('italic') ? 'italic' : 'normal'}
        />
        <Text ref={opIdLabel} contents={opId} fontSize={'12px'} fill={'#999'} />
        <Align center>
          {tile.current}
          {letter.current}
        </Align>
        {/* <Align top>
        {tile}
        {opIdLabel}
      </Align>
      <Align left to={'center'}>
        {tile}
        {leftHandle}
      </Align>
      <Align right to={'center'}>
        {tile}
        {rightHandle}
      </Align> */}
        {/* </Group> */}
      </>
    );
  },
);

// // export type MarkOpProps = {
// //     action: string;
// //     markType: string;
// //     backgroundColor: string;
// //     borderColor: string;
// // };

// // export const MarkOp: React.FC<MarkOpProps> = ({ action, markType, backgroundColor, borderColor }) => {
// //     return (<Group rels={([rect, text]) => <Align center>{rect}{text}</Align>}>
// //         <Rect fill={backgroundColor} stroke={borderColor} rx={5} height={20} />
// //         <Text>{`${action} ${markType}`}</Text>
// //     </Group>)
// // }

// // export type PeritextProps = {
// //     chars: CharProps[];
// // }

// // export const Peritext: React.FC<PeritextProps> = ({ chars }) => {
// //   return (
// //     <SVG width={500} height={500}>
// //         {/* chars */}
// //         <Row spacing={10} alignment={'middle'}>
// //             {chars.map((char) => (
// //               <Char {...char} />
// //             ))}
// //         </Row>
// //       {/* markOps */}
// //       {/* TODO: need to loosen alignment here or even just switch to a spacing component... */}
// //       <Col spacing={8}>
// //         {markOps.map((mo) => (
// //           <MarkOp from={mo.start} end={mo.end}>
// //             {mo.text}
// //           </MarkOp>
// //         ))}
// //       </Col>
// //       {/* markOpsToChars */}
// //       {rels.map(({ start, op, end }) => (
// //         <Line from={start} to={op} />
// //         <Line from={end} to={op} />
// //       ))}
// //     </SVG>
// //   );
// // };
