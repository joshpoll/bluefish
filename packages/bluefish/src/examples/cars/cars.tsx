import { scaleLinear } from 'd3-scale';
import _ from 'lodash';
import { lookup, useName, withBluefish } from '../../bluefish';
import { Contain } from '../../components/Contain';
import { Distribute } from '../../components/Distribute';
import { Align, Col, Connector as Link, Group, Padding, Rect, Ref, Text } from '../../main';
import { NewDot } from '../grammars/gog/marks/NewDot';
import { Plot2 as Plot } from '../grammars/gog/Plot';
import { nonNullData } from './data';

export const Cars0 = withBluefish((props: any) => {
  const maxEfficiency = _.maxBy(nonNullData, 'Miles_per_Gallon')!;
  const indexMaxEfficiency = _.findIndex(nonNullData, maxEfficiency);

  const dots = useName('dots');
  const label = useName('label');
  const maxDot = lookup(dots, `dot-${indexMaxEfficiency}`);

  return (
    <Padding all={20}>
      <Group>
        <Plot
          data={nonNullData}
          x={({ width }) => scaleLinear([0, _.max(nonNullData.map((d) => +d.Horsepower))!], [0, width])}
          y={({ height }) => scaleLinear([0, _.max(nonNullData.map((d) => +d.Miles_per_Gallon))!], [height, 0])}
          color={() => () => 'black'}
        >
          <NewDot name={dots} x="Horsepower" y="Miles_per_Gallon" color="cornflowerblue" stroke="none" />
        </Plot>
      </Group>
    </Padding>
  );
});

export const Cars1 = withBluefish((props: any) => {
  const maxEfficiency = _.maxBy(nonNullData, 'Miles_per_Gallon')!;
  const indexMaxEfficiency = _.findIndex(nonNullData, maxEfficiency);

  const dots = useName('dots');
  const label = useName('label');
  const maxDot = lookup(dots, `dot-${indexMaxEfficiency}`);

  return (
    <Padding all={20}>
      <Group>
        <Plot
          data={nonNullData}
          x={({ width }) => scaleLinear([0, _.max(nonNullData.map((d) => +d.Horsepower))!], [0, width])}
          y={({ height }) => scaleLinear([0, _.max(nonNullData.map((d) => +d.Miles_per_Gallon))!], [height, 0])}
          color={() => () => 'black'}
        >
          <NewDot name={dots} x="Horsepower" y="Miles_per_Gallon" color="cornflowerblue" stroke="none" />
        </Plot>
        <Text name={label} contents={`${maxEfficiency.Miles_per_Gallon}`} />
        <Align alignment="centerVertically">
          <Ref select={maxDot} />
          <Ref select={label} />
        </Align>
        <Distribute direction="horizontal" spacing={5}>
          <Ref select={maxDot} />
          <Ref select={label} />
        </Distribute>
      </Group>
    </Padding>
  );
});

export const Cars2 = withBluefish((props: any) => {
  const maxEfficiency = _.maxBy(nonNullData, 'Miles_per_Gallon')!;
  const indexMaxEfficiency = _.findIndex(nonNullData, maxEfficiency);

  const dots = useName('dots');
  const label = useName('label');
  const maxDot = lookup(dots, `dot-${indexMaxEfficiency}`);
  const plot = useName('plot');

  return (
    <Padding all={20}>
      <Group>
        <Plot
          name={plot}
          data={nonNullData}
          x={({ width }) => scaleLinear([0, _.max(nonNullData.map((d) => +d.Horsepower))!], [0, width])}
          y={({ height }) => scaleLinear([0, _.max(nonNullData.map((d) => +d.Miles_per_Gallon))!], [height, 0])}
          color={() => () => 'black'}
        >
          <NewDot name={dots} x="Horsepower" y="Miles_per_Gallon" color="cornflowerblue" stroke="none" />
        </Plot>
        <Text name={label} contents={`${maxEfficiency.Miles_per_Gallon}`} />
        <Align alignment="centerVertically">
          <Ref select={maxDot} />
          <Ref select={label} />
        </Align>
        <Distribute direction="horizontal" spacing={3.7}>
          <Ref select={plot} />
          <Ref select={label} />
        </Distribute>
        <Link $from="center" $to="center">
          <Ref select={maxDot} />
          <Ref select={label} />
        </Link>
      </Group>
    </Padding>
  );
});

export const Cars3 = withBluefish((props: any) => {
  const maxEfficiency = _.maxBy(nonNullData, 'Miles_per_Gallon')!;
  const indexMaxEfficiency = _.findIndex(nonNullData, maxEfficiency);

  const dots = useName('dots');
  const label = useName('label');
  const maxDot = lookup(dots, `dot-${indexMaxEfficiency}`);
  const plot = useName('plot');
  const link = useName('link');
  const background = useName('background');

  return (
    <Padding all={20}>
      <Group>
        <Rect name={background} />
        <Plot
          name={plot}
          data={nonNullData}
          x={({ width }) => scaleLinear([0, _.max(nonNullData.map((d) => +d.Horsepower))!], [0, width])}
          y={({ height }) => scaleLinear([0, _.max(nonNullData.map((d) => +d.Miles_per_Gallon))!], [height, 0])}
          color={() => () => 'black'}
        >
          <NewDot name={dots} x="Horsepower" y="Miles_per_Gallon" color="cornflowerblue" stroke="none" />
        </Plot>
        <Text name={label} contents={`${maxEfficiency.Miles_per_Gallon}`} />
        <Align alignment="centerVertically">
          <Ref select={maxDot} />
          <Ref select={label} />
        </Align>
        <Distribute direction="horizontal" spacing={5}>
          <Ref select={plot} />
          <Ref select={label} />
        </Distribute>
        <Link name={link}>
          <Ref select={maxDot} />
          <Ref select={label} />
        </Link>
        <Contain padding={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ref select={link} />
          <Ref select={background} />
        </Contain>
      </Group>
    </Padding>
  );
});
