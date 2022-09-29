import { scaleBand, scaleLinear, scaleOrdinal, scaleSequential } from 'd3-scale';
import _ from 'lodash';
import { Col } from '../../../../components/Col';
import { Group } from '../../../../components/Group';
import { Rect } from '../../../../components/Rect';
import { SVG } from '../../../../components/SVG';
import { barY } from '../marks/BarY';
import { plot } from '../Plot';
import { interpolateBlues } from 'd3-scale-chromatic';

// see https://observablehq.com/@joshpoll/vvt-gog

const alphabet = [
  { letter: 'A', frequency: '0.08167' },
  { letter: 'B', frequency: '0.01492' },
  { letter: 'C', frequency: '0.02782' },
  { letter: 'D', frequency: '0.04253' },
  { letter: 'E', frequency: '0.12702' },
  { letter: 'F', frequency: '0.02288' },
  { letter: 'G', frequency: '0.02015' },
  { letter: 'H', frequency: '0.06094' },
  { letter: 'I', frequency: '0.06966' },
  { letter: 'J', frequency: '0.00153' },
  { letter: 'K', frequency: '0.00772' },
  { letter: 'L', frequency: '0.04025' },
  { letter: 'M', frequency: '0.02406' },
  { letter: 'N', frequency: '0.06749' },
  { letter: 'O', frequency: '0.07507' },
  { letter: 'P', frequency: '0.01929' },
  { letter: 'Q', frequency: '0.00095' },
  { letter: 'R', frequency: '0.05987' },
  { letter: 'S', frequency: '0.06327' },
  { letter: 'T', frequency: '0.09056' },
  { letter: 'U', frequency: '0.02758' },
  { letter: 'V', frequency: '0.00978' },
  { letter: 'W', frequency: '0.0236' },
  { letter: 'X', frequency: '0.0015' },
  { letter: 'Y', frequency: '0.01974' },
  { letter: 'Z', frequency: '0.00074' },
];

const abstractSpace = {
  X: alphabet.map((d) => d.letter),
  Y: alphabet.map((d) => d.frequency),
};

const linearDomain = [0, _.max(alphabet.map((d) => +d.frequency))!];
const linearRange = [100, 0];
const linearScale = scaleLinear(linearDomain, linearRange);

const width = 800;

const ordinalDomain = alphabet.map((d) => d.letter);
const ordinalRange = [0, width];
const ordinalScale = scaleBand(ordinalDomain, ordinalRange);

export const GoGTest: React.FC<{}> = ({}) => {
  return (
    <SVG width={width} height={500}>
      <Group>
        <Col spacing={20} alignment={'center'}>
          <Group>
            {alphabet.map((d, i) => {
              console.log(
                '[data]',
                abstractSpace.X[i],
                abstractSpace.Y[i],
                ordinalScale(abstractSpace.X[i]),
                linearScale(+abstractSpace.Y[i]),
              );
              return (
                <Rect
                  x={ordinalScale(abstractSpace.X[i])}
                  y={linearScale(+abstractSpace.Y[i])}
                  width={ordinalScale.bandwidth()}
                  height={linearScale(0) - linearScale(+abstractSpace.Y[i])}
                  fill={'steelblue'}
                />
              );
            })}
          </Group>
          <Group>
            {plot(
              barY(alphabet, { x: 'letter', y: 'frequency', color: 'frequency' } as any),
              {
                xScale: ({ width }: any) =>
                  scaleBand(
                    alphabet.map((d) => d.letter),
                    [0, width],
                  ).padding(0.1),
                yScale: ({ height }: any) => scaleLinear([0, _.max(alphabet.map((d) => +d.frequency))!], [height, 0]),
                // colorScale: () => () => 'black',
                colorScale: () =>
                  scaleSequential(interpolateBlues).domain([
                    _.min(alphabet.map((d) => +d.frequency))!,
                    _.max(alphabet.map((d) => +d.frequency))!,
                  ]),
              },
              { width: width, height: 200 },
            )}
          </Group>
        </Col>
      </Group>
    </SVG>
  );
};
