import _, { max, min } from 'lodash';
import React, { forwardRef } from 'react';
import { Mark, PlotContext, plotMarkReified } from '../Plot';
import { curveCatmullRom, line as d3Line } from 'd3-shape';
import { withBluefish, BBox, Measure, useBluefishLayout, PropsWithBluefish } from '../../../../bluefish';
import { NewBBox } from '../../../../NewBBox';
import { PaperScope, Point } from 'paper/dist/paper-core';
import { scaleLinear } from 'd3-scale';

export type AreaProps<T> = Omit<React.SVGProps<SVGPathElement>, 'x' | 'y' | 'fill' | 'stroke' | 'width' | 'height'> & {
  x: keyof T;
  y: keyof T;
  color?: keyof T;
  data?: T[];
};

export const Area = withBluefish(function NewLine(props: PropsWithBluefish<AreaProps<any>>) {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;
  const xScale = context.scales.xScale
    ? () => context.scales.xScale
    : (width: number) =>
        scaleLinear(
          [min<number>(data.map((d: any) => +d[props.x]))!, max<number>(data.map((d: any) => +d[props.x]))!],
          [0, width],
        );
  const yScale = context.scales.yScale
    ? () => context.scales.yScale
    : (height: number) =>
        scaleLinear(
          [min<number>(data.map((d: any) => +d[props.y]))!, max<number>(data.map((d: any) => +d[props.y]))!],
          [height, 0],
        );
  const colorScale = context.scales.colorScale;
  console.log('colorScale', colorScale);

  return (
    <PathScale
      points={data
        .map((d: any) => [d[props.x], d[props.y]] as [number, number])
        .filter((d: any) => d[0] !== undefined && d[1] !== undefined && !isNaN(d[0]) && !isNaN(d[1]))}
      fill={props.color ?? 'black'}
      stroke={props.color ?? 'black'}
      opacity={props.opacity ?? 1}
      strokeWidth={1.5}
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
      strokeMiterlimit={1}
      xScale={xScale}
      yScale={yScale}
    />
  );
});
Area.displayName = 'Area';

export type PathProps = PropsWithBluefish<
  Omit<React.SVGProps<SVGPathElement>, 'd' | 'points'> &
    Partial<BBox> & {
      xScale: (d: any) => (y: number) => number;
      yScale: (d: any) => (y: number) => number;
      points: [number, number][];
    }
>;

const pathMeasurePolicy = ({ points, xScale, yScale }: PathProps): Measure => {
  const canvas = document.createElement('canvas');
  const paperScope = new PaperScope();
  paperScope.setup(canvas);
  return (_measurables, constraints) => {
    const xScaleFn = xScale(constraints.width);
    const yScaleFn = yScale(constraints.height);

    const scaledPoints = points.map((p) => [xScaleFn(p[0]), yScaleFn(p[1])] as [number, number]);

    const d = d3Line().curve(curveCatmullRom)(scaledPoints) ?? '';
    const path = new paperScope.Path(d!);
    path.add(new paperScope.Point(scaledPoints[scaledPoints.length - 1][0], yScaleFn(0)));
    path.add(new paperScope.Point(scaledPoints[0][0], yScaleFn(0)));

    const bounds = path.bounds;

    return {
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
      boundary: path /* TODO: boundary should be dependent on width & height so it can be scaled later! */,
    };
  };
};

export const PathScale = withBluefish((props: PropsWithBluefish<PathProps>) => {
  const { points, name, xScale, yScale, ...rest } = props;

  console.log('opacity', props.opacity);

  const { id, bbox, boundary, domRef } = useBluefishLayout({}, props, pathMeasurePolicy(props));

  return (
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox!.coord?.translate?.x ?? 0}, ${bbox!.coord?.translate?.y ?? 0})`}
    >
      <path {...rest} d={boundary?.pathData ?? ''} />
    </g>
  );
});
