import _ from 'lodash';
import { Rect } from '../../../../components/Rect';
import { Mark } from '../Plot';

export const barY = <T,>(
  data: T[],
  { x, y, color }: { x: (d: T) => number; y: (d: T) => number; color: (d: T) => string },
): Mark => ({
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
    return indices.map((i) => ({
      x: xScale(X[i]),
      // y: dimensions.height - yScale(Y[i]),
      y: yScale(Y[i]),
      width: xScale.bandwidth(),
      // height: yScale(Y[i]),
      height: yScale(0) - yScale(Y[i]),
      fill: colorScale(COLOR[i]),
    }));
  },
  render: ({ x, y, width, height, fill }: { x: number; y: number; width: any; height: number; fill: string }) => (
    <Rect x={x} y={y} width={width} height={height} fill={fill} />
  ),
});
