import React from 'react';
import { forwardRef } from 'react';
import {
  Symbol,
  withBluefish,
  BBox,
  Measure,
  useBluefishLayout,
  PropsWithBluefish,
  useNameList,
  useName,
} from '../../../../bluefish';
import { NewBBox } from '../../../../NewBBox';
import { PlotContext } from '../Plot';
import { scaleLinear } from 'd3-scale';
import { max, min } from 'lodash';
import { Group } from '../../../../components/Group';
import { Anchors, PointLabel } from '../../../../components/Label/PointLabel';
import { Text } from '../../../../components/Text';
import _ from 'lodash';
import { Padding, Ref } from '../../../../main';

export type NewDotProps<T> = PropsWithBluefish<
  Omit<React.SVGProps<SVGCircleElement>, 'cx' | 'cy' | 'fill' | 'width' | 'height' | 'label'> & {
    x: keyof T;
    y: keyof T;
    color?: keyof T;
    stroke?: keyof T;
    label?:
      | keyof T
      | {
          field: keyof T;
          avoid: Symbol[];
        };
    data?: T[];
    labelProps?: React.SVGProps<SVGTextElement>;
  }
>;

export const NewDot = withBluefish(function NewDot(props: NewDotProps<any>) {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;
  const xScale = context.scales.xScale;
  const yScale = context.scales.yScale;

  const dots = useNameList(_.range(data.length).map((i) => `dot-${i}`));
  const labels = useName('labels');
  // const group = useName('group');
  let { fontSize, fill, fontWeight } = props.labelProps ?? {};

  return (
    <Group aria-label={props['aria-label'] ?? 'Points'}>
      {(data as any[]).map((d, i) => (
        <DotScale
          aria-label={`Point with value ${d[props.y]} at ${d[props.x]}`}
          name={dots[i]}
          cx={+d[props.x]}
          cy={+d[props.y]}
          data={d}
          r={3}
          stroke={props.stroke ?? 'black'}
          strokeWidth={props.strokeWidth ?? 1}
          fill={props.color ?? 'white'}
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
        />
      ))}
      {props.label !== undefined ? (
        typeof props.label === 'object' && 'field' in props.label ? (
          <PointLabel
            aria-label={`Labels for each dot`}
            name={labels}
            texts={(data as any[]).map((d, i) => ({
              label: (
                <Padding left={10} right={0} top={0} bottom={5}>
                  <Text
                    aria-label={`Dot Annotation With Value ${d[(props.label! as any).field!]}`}
                    contents={d[(props.label! as any).field!]}
                    fontSize={fontSize ?? '8pt'}
                    fill={fill ?? 'black'}
                    fontWeight={fontWeight ?? 'normal'}
                  />
                </Padding>
              ),
              ref: dots[i],
            }))}
            compare={undefined}
            offset={[1]}
            anchor={Anchors}
            avoidElements={props.label.avoid.map((name) => (
              <Ref to={name} />
            ))}
            avoidRefElements
            padding={0}
          />
        ) : (
          <PointLabel
            aria-label={`Dot Labels`}
            name={labels}
            texts={(data as any[]).map((d, i) => ({
              label: (
                <Padding left={10} right={0} top={0} bottom={5}>
                  <Text
                    aria-label={`Dot Annotation With Value ${d[(props.label! as string)!]}`}
                    contents={d[(props.label as string)!]}
                    fontSize={fontSize ?? '8pt'}
                    fill={fill ?? 'black'}
                    fontWeight={fontWeight ?? 'normal'}
                  />
                </Padding>
              ),
              ref: dots[i],
            }))}
            compare={undefined}
            offset={[1]}
            anchor={Anchors}
            avoidElements={[]}
            avoidRefElements
            padding={0}
          />
        )
      ) : null}
    </Group>
  );
});
NewDot.displayName = 'NewDot';

export type DotScaleProps = PropsWithBluefish<
  React.SVGProps<SVGCircleElement> & {
    xScale: (d: any) => (x: number) => number;
    yScale: (d: any) => (y: number) => number;
    data: any;
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

  const { id, bbox, domRef } = useBluefishLayout({}, props, dotMeasurePolicy(props));

  return (
    <g
      {...rest}
      id={id}
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
