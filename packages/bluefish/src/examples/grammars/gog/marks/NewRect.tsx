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
import { Ref } from '../../../../main';

export type NewRect<T> = PropsWithBluefish<
  Omit<React.SVGProps<SVGRectElement>, 'fill' | 'width' | 'height' | 'label'> & {
    x: keyof T;
    y: keyof T;
    color?: keyof T;
    stroke?: keyof T;
    opacity?: number;
    label?:
      | keyof T
      | {
          field: keyof T;
          avoid: Symbol[];
        };
    corner1: T; // one corner
    corner2: T; // the opposite corner
  }
>;

export const NewRect = withBluefish(function NewRect(props: NewRect<any>) {
  const context = React.useContext(PlotContext);
  const xScale = context.scales.xScale;
  const yScale = context.scales.yScale;
  const corner1 = props.corner1;
  const corner2 = props.corner2;

  const rect = useName('rect');
  const labels = useName('labels');
  // const group = useName('group');

  return (
    <RectScale
      aria-label={props['aria-label'] ?? 'Rect Mark'}
      name={rect}
      x1={+corner1[props.x]}
      y1={+corner1[props.y]}
      x2={+corner2[props.x]}
      y2={+corner2[props.y]}
      stroke={props.stroke}
      strokeWidth={props.strokeWidth ?? 1}
      fill={props.color ?? 'white'}
      fillOpacity={props.fillOpacity ?? 1}
      opacity={props.opacity ?? 1}
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
  );
});
NewRect.displayName = 'NewRect';

export type RectScaleProps = PropsWithBluefish<
  React.SVGProps<SVGRectElement> & {
    xScale: (d: any) => (x: number) => number;
    yScale: (d: any) => (y: number) => number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
  }
>;

const rectMeasurePolicy = ({ x1, y1, x2, y2, xScale, yScale }: RectScaleProps): Measure => {
  return (_measurables, constraints) => {
    const scaledX1 = x1 !== undefined ? xScale(constraints.width)(+x1) : undefined;
    const scaledY1 = y1 !== undefined ? yScale(constraints.height)(+y1) : undefined;
    const scaledX2 = x2 !== undefined ? xScale(constraints.width)(+x2) : undefined;
    const scaledY2 = y2 !== undefined ? yScale(constraints.height)(+y2) : undefined;

    return {
      left: scaledX1 !== undefined && scaledX2 !== undefined ? Math.min(scaledX1, scaledX2) : undefined,
      top: scaledY1 !== undefined && scaledY2 !== undefined ? Math.min(scaledY1, scaledY2) : undefined,
      width: scaledX1 !== undefined && scaledX2 !== undefined ? Math.abs(scaledX2 - scaledX1) : undefined,
      height: scaledY1 !== undefined && scaledY2 !== undefined ? Math.abs(scaledY1 - scaledY2) : undefined,
    };
  };
};

export const RectScale = withBluefish((props: RectScaleProps) => {
  const { xScale, yScale, name, ...rest } = props;

  const { id, bbox, domRef } = useBluefishLayout({}, props, rectMeasurePolicy(props));

  return (
    <g
      {...rest}
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})
scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
    >
      <rect {...rest} x={bbox?.left ?? 0} y={bbox?.top ?? 0} width={bbox?.width ?? 0} height={bbox?.height ?? 0} />
    </g>
  );
});
RectScale.displayName = 'RectScale';
