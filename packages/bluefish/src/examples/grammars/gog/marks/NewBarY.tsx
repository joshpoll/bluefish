import React from 'react';
import { forwardRef } from 'react';
import { withBluefish, BBox, Measure, useBluefishLayout, PropsWithBluefish } from '../../../../bluefish';
import { NewBBox } from '../../../../NewBBox';
import { PlotContext } from '../Plot';
import { scaleLinear } from 'd3-scale';
import { max } from 'lodash';
import { Row } from '../../../../components/Row';

export type NewBarYProps<T> = Omit<React.SVGProps<SVGRectElement>, 'x' | 'y' | 'fill' | 'width' | 'height'> & {
  x: keyof T;
  y: keyof T;
  color: keyof T;
  data?: T[];
  totalWidth?: number;
  spacing?: number;
};

export const NewBarY = forwardRef(function NewBarY(props: NewBarYProps<any>, ref: any) {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;
  const totalWidth = props.totalWidth ?? context.dimensions.width;
  const colorScale = context.scales.colorScale;
  console.log('colorScale', colorScale);

  return (
    <Row ref={ref} totalWidth={totalWidth} spacing={props.spacing!} alignment={'bottom'}>
      {(data as any[]).map((d) => (
        <RectScale
          height={+d[props.y]}
          fill={colorScale(d[props.color])}
          yScale={(height) => scaleLinear([0, max<number>(data.map((d: any) => +d[props.y]))!], [0, height])}
        />
      ))}
    </Row>
  );
});
NewBarY.displayName = 'NewBarY';

export type RectScaleProps = PropsWithBluefish<
  React.SVGProps<SVGRectElement> & {
    yScale: (d: any) => (y: number) => number;
  }
>;

const rectMeasurePolicy = (props: RectScaleProps): Measure => {
  const { x, y, width, height } = props;

  return (_, constraints) => {
    const scaledY = y !== undefined ? props.yScale(constraints.height)(+y) : undefined;
    const scaledHeight = height !== undefined ? props.yScale(constraints.height)(+height) : undefined;

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

  const { bbox, domRef } = useBluefishLayout({}, props, rectMeasurePolicy(props));

  return (
    // translate and scale based on bbox.coord
    <g
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})
scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
    >
      <rect {...rest} x={bbox?.left ?? 0} y={bbox?.top ?? 0} width={bbox?.width ?? 0} height={bbox?.height ?? 0} />
    </g>
  );
});
RectScale.displayName = 'RectScale';
