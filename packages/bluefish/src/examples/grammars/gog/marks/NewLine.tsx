import _, { max, min } from 'lodash';
import React, { forwardRef } from 'react';
import { Mark, PlotContext, plotMarkReified } from '../Plot';
import { curveCatmullRom, line as d3Line } from 'd3-shape';
import { withBluefish, BBox, Measure, useBluefishLayout, PropsWithBluefish } from '../../../../bluefish';
import { NewBBox } from '../../../../NewBBox';
import { PaperScope, Point } from 'paper/dist/paper-core';
import { scaleLinear } from 'd3-scale';

export type NewLineProps<T> = Omit<React.SVGProps<SVGRectElement>, 'x' | 'y' | 'fill' | 'width' | 'height'> & {
  x: keyof T;
  y: keyof T;
  color?: keyof T;
  data?: T[];
  curved?: boolean; // whether curved line or just straight
};

export const NewLine = withBluefish(function NewLine(props: PropsWithBluefish<NewLineProps<any>>) {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;
  const colorScale = context.scales.colorScale;
  const xScale = context.scales.xScale;
  const yScale = context.scales.yScale;
  console.log('colorScale', colorScale);

  return (
    <PathScale
      points={data.map((d: any) => [d[props.x], d[props.y]] as [number, number])}
      fill={'none'}
      stroke={props.color ?? 'black'}
      strokeWidth={+(props.stroke ?? 1.5)} // allow user-defined stroke
      strokeLinecap={'round'}
      strokeLinejoin={'round'}
      strokeMiterlimit={1}
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
      curved={props.curved}
    />
  );
});
NewLine.displayName = 'NewLine';

export type PathProps = PropsWithBluefish<
  Omit<React.SVGProps<SVGPathElement>, 'd' | 'points'> &
    Partial<BBox> & {
      xScale: (d: any) => (y: number) => number;
      yScale: (d: any) => (y: number) => number;
      points: [number, number][];
      curved?: boolean;
    }
>;

const pathMeasurePolicy = ({ points, xScale, yScale, curved }: PathProps): Measure => {
  const canvas = document.createElement('canvas');
  const paperScope = new PaperScope();
  paperScope.setup(canvas);
  return (_measurables, constraints) => {
    const xScaleFn = xScale(constraints.width);
    const yScaleFn = yScale(constraints.height);

    console.log('xScaleFn', xScaleFn);
    const d =
      (curved !== false
        ? d3Line().curve(curveCatmullRom)(points.map((p) => [xScaleFn(p[0]), yScaleFn(p[1])] as [number, number]))
        : d3Line()(points.map((p) => [xScaleFn(p[0]), yScaleFn(p[1])] as [number, number]))) ?? '';
    const path = new paperScope.Path(d!);

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
