import {
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  scaleSequential,
} from "d3-scale";
import _ from "lodash";
import { Col, Group, Rect, SVG, Padding } from "bluefish";
import { BarY, barY, BarYWithBFN } from "../marks/BarY";
import { Plot, Plot2, plotMark } from "../Plot";
import { interpolateBlues } from "d3-scale-chromatic";
import { Line } from "../marks/Line";
import { driving } from "./driving";
import { Dot } from "../marks/Dot";

// see https://observablehq.com/@joshpoll/vvt-gog

const alphabet = [
  { letter: "A", frequency: "0.08167" },
  { letter: "B", frequency: "0.01492" },
  { letter: "C", frequency: "0.02782" },
  { letter: "D", frequency: "0.04253" },
  { letter: "E", frequency: "0.12702" },
  { letter: "F", frequency: "0.02288" },
  { letter: "G", frequency: "0.02015" },
  { letter: "H", frequency: "0.06094" },
  { letter: "I", frequency: "0.06966" },
  { letter: "J", frequency: "0.00153" },
  { letter: "K", frequency: "0.00772" },
  { letter: "L", frequency: "0.04025" },
  { letter: "M", frequency: "0.02406" },
  { letter: "N", frequency: "0.06749" },
  { letter: "O", frequency: "0.07507" },
  { letter: "P", frequency: "0.01929" },
  { letter: "Q", frequency: "0.00095" },
  { letter: "R", frequency: "0.05987" },
  { letter: "S", frequency: "0.06327" },
  { letter: "T", frequency: "0.09056" },
  { letter: "U", frequency: "0.02758" },
  { letter: "V", frequency: "0.00978" },
  { letter: "W", frequency: "0.0236" },
  { letter: "X", frequency: "0.0015" },
  { letter: "Y", frequency: "0.01974" },
  { letter: "Z", frequency: "0.00074" },
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
    <div>
      {/* TODO: stronger notion of local, abstract(?) coordinate system. similar to ggplot */}
      <SVG width={width} height={200}>
        <Padding left={40} top={10} right={20} bottom={30}>
          <Plot2
            data={alphabet}
            width={width}
            height={200}
            margin={{ top: 10, bottom: 30, left: 40, right: 20 }}
            x={({ width }) =>
              scaleBand(
                alphabet.map((d) => d.letter),
                [0, width]
              ).padding(0.1)
            }
            y={({ height }) =>
              scaleLinear(
                [0, _.max(alphabet.map((d) => +d.frequency))!],
                [0, height]
              )
            }
            color={() =>
              scaleSequential(interpolateBlues).domain([
                _.min(alphabet.map((d) => +d.frequency))!,
                _.max(alphabet.map((d) => +d.frequency))!,
              ])
            }
          >
            <BarY
              encodings={{ x: "letter", y: "frequency", color: "frequency" }}
            />
            {/* <BarYWithBFN encodings={{ x: 'letter', y: 'frequency', color: 'frequency' }} /> */}
          </Plot2>
        </Padding>
      </SVG>
      {/* <br />
      <SVG width={1000} height={1000}>
        <Col spacing={0} alignment={'left'}>
          <Rect width={100} height={100} fill={'steelblue'} />
          <Padding all={20}>
            <Rect width={100} height={100} fill={'magenta'} />
          </Padding>
          <Rect width={100} height={100} fill={'steelblue'} />
          <Rect width={100} height={100} fill={'magenta'} />
        </Col>
      </SVG> */}
      {/* <SVG width={1000} height={1000}>
        <Path d="M 10 10 H 90 V 90 H 10 L 10 10" fill="none" stroke="black" />
      </SVG> */}
      <br />
      {/* TODO: Plot2 breaks on this example */}
      <SVG width={width} height={300}>
        <Padding left={40} top={10} right={20} bottom={30}>
          <Plot
            data={driving}
            width={width}
            height={300}
            margin={{ top: 10, bottom: 30, left: 40, right: 20 }}
            x={({ width }) =>
              scaleLinear([0, _.max(driving.map((d) => +d.miles))!], [0, width])
            }
            y={({ height }) =>
              scaleLinear([0, _.max(driving.map((d) => +d.gas))!], [height, 0])
            }
            color={() => () => "black"}
          >
            {/* TODO: remove color field */}
            <Line encodings={{ x: "miles", y: "gas", color: "side" }} />
            <Dot encodings={{ x: "miles", y: "gas", color: "side" }} />
          </Plot>
        </Padding>
      </SVG>
      {/* <SVG width={width} height={300}>
        <Padding top={10} bottom={30} left={40} right={20}>
          <Plot
            data={driving}
            x={scaleLinear([0, _.max(driving.map((d) => +d.miles))!])}
            y={scaleLinear([0, _.max(driving.map((d) => +d.gas))!])}
            color={'black'}
          >
            <Line encodings={{ x: 'miles', y: 'gas', color: 'side' }} />
            <Dot encodings={{ x: 'miles', y: 'gas', color: 'side' }} />
          </Plot>
        </Padding>
      </SVG> */}
    </div>
  );
};
