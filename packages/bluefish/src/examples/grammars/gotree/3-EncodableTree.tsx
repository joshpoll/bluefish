import _ from 'lodash';
import { Alignment2D, lookup, PropsWithBluefish, useName, useNameList, withBluefish } from '../../../bluefish';
import { Col, Connector, Group, Rect, Ref, Row, Text } from '../../../main';
import { Align } from '../../../components/Align';
import { Circle } from '../../../components/Circle';
import { scaleLinear, scaleSequential } from 'd3-scale';
import { interpolateReds, interpolateBlues, interpolateGreens } from 'd3-scale-chromatic';
import { Contain } from '../../../components/Contain';
import { ColProps } from '../../../components/Col';
import { RowProps } from '../../../components/Row';

type TreeData = {
  value: number;
  subtrees?: TreeData[];
};

export type NodeProps = PropsWithBluefish<{ value: number; leaf: boolean }>;

export type TreeProps = PropsWithBluefish<{
  data: TreeData;
  encoding: {
    node: React.ComponentType<NodeProps>;
    link: React.ComponentType<PropsWithBluefish>;
    rootSubTree: React.ComponentType<PropsWithBluefish>;
    subTreeSubTree: React.ComponentType<PropsWithBluefish>;
  };
  overdraw?: boolean;
}>;

export const circle = withBluefish(({ value }: NodeProps) => {
  const colorScale = scaleSequential(interpolateBlues).domain([-0.2, 1.1]);

  return <Circle r={25} fill={colorScale(value)} />;
});

export const rect = withBluefish(({ value }: NodeProps) => {
  const colorScale = scaleSequential(interpolateReds).domain([-0.2, 1.1]);

  const widthScale = scaleLinear().domain([1, 0]).range([0, 200]);

  return <Rect width={widthScale(value)} height={50} fill={colorScale(value)} />;
});

export const flexibleRect = withBluefish(({ value, leaf }: NodeProps) => {
  const colorScale = scaleSequential(interpolateGreens).domain([-0.5, 1.1]);

  return (
    <Rect
      width={leaf !== true ? undefined : 50}
      height={leaf !== true ? undefined : 50}
      fill={colorScale(value)}
      // stroke={'#d3d3d3'}
      // strokeWidth={2}
    />
  );
});

export const text = withBluefish(({ value }: NodeProps) => {
  return (
    <Contain>
      <Circle fill="white" /* stroke="black" */ />
      <Text contents={`${value}`} />;
    </Contain>
  );
});

export const link = (options?: { from?: Alignment2D; to?: Alignment2D }) =>
  withBluefish(({ children }: PropsWithBluefish) => {
    return (
      <Connector $from={options?.from ?? 'center'} $to={options?.to ?? 'topCenter'} stroke={'black'} strokeWidth={2}>
        {children}
      </Connector>
    );
  });

export const none = ({ children }: PropsWithBluefish) => {
  return <></>;
};

export const row = (props?: RowProps) => {
  const alignment = props?.alignment ?? 'top';
  const spacing = (props as any)?.spacing ?? 10;

  return withBluefish(({ children }: PropsWithBluefish) => (
    <Row alignment={alignment} spacing={spacing}>
      {children}
    </Row>
  ));
};

export const col = (props?: ColProps) => {
  const alignment = props?.alignment ?? 'center';
  const spacing = (props as any)?.spacing ?? 20;

  return withBluefish(({ children }: PropsWithBluefish) => (
    <Col alignment={alignment} spacing={spacing}>
      {children}
    </Col>
  ));
};

export const contain = (props?: any) => {
  const padding = props?.padding ?? { all: 10 };

  return withBluefish(({ children }: PropsWithBluefish) => <Contain padding={padding}>{children}</Contain>);
};

export const Tree3 = withBluefish(({ data, encoding, overdraw }: TreeProps) => {
  const { value, subtrees = [] } = data;

  const node = useName('node');
  const subtreeGroup = useName('subtrees');
  const subtreeNames = useNameList(_.range(subtrees.length).map((i) => `child-${i}`));

  return (
    <Group>
      <encoding.node name={node} value={value} leaf={subtrees.length === 0} />
      <encoding.subTreeSubTree name={subtreeGroup}>
        {subtrees.map((child, i) => (
          <Tree3 name={subtreeNames[i]} data={child} encoding={encoding} />
        ))}
      </encoding.subTreeSubTree>
      {subtrees.length > 0 ? (
        <encoding.rootSubTree>
          <Ref select={node} />
          <Ref select={subtreeGroup} />
        </encoding.rootSubTree>
      ) : null}
      {subtrees.map((_, i) => (
        <encoding.link>
          <Ref select={node} />
          <Ref select={lookup(subtreeNames[i], 'node')} />
        </encoding.link>
      ))}
      {/* overdraw */}
      {overdraw !== false ? (
        <Align alignment="center">
          <Ref select={node} />
          <encoding.node value={value} leaf={subtrees.length === 0} />
        </Align>
      ) : null}
    </Group>
  );
});
