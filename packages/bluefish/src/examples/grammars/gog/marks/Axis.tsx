import React from 'react';
import { forwardRef } from 'react';
import { NewBBox } from '../../../../NewBBox';
import { PlotContext } from '../Plot';
import { scaleLinear } from 'd3-scale';
import { max } from 'lodash';
import { Row } from '../../../../components/Row';
import { Path } from '../../../../components/Path';
import { Group } from '../../../../components/Group';
import { Line } from '../../../../components/Line';
import { Connector } from '../../../../components/Connector';
import { Text } from '../../../../components/Text';
import { Ref } from '../../../../components/Ref';
import { PropsWithBluefish, useName, useNameList, withBluefish } from '../../../../bluefish';
import _ from 'lodash';

export type AxisProps<T> = PropsWithBluefish<
  Omit<React.SVGProps<SVGRectElement>, 'x' | 'y' | 'fill' | 'width' | 'height'> & {
    x: keyof T;
    y: keyof T;
    color: keyof T;
    data?: T[];
    totalWidth?: number;
    spacing?: number;
    scale: any;
  }
>;

export const Axis = withBluefish(function Axis(props: AxisProps<any>) {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;
  const totalWidth = props.totalWidth ?? context.dimensions.width;
  const colorScale = context.scales.colorScale;
  console.log('colorScale', colorScale);

  const scale = props.scale;
  const ticks = scale.ticks();

  const path = useName('path');
  const ticksList = useNameList(_.range(ticks.length).map((i) => `tick-${i}`));

  return (
    <Group>
      {/* feed path the tick marks. this should generate ids to ref each point */}
      <Path name={path} />
      {(ticks as any[]).map((tick, i) => (
        // then use ids here align text to the path
        <Text name={ticksList[i]} contents={tick} x={scale(tick)} y={0} />
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
