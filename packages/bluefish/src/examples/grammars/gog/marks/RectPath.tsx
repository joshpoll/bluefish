import React from 'react';
import { forwardRef } from 'react';
import { withBluefish, BBox, Measure, useBluefishLayout, PropsWithBluefish } from '../../../../bluefish';
import { NewBBox } from '../../../../NewBBox';
import { PlotContext } from '../Plot';
import { scaleLinear } from 'd3-scale';
import { max } from 'lodash';
import { Row } from '../../../../components/Row';
import { PaperScope } from 'paper/dist/paper-core';

export type NewBarYProps<T> = Omit<React.SVGProps<SVGRectElement>, 'x' | 'y' | 'fill' | 'width' | 'height'> & {
  x: keyof T;
  y: keyof T;
  color: keyof T;
  data?: T[];
  totalWidth?: number;
  spacing?: number;
};

// export const NewBarY = forwardRef(function NewBarY(props: NewBarYProps<any>, ref: any) {
//   const context = React.useContext(PlotContext);
//   const data = props.data ?? context.data;
//   const totalWidth = props.totalWidth ?? context.dimensions.width;
//   const colorScale = context.scales.colorScale;
//   console.log('colorScale', colorScale);

//   return (
//     <Row ref={ref} totalWidth={totalWidth} spacing={props.spacing!} alignment={'bottom'}>
//       {(data as any[]).map((d) => (
//         <RectScale
//           height={+d[props.y]}
//           fill={colorScale(d[props.color])}
//           yScale={(height) => scaleLinear([0, max<number>(data.map((d: any) => +d[props.y]))!], [0, height])}
//         />
//       ))}
//     </Row>
//   );
// });
// NewBarY.displayName = 'NewBarY';

export type RectPathProps = PropsWithBluefish<
  React.SVGProps<SVGRectElement> & {
    // xScale: (d: any) => (x: number) => number;
    // yScale: (d: any) => (y: number) => number;
    xyScale: (d: any) => (x: number, y: number) => { x: number; y: number };
  }
>;

const subdivide = (path: paper.Path, iters: number): void => {
  for (let i = 0; i < iters; i++) {
    for (let i = path.curves.length - 1; i >= 0; i--) {
      path.curves[i].divideAtTime(0.5);
    }
  }
};

const rectMeasurePolicy = (props: RectPathProps): Measure => {
  const { x, y, width, height } = props;

  const canvas = document.createElement('canvas');
  const paperScope = new PaperScope();
  paperScope.setup(canvas);

  return (_, constraints) => {
    // const xScaleFn = props.xScale(constraints.width);
    // const yScaleFn = props.yScale(constraints.height);
    const xyScaleFn = props.xyScale(constraints);

    const rectPath = new paperScope.Path.Rectangle({
      point: [x ?? 0, y ?? 0],
      size: [width ?? constraints.width, height ?? constraints.height],
    });

    // chop up the path
    subdivide(rectPath, 5);
    rectPath.flatten(0.1);

    // scale it
    for (const segment of rectPath.segments) {
      // segment.point.x = xScaleFn(segment.point.x);
      // segment.point.y = yScaleFn(segment.point.y);
      const { x, y } = xyScaleFn(segment.point.x, segment.point.y);
      segment.point.x = x;
      segment.point.y = y;
    }

    rectPath.simplify(0.001);

    const bounds = rectPath.bounds;

    return {
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
      boundary: rectPath /* TODO: boundary should be dependent on width & height so it can be scaled later! */,
    };
  };
};

export const RectPath = withBluefish((props: RectPathProps) => {
  const { xyScale, name, ...rest } = props;

  const { id, bbox, domRef, boundary } = useBluefishLayout({}, props, rectMeasurePolicy(props));

  return (
    // translate and scale based on bbox.coord
    <g
      id={id}
      ref={domRef}
      transform={`translate(${bbox?.coord?.translate?.x ?? 0} ${bbox?.coord?.translate?.y ?? 0})
scale(${bbox?.coord?.scale?.x ?? 1} ${bbox?.coord?.scale?.y ?? 1})`}
    >
      <path {...rest} d={boundary?.pathData ?? ''} />
    </g>
  );
});
RectPath.displayName = 'RectPath';
