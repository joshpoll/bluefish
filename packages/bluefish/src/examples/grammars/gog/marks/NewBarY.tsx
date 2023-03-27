import React from 'react';
import { forwardRef } from 'react';
import { withBluefish, BBox, Measure, useBluefishLayout, PropsWithBluefish } from '../../../../bluefish';
import { NewBBox } from '../../../../NewBBox';
import { PlotContext } from '../Plot';
import { scaleLinear } from 'd3-scale';
import { max } from 'lodash';
import { Row } from '../../../../components/Row';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { createSelector, Encoding } from './withEncodable';

export type BarYProps<T> = Omit<React.SVGProps<SVGRectElement>, 'x' | 'y' | 'fill' | 'width' | 'height' | 'color'> & {
  x: Encoding<T>;
  y: Encoding<T>;
  color?: Encoding<T>;
  data?: T[];
  totalWidth?: number;
  spacing?: number;
};

export const BarY = withBluefish(function BarY(props: BarYProps<any>) {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;
  const totalWidth = props.totalWidth ?? context.dimensions.width;
  const colorScale = context.scales.colorScale;
  console.log('colorScale', colorScale);

  // console.log('scaledY', props);

  const selectors = {
    y: createSelector(props.y),
    color: createSelector(props.color, 'black'),
    stroke: createSelector(props.stroke),
  };

  return (
    <Row totalWidth={totalWidth} spacing={props.spacing!} alignment={'bottom'}>
      {(data as any[]).map((d) => {
        console.log(
          'scaledY',
          +selectors.y(d),
          data.map((d: any) => +selectors.y(d)),
          max<number>(data.map((d: any) => +selectors.y(d))),
        );
        return (
          <RectScale
            height={+selectors.y(d)}
            fill={colorScale(selectors.color(d))}
            stroke={selectors.stroke(d)}
            yScale={(height) => scaleLinear([0, max<number>(data.map((d: any) => +selectors.y(d)))!], [0, height])}
          />
        );
      })}
    </Row>
  );
});
BarY.displayName = 'BarY';

export type RectScaleProps = PropsWithBluefish<
  React.SVGProps<SVGRectElement> & {
    yScale: (d: any) => (y: number) => number;
  }
>;

const rectMeasurePolicy = (props: RectScaleProps): Measure => {
  const { x, y, width, height } = props;

  console.log('scaledY BEFORE', props);

  return (_, constraints) => {
    const scaledY = y !== undefined ? props.yScale(constraints.height)(+y) : undefined;
    const scaledHeight = height !== undefined ? props.yScale(constraints.height)(+height) : undefined;

    console.log('scaledY AFTER', y, scaledY);
    console.log('scaledY AFTER height', height, scaledHeight);

    return {
      left: x !== undefined ? +x : undefined,
      top: scaledY,
      width: width !== undefined ? +width : undefined,
      height: scaledHeight,
    };
  };
};

export const RectScale = withBluefish((props: RectScaleProps) => {
  const { yScale, name, ...rest } = props;

  const { id, bbox, domRef } = useBluefishLayout({}, props, rectMeasurePolicy(props));

  return (
    // translate and scale based on bbox.coord
    <g
      className="rectScale"
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
