import _ from 'lodash';
import React from 'react';
import { Measure, PropsWithBluefish, useBluefishLayout, useNameList, withBluefish } from '../../../../bluefish';
import { Align, Col, Group, Line, Padding, Ref, Space } from '../../../../main';
import { PlotContext } from '../Plot';
import { Text } from '../../../../components/Text';
import { LayoutGroup } from '../../../../components/LayoutGroup';
import { Distribute } from '../../../../components/Distribute';

export type AxisTickProps<T> = PropsWithBluefish<
  Omit<React.SVGProps<SVGLineElement>, 'cx' | 'cy' | 'fill' | 'width' | 'height' | 'label'> & {
    x: keyof T;
    y: keyof T;
    color?: keyof T;
    stroke?: keyof T;
    axis: 'x' | 'y';
    data?: T[];
  }
>;
export const AxisTick = withBluefish(function AxisTick(props: PropsWithBluefish<AxisTickProps<any>>) {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;
  const xScale = context.scales.xScale;
  const yScale = context.scales.yScale;

  const ticks = useNameList(_.range(data.length).map((i) => `tick-${i}`));
  const labels = useNameList(_.range(data.length).map((i) => `label-${i}`));
  const align = useNameList(_.range(data.length).map((i) => `align-${i}`));

  return (
    <Group aria-label={`${props.axis.toUpperCase()}-axis ticks`}>
      {(data as any[]).map((d, i) => (
        <Group aria-label={props.axis === 'x' ? `Tick at value ${d[props.x]}` : `Tick at value ${d[props.y]}`}>
          <Align>
            <TickScale
              aria-hidden={true}
              guidePrimary={props.axis === 'x' ? 'bottomCenter' : 'centerLeft'}
              name={ticks[i]}
              cx={+d[props.x]}
              cy={+d[props.y]}
              stroke={props.stroke ?? 'black'}
              xScale={
                (width) => xScale(width)
                // scaleLinear(
                //   [min<number>(data.map((d: any) => +d[props.x]))!, max<number>(data.map((d: any) => +d[props.x]))!],
                //   [0, width],
                // )
              }
              yScale={
                (height) => yScale(height)
                // scaleLinear(
                //   [min<number>(data.map((d: any) => +d[props.y]))!, max<number>(data.map((d: any) => +d[props.y]))!],
                //   [height, 0],
                // )
              }
              axis={props.axis}
            />
            <Padding all={5} guidePrimary={props.axis === 'x' ? 'topCenter' : 'centerRight'}>
              <Text
                guidePrimary={props.axis === 'x' ? 'topCenter' : 'centerRight'}
                name={labels[i]}
                contents={d[props.axis === 'x' ? props.x : props.y]}
              />
            </Padding>
          </Align>
        </Group>
      ))}
    </Group>
  );
});
AxisTick.displayName = 'AxisTick';

export type tickScaleProps = PropsWithBluefish<
  React.SVGProps<SVGLineElement> & {
    xScale: (d: any) => (x: number) => number;
    yScale: (d: any) => (y: number) => number;
    axis: 'x' | 'y';
  }
>;

const tickMeasurePolicy = ({ cx, cy, xScale, yScale, axis }: tickScaleProps): Measure => {
  return (_measurables, constraints) => {
    const scaledCX = cx !== undefined ? xScale(constraints.width)(+cx) : undefined;
    const scaledCY = cy !== undefined ? yScale(constraints.height)(+cy) : undefined;

    return {
      left: scaledCX !== undefined ? +scaledCX - (axis === 'x' ? 0 : 10) : undefined,
      top: scaledCY !== undefined ? +scaledCY + (axis === 'x' ? 0 : 0) : undefined,
      right: scaledCX !== undefined ? +scaledCX + (axis === 'x' ? 0 : 0) : undefined,
      bottom: scaledCY !== undefined ? +scaledCY - (axis === 'x' ? 10 : 0) : undefined,
      width: axis === 'x' ? 0 : 10,
      height: axis === 'x' ? 10 : 0,
    };
  };
};

export const TickScale = withBluefish((props: tickScaleProps) => {
  const { xScale, yScale, name, ...rest } = props;

  const { id, bbox, domRef } = useBluefishLayout({}, props, tickMeasurePolicy(props));
  return (
    <g
      {...rest}
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})
      scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
    >
      <line {...rest} x1={bbox.left} x2={bbox.right} y1={bbox.top} y2={bbox.bottom} />
    </g>
  );
});
TickScale.displayName = 'TickScale';
