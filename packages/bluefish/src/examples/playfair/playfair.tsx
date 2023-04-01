import { scaleBand, scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import _ from 'lodash';
import { withBluefish, useName, lookup, useNameList } from '../../bluefish';
import { BarY } from '../grammars/gog/marks/NewBarY';
import { Plot2 as Plot } from '../grammars/gog/Plot';
import { monarch, wheat } from './data';
import { NewDot } from '../grammars/gog/marks/NewDot';
import { NewLine } from '../grammars/gog/marks/NewLine';
import { NewRect } from '../grammars/gog/marks/Rect';
import { Col, Group, Ref, Text } from '../../main';
import { Align } from '../../components/Align';
import { Distribute } from '../../components/Distribute';
import { Area } from '../grammars/gog/marks/Area';

export const Playfair = withBluefish(() => {
  const plot = useName('plot');
  const monarchName = useName('monarchName');
  const monarchNames = useNameList(monarch.map((m, i) => `rect-${i}`));
  const monarchNameNames = useNameList(monarch.map((m, i) => `text-${i}`));

  // pair up the monarchs
  return (
    <Group>
      <Plot
        name={plot}
        data={wheat}
        x={({ width }) =>
          scaleBand(
            wheat.map((d) => d.year),
            [0, width],
          ).padding(0.1)
        }
        y={({ height }) => scaleLinear([0, _.max(wheat.map((d) => +d.wheat))!], [height, 0])}
        color={() => (x: any) => x}
      >
        <BarY spacing={0} x="year" y="wheat" color="#aaa" stroke="#999" />
        <Area x="year" y="wages" color="#a4cedb" opacity={0.7} />
        <NewLine x="year" y="wages" />
        <NewLine x="year" y="wages" dy={-2} color="#ee8182" />
        <NewRect
          name={monarchName}
          names={monarchNames}
          data={monarch}
          x1="start"
          x2="end"
          height={10}
          color={(d) => (d.commonwealth === true ? 'none' : 'black')}
          stroke="black"
        />
      </Plot>
      <Align alignment="top">
        <Ref select={plot} />
        <Ref select={monarchNames[0]} />
      </Align>
      <Align>
        {monarch.map((m, i) => (
          <Ref select={monarchNames[i]} guidePrimary={i % 2 === 0 || m.commonwealth === true ? 'bottom' : 'top'} />
        ))}
      </Align>
      {monarch.map((m, i) => (
        <>
          <Distribute direction="vertical" spacing={1}>
            <Ref select={monarchNames[i]} />
            <Text name={monarchNameNames[i]} contents={m.name} fontStyle="italic" fontSize="12px" fontFamily="serif" />
          </Distribute>
          <Align alignment="centerHorizontally">
            <Ref select={monarchNames[i]} />
            <Ref select={monarchNameNames[i]} />
          </Align>
        </>
      ))}
    </Group>
  );
});
