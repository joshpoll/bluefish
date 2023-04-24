import React from 'react';
import { forwardRef } from 'react';
import { withBluefish, BBox, Measure, useBluefishLayout, PropsWithBluefish } from '../../../../bluefish';
import { NewBBox } from '../../../../NewBBox';
import { PlotContext } from '../Plot';
import { scaleLinear } from 'd3-scale';
import { max } from 'lodash';
import { Row } from '../../../../components/Row';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';
import { Col } from '../../../../main';

export type BarXProps<T> = Omit<React.SVGProps<SVGRectElement>, 'x' | 'y' | 'fill' | 'width' | 'height'> & {
  x: keyof T;
  y: keyof T;
  color: keyof T;
  data?: T[];
  total?: number;
  spacing?: number;
  stack?: 'horizontal' | 'vertical';
};

export const BarX = withBluefish(function BarX(props: BarXProps<any>) {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;
  const total = props.total ?? context.dimensions.width;
  const colorScale = context.scales.colorScale;

  if (props.stack === 'horizontal') {
    return (
      <Row totalWidth={total} spacing={props.spacing!} alignment={'middle'}>
        {(data as any[]).map((d) => {
          return (
            <RectScale
              width={+d[props.x]}
              fill={colorScale(d[props.color])}
              xScale={(width) => scaleLinear([0, max<number>(data.map((d: any) => +d[props.x]))!], [0, width])}
            />
          );
        })}
      </Row>
    );
  }
  return (
    <Col totalHeight={total} spacing={props.spacing!} alignment={'left'}>
      {(data as any[]).map((d) => {
        return (
          <RectScale
            width={+d[props.x]}
            fill={colorScale(d[props.color])}
            xScale={(width) => scaleLinear([0, max<number>(data.map((d: any) => +d[props.x]))!], [0, width])}
          />
        );
      })}
    </Col>
  );
});
BarX.displayName = 'BarX';

export type RectScaleProps = PropsWithBluefish<
  React.SVGProps<SVGRectElement> & {
    xScale: (d: any) => (x: number) => number;
  }
>;

const rectMeasurePolicy = (props: RectScaleProps): Measure => {
  const { x, y, width, height } = props;

  console.log('scaledY BEFORE', props);

  return (_, constraints) => {
    // const scaledY = y !== undefined ? props.yScale(constraints.height)(+y) : undefined;
    // const scaledHeight = height !== undefined ? props.yScale(constraints.height)(+height) :
    // undefined;
    const scaledX = x !== undefined ? props.xScale(constraints.width)(+x) : undefined;
    const scaledWidth = width !== undefined ? props.xScale(constraints.width)(+width) : undefined;

    return {
      left: scaledX,
      width: scaledWidth,
      top: y !== undefined ? +y : undefined,
      height: height !== undefined ? +height : undefined,
    };
  };
};

export const RectScale = withBluefish((props: RectScaleProps) => {
  const { xScale, name, ...rest } = props;

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
