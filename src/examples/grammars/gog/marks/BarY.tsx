import _ from 'lodash';
import React, { forwardRef } from 'react';
import { Group } from '../../../../components/Group';
import { Rect } from '../../../../components/Rect';
import { Row } from '../../../../components/Row';
import { Mark, PlotContext, plotMarkReified } from '../Plot';

export const barY = <T,>(data: T[], { x, y, color }: { x: string; y: string; color: string }): Mark => ({
  data,
  encodings: { x, y, color },
  scale: (
    channels: { X: number[]; Y: number[]; COLOR: string[] },
    scales: { xScale: any; yScale: (y: number) => number; colorScale: (color: string) => string },
    _dimensions: any,
  ) => {
    const { X, Y, COLOR } = channels;

    const { xScale, yScale, colorScale } = scales;

    const indices = _.range(X.length);
    // TODO: derive lengths from spacing and totalWidth. need to modify Row component to do this.
    //  could also grab available width from constraints
    return {
      spacing: xScale.step() - xScale.bandwidth(),
      // totalWidth: xScale.range()[1] - xScale.range()[0],
      points: indices.map((i) => ({
        width: xScale.bandwidth(),
        // height: yScale(Y[i]),
        height: yScale(0) - yScale(Y[i]),
        fill: colorScale(COLOR[i]),
      })),
    };
  },
  render: (data: { spacing: number; points: any[] }) => {
    return (
      <Row spacing={data.spacing} alignment={'bottom'}>
        {data.points.map(({ width, height, fill }: { width: any; height: number; fill: string }) => (
          <Rect width={width} height={height} fill={fill} />
        ))}
      </Row>
    );
  },
});

export const BarY: React.FC<{ data?: any[]; encodings: { x: string; y: string; color: string } }> = forwardRef(
  (props, ref) => {
    const context = React.useContext(PlotContext);

    const { encodings } = props;
    const data = props.data ?? context.data;
    const { x, y, color } = encodings;
    const mark = barY(data, { x, y, color });
    return <Group ref={ref}>{plotMarkReified(mark, context.scales, context.dimensions)}</Group>;
  },
);
