import React from 'react';
import { forwardRef } from 'react';
import { withBluefish, BBox, Measure, useBluefishLayout, PropsWithBluefish, useNameList } from '../../../../bluefish';
import { NewBBox } from '../../../../NewBBox';
import { PlotContext } from '../Plot';
import { scaleLinear } from 'd3-scale';
import { max, min } from 'lodash';
import { Group } from '../../../../components/Group';
import { Anchors, PointLabel } from '../../../../components/Label/PointLabel';
import { Text } from '../../../../components/Text';
import _ from 'lodash';

export type NewDotProps<T> = PropsWithBluefish<
  Omit<React.SVGProps<SVGCircleElement>, 'cx' | 'cy' | 'fill' | 'width' | 'height' | 'label'> & {
    x: keyof T;
    y: keyof T;
    color?: keyof T;
    stroke?: keyof T;
    label?: keyof T;
    data?: T[];
  }
>;

export const NewDot = withBluefish(function NewDot(props: NewDotProps<any>) {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;

  const dots = useNameList(_.range(data.length).map((i) => `dot-${i}`));

  return (
    <Group>
      {(data as any[]).map((d, i) => (
        <DotScale
          name={dots[i]}
          cx={+d[props.x]}
          cy={+d[props.y]}
          r={3}
          stroke={props.stroke ?? 'black'}
          fill={props.color ?? 'white'}
          xScale={(width) =>
            scaleLinear(
              [min<number>(data.map((d: any) => +d[props.x]))!, max<number>(data.map((d: any) => +d[props.x]))!],
              [0, width],
            )
          }
          yScale={(height) =>
            scaleLinear(
              [min<number>(data.map((d: any) => +d[props.y]))!, max<number>(data.map((d: any) => +d[props.y]))!],
              [height, 0],
            )
          }
        />
      ))}
      {props.label !== undefined ? (
        <PointLabel
          texts={(data as any[]).map((d, i) => ({
            label: <Text contents={d[props.label!]} fontSize={'6pt'} />,
            ref: `dot-${i}`,
          }))}
          compare={undefined}
          offset={[1]}
          anchor={Anchors}
          avoidElements={[]}
          avoidRefElements
          padding={0}
        />
      ) : null}
    </Group>
  );
});
NewDot.displayName = 'NewDot';

export type DotScaleProps = PropsWithBluefish<
  React.SVGProps<SVGCircleElement> & {
    xScale: (d: any) => (x: number) => number;
    yScale: (d: any) => (y: number) => number;
  }
>;

const dotMeasurePolicy = ({ cx, cy, r, xScale, yScale }: DotScaleProps): Measure => {
  return (_measurables, constraints) => {
    const scaledCX = cx !== undefined ? xScale(constraints.width)(+cx) : undefined;
    const scaledCY = cy !== undefined ? yScale(constraints.height)(+cy) : undefined;

    return {
      left: scaledCX !== undefined ? +scaledCX - +(r ?? 0) : undefined,
      top: scaledCY !== undefined ? +scaledCY - +(r ?? 0) : undefined,
      width: r !== undefined ? +r * 2 : undefined,
      height: r !== undefined ? +r * 2 : undefined,
    };
  };
};

export const DotScale = withBluefish((props: DotScaleProps) => {
  const { xScale, yScale, name, ...rest } = props;

  const { bbox, domRef } = useBluefishLayout({}, props, dotMeasurePolicy(props));

  return (
    <g
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})
scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
    >
      <circle
        {...rest}
        cx={(bbox?.left ?? 0) + (bbox?.width ?? 0) / 2}
        cy={(bbox?.top ?? 0) + (bbox?.height ?? 0) / 2}
        r={(bbox?.width ?? 0) / 2}
      />
    </g>
  );
});
DotScale.displayName = 'DotScale';
