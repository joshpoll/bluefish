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
        <Distribute direction="horizontal" spacing={5}>
          <Ref select={plot} />
          <Ref select={label} />
        </Distribute>
        <Link $from="centerRight" $to="centerLeft" stroke="black" strokeWidth={2}>
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
        <Link name={link} $from="centerRight" $to="centerLeft" stroke="black" strokeWidth={2}>
          <Ref select={maxDot} />
          <Ref select={label} />
        </Link>
        <Rect name={background} fill="goldenrod" opacity={0.7} />
        <Align alignment="left">
          <Ref select={background} />
          <Ref select={link} />
        </Align>
        <Align alignment="right">
          <Ref select={background} />
          <Ref select={link} />
        </Align>
        <Align alignment="top">
          <Ref select={background} />
          <Ref select={link} />
        </Align>
        <Align alignment="bottom">
          <Ref select={background} />
          <Ref select={link} />
        </Align>
        {/* <Contain>
          <Ref select={link} />
        </Contain> */}
      </Group>
    </Padding>
  );
});
