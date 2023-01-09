import React from 'react';
import { forwardRef } from 'react';
import { NewBBox } from '../../../../NewBBox';
import { PlotContext } from '../Plot';
import { scaleLinear } from 'd3-scale';
import { max } from 'lodash';
import { Row } from '../../../../components/Row';
import { Path } from '../../../../components/Path';
import { Group } from '../../../../components/Group2';
import { Line } from '../../../../components/Line';
import { Connector } from '../../../../components/Connector';
import { Text } from '../../../../components/Text2';
import { Ref } from '../../../../components/Ref';

export type AxisProps<T> = Omit<React.SVGProps<SVGRectElement>, 'x' | 'y' | 'fill' | 'width' | 'height'> & {
  x: keyof T;
  y: keyof T;
  color: keyof T;
  data?: T[];
  totalWidth?: number;
  spacing?: number;
  scale: any;
};

export const Axis = forwardRef(function Axis(props: AxisProps<any>, ref: any) {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;
  const totalWidth = props.totalWidth ?? context.dimensions.width;
  const colorScale = context.scales.colorScale;
  console.log('colorScale', colorScale);

  const scale = props.scale;
  const ticks = scale.ticks();

  return (
    <Group ref={ref}>
      {/* feed path the tick marks. this should generate ids to ref each point */}
      <Path name={'path'} />
      {(ticks as any[]).map((tick, i) => (
        // then use ids here align text to the path
        <Text name={`tick-${i}`} contents={tick} x={scale(tick)} y={0} />
      ))}
      {/* then use ids here to align connectors between the twos */}
      {/* {(data as any[]).map((d, i) => (
        <Connector $from={'path'} $to={'topCenter'}>
          <Ref to={'path'} />
          <Ref to={`tick-${i}`} />
        </Connector>
      ))} */}
    </Group>
  );
});
Axis.displayName = 'Axis';
