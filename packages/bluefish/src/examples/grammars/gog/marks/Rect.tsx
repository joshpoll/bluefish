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
import { createSelector, Encoding } from './withEncodable';

export type NewRectProps<T> = PropsWithBluefish<
  Omit<
    React.SVGProps<SVGRectElement>,
    'fill' | 'width' | 'height' | 'label' | 'x1' | 'x2' | 'y1' | 'y2' | 'color' | 'stroke'
  > & {
    data?: T[];
    color?: Encoding<T>;
    stroke?: Encoding<T>;
    opacity?: number;
    label?:
      | keyof T
      | {
          field: keyof T;
          avoid: Symbol[];
        };
    x1?: Encoding<T>;
    x2?: Encoding<T>;
    y1?: Encoding<T>;
    y2?: Encoding<T>;
  }
>;

export const NewRect = withBluefish(function NewRect(props: NewRectProps<any>) {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;
  const xScale = /* context.scales.xScale
    ? () => context.scales.xScale
    :  */ (width: number) =>
    scaleLinear(
      [
        min<number>(data.map((d: any) => min([+createSelector(props.x1)(d), +createSelector(props.x2)(d)])))!,
        max<number>(data.map((d: any) => max([+createSelector(props.x1)(d), +createSelector(props.x2)(d)])))!,
      ],
      [0, width],
    );
  const yScale = context.scales.yScale;

  const rectNames = useNameList(Array.from(data.length).map((_, i) => `rect-${i}`));

  // console.log('xScale in NewRect', xScale, props.x1, data, props.x1 ? data[props.x1] : undefined);

  // TODO: use these values to set the default values for the selectors
  const defaultValues = {
    color: 'black',
    fillOpacity: 1,
    opacity: 1,
  };

  const selectors = {
    x1: createSelector(props.x1),
    x2: createSelector(props.x2),
    y1: createSelector(props.y1),
    y2: createSelector(props.y2),
    stroke: createSelector(props.stroke),
    color: createSelector(props.color, 'black'),
    fillOpacity: createSelector(props.fillOpacity, 1),
    opacity: createSelector(props.opacity, 1),
  };

  return (
    <Group>
      {(data as any[]).map((d, i) => {
        return (
          <RectScale
            name={rectNames[i]}
            x1={+selectors.x1(d)}
            x2={+selectors.x2(d)}
            y1={+selectors.y1(d)}
            y2={+selectors.y2(d)}
            stroke={selectors.stroke(d)}
            fill={selectors.color(d)}
            fillOpacity={selectors.fillOpacity(d)}
            opacity={selectors.opacity(d)}
            xScale={xScale}
            // yScale={(height) => scaleLinear([0, max<number>(data.map((d: any) => +selectors.y1(d)))!], [0, height])}
            yScale={(height) => (x) => x}
          />
        );
      })}
    </Group>
  );
});
NewRect.displayName = 'NewRect';

export type RectScaleProps = PropsWithBluefish<
  React.SVGProps<SVGRectElement> & {
    xScale: (d: any) => (x: number) => number;
    yScale: (d: any) => (y: number) => number;
    x1?: number;
    x2?: number;
    y1?: number;
    y2?: number;
  }
>;

const rectMeasurePolicy = ({ x1, y1, x2, y2, xScale, yScale }: RectScaleProps): Measure => {
  return (_measurables, constraints) => {
    const scaledX1 = x1 !== undefined ? xScale(constraints.width)(+x1) : undefined;
    const scaledY1 = y1 !== undefined ? yScale(constraints.height)(+y1) : undefined;
    const scaledX2 = x2 !== undefined ? xScale(constraints.width)(+x2) : undefined;
    const scaledY2 = y2 !== undefined ? yScale(constraints.height)(+y2) : undefined;

    console.log('rectMeasurePolicy', x1, y1, x2, y2, xScale, yScale, scaledX1, scaledY1, scaledX2, scaledY2);

    return {
      left: scaledX1 !== undefined && scaledX2 !== undefined ? Math.min(scaledX1, scaledX2) : undefined,
      top: scaledY1 !== undefined && scaledY2 !== undefined ? Math.min(scaledY1, scaledY2) : undefined,
      width: scaledX1 !== undefined && scaledX2 !== undefined ? Math.abs(scaledX2 - scaledX1) : undefined,
      height: scaledY1 !== undefined && scaledY2 !== undefined ? Math.abs(scaledY1 - scaledY2) : undefined,
    };
  };
};

export const RectScale = withBluefish((props: RectScaleProps) => {
  const { xScale, yScale, x1, x2, y1, y2, name, ...rest } = props;

  const { id, bbox, domRef } = useBluefishLayout({}, props, rectMeasurePolicy(props));

  return (
    <g
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
