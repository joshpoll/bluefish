import _, { max, min } from 'lodash';
import React, { forwardRef } from 'react';
import { Mark, PlotContext, plotMarkReified } from '../Plot';
import { curveCatmullRom, line as d3Line } from 'd3-shape';
import { withBluefish, BBox, Measure, useBluefishLayout, PropsWithBluefish, useName } from '../../../../bluefish';
import { NewBBox } from '../../../../NewBBox';
import { PaperScope, Point } from 'paper/dist/paper-core';
import { scaleLinear } from 'd3-scale';
import { NewLine } from './NewLine';
import { NewDot } from './NewDot';
import { Align, Group, Ref } from '../../../../main';
import { AxisTick } from './AxisTick';
import { Text } from '../../../../components/Text';

export type NewAxisProps<T> = Omit<
  React.SVGProps<SVGRectElement>,
  'x' | 'y' | 'fill' | 'stroke' | 'width' | 'height'
> & {
  x: keyof T;
  y: keyof T;
  //   scale: any;
  color?: keyof T;
  ticks: string[] | number[]; // just for now; can include other stuff later
  axis: 'x' | 'y'; // TODO: make this better later
};

export const NewAxis = withBluefish(function NewAxis(props: PropsWithBluefish<NewAxisProps<any>>) {
  const name = useName('axis');
  const ticks = useName('axis-ticks');
  const context = React.useContext(PlotContext);
  const colorScale = context.scales.colorScale;
  const xScale = context.scales.xScale;
  const yScale = context.scales.yScale;
  //   console.log('colorScale', colorScale);
  let data;

  const x = props.x;
  const y = props.y;

  if (props.axis === 'x') {
    data = props.ticks.map((tick) => {
      let obj: any = {};
      obj[x] = tick;
      obj[y] = 0;
      return obj;
    });
  } else {
    data = props.ticks.map((tick) => {
      let obj: any = {};
      obj[x] = 0;
      obj[y] = tick;
      return obj;
    });
  }

  return (
    <Group>
      <NewLine data={data} name={name} x={x} y={y} />
      <AxisTick x={x as string} y={y as string} data={data} axis={props.axis} name={ticks} />
    </Group>
  );
});
NewAxis.displayName = 'NewAxis';
