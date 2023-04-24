import { scaleBand, scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import _ from 'lodash';
import { withBluefish, useName, lookup, useNameList, PropsWithBluefish, useNames, Symbol } from '../../bluefish';
import { BarY } from '../grammars/gog/marks/NewBarY';
import { Plot2 as Plot } from '../grammars/gog/Plot';
import { NewDot } from '../grammars/gog/marks/NewDot';
import { NewLine } from '../grammars/gog/marks/NewLine';
import { NewRect } from '../grammars/gog/marks/Rect';
import { Circle, Col, Connector, Group, Padding, Rect, Ref, Row, Text } from '../../main';
import { Align } from '../../components/Align';
import { Distribute } from '../../components/Distribute';
import { Area } from '../grammars/gog/marks/Area';
import { genreCounts, genres, genreSetBoundedSize } from './data';
import { Contain } from '../../components/Contain';

export type StackProps = PropsWithBluefish<{
  direction: 'horizontal' | 'vertical';
  spacing?: number;
  total?: number;
  alignment: 'start' | 'center' | 'end';
}>;

export const Stack = withBluefish((props: StackProps) => {
  const children = props.children as any;

  const horizontalAlignment = { start: 'left', center: 'centerHorizontally', end: 'right' }[props.alignment];
  const verticalAlignment = { start: 'top', center: 'centerVertically', end: 'bottom' }[props.alignment];
  const alignment = props.direction === 'horizontal' ? horizontalAlignment : verticalAlignment;

  return (
    <Group>
      {props.children}
      <Align alignment={alignment as any}>
        {children.map((child: any) => (
          <Ref select={child} />
        ))}
      </Align>
      <Distribute spacing={props.spacing} total={props.total} direction={props.direction}>
        {children.map((child: any) => (
          <Ref select={child} />
        ))}
      </Distribute>
    </Group>
  );
});

export const UpSet = withBluefish(() => {
  const plot = useName('plot');

  const genresGTE = genreSetBoundedSize(6, Infinity);

  // a record of records of dot names. 1st key is the set, 2nd key is the genre
  const dots = useNames(
    genresGTE.reduce((acc, set) => {
      return {
        ...acc,
        [set.genres.join(',')]: genres.reduce((acc, genre) => {
          return {
            ...acc,
            [genre]: 'dot',
          };
        }, {}),
      };
    }, {} as Record<string, Record<string, string>>),
  ) as Record<string, Record<string, Symbol>>;

  // console.log('dots', dots);

  const genreNames = useNameList(genres.map((genre) => `${genre}-name`));

  const matrix = useName('matrix');

  const colNames = useNameList(genresGTE.map((set) => `${set.genres.join(',')}-col`));

  const genreSetBarNames = useNameList(genresGTE.map((set) => `${set.genres.join(',')}-rect`));
  const genreBarNames = useNameList(genres.map((genre) => `${genre}-rect`));

  const genreSetDots = useNames(
    genresGTE.reduce((acc, set) => {
      return {
        ...acc,
        [set.genres.join(',')]: set.genres.reduce((acc, genre) => {
          return {
            ...acc,
            [genre]: 'dot',
          };
        }, {}),
      };
    }, {} as Record<string, Record<string, string>>),
  ) as Record<string, Record<string, Symbol>>;

  return (
    <Padding all={100}>
      <Group>
        <Row name={matrix} spacing={10} alignment="middle">
          {genresGTE.map((set, i) => (
            <Col name={colNames[i]} spacing={10} alignment="center">
              {genres.map((genre) => (
                <Circle name={dots[set.genres.join(',')][genre]} r={3.5} fill="#dedede" />
              ))}
            </Col>
          ))}
        </Row>
        {/* {
        for every genre set, for every genre in the set, draw a dot
      } */}
        {genresGTE.map((set) => {
          return (
            <>
              {set.genres.map((genre) => {
                return (
                  <Align alignment="center">
                    <Ref select={dots[set.genres.join(',')][genre]} />
                    <Circle name={genreSetDots[set.genres.join(',')][genre]} r={3.5} fill="#333333" />
                  </Align>
                );
              })}
              {/* TODO: this is a motivating use case for having connector/link take arb. args instead of just 2 */}
              {/* for each pair of neighboring genres in the set, add a connector between them */}
              {set.genres.map((genre, i) => {
                if (i === set.genres.length - 1) return null;
                return (
                  <Connector $from="center" $to="center" stroke="#333333" strokeWidth={2}>
                    <Ref select={genreSetDots[set.genres.join(',')][genre]} />
                    <Ref select={genreSetDots[set.genres.join(',')][set.genres[i + 1]]} />
                  </Connector>
                );
              })}
            </>
          );
        })}
        {genres.map((genre, i) => (
          <Text name={genreNames[i]} contents={genre} />
        ))}
        <Distribute spacing={50} direction="horizontal">
          <Ref select={genreNames[0]} />
          <Ref select={matrix} />
        </Distribute>
        <Align alignment="left">
          {genres.map((_, i) => (
            <Ref select={genreNames[i]} />
          ))}
        </Align>
        {genres.map((genre, i) => (
          <Align alignment="centerVertically">
            <Ref select={dots[Object.keys(dots)[0]][genre]} />
            <Ref select={genreNames[i]} />
          </Align>
        ))}
        {genresGTE.map((set, i) => (
          <>
            <Distribute direction="vertical" spacing={5}>
              <Rect name={genreSetBarNames[i]} width={10} height={set.count} fill="#333333" />
              <Ref select={colNames[i]} />
            </Distribute>
            <Align alignment="centerHorizontally">
              <Ref select={genreSetBarNames[i]} />
              <Ref select={colNames[i]} />
            </Align>
            {/* <Contain>
              <Ref select={colNames[i]} />
              <Rect fill="none" stroke="magenta" />
            </Contain>
            <Contain>
              <Ref select={genreSetBarNames[i]} />
              <Rect fill="none" stroke="magenta" />
            </Contain> */}
          </>
          // <>
          //   <Rect name={rectNames[i]} width={7} height={set.count} fill="#333333" />
          //   <Stack direction="vertical" spacing={5} alignment="center">
          //     <Ref select={rectNames[i]} />
          //     <Ref select={colNames[i]} />
          //   </Stack>
          // </>
        ))}
        {genreCounts.map((genre, i) => (
          <>
            <Rect name={genreBarNames[i]} width={genre.count} height={10} fill="#333333" />
            <Distribute direction="horizontal" spacing={5}>
              <Ref select={matrix} />
              {/* <Ref select={colNames[i]} /> */}
              <Ref select={genreBarNames[i]} />
              {/* <Ref select={genreNames[i]} /> */}
            </Distribute>
            <Align alignment="centerVertically">
              <Ref select={genreBarNames[i]} />
              <Ref select={genreNames[i]} />
            </Align>
          </>
        ))}
      </Group>
    </Padding>
  );
});
