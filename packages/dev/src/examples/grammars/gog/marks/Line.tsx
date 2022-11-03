import _ from "lodash";
import React, { forwardRef } from "react";
import { Group /* Path */ } from "@bluefish-js/core";
import { Mark, PlotContext, plotMarkReified } from "../Plot";
import { curveCatmullRom, line as d3Line } from "d3-shape";

export const line = <T,>(
  data: T[],
  { x, y, color }: { x: string; y: string; color: string }
): Mark => ({
  data,
  encodings: { x, y, color },
  scale: (
    channels: { X: number[]; Y: number[]; COLOR: string[] },
    scales: {
      xScale: (x: number) => number;
      yScale: (y: number) => number;
      colorScale: (color: string) => string;
    },
    _dimensions: any
  ) => {
    const { X, Y, COLOR } = channels;

    const { xScale, yScale, colorScale } = scales;

    const indices = _.range(X.length);
    return {
      // TODO: fix this!
      stroke: colorScale(COLOR[0]),
      points: indices.map((i) => ({
        x: xScale(X[i]),
        y: yScale(Y[i]),
      })),
    };
  },
  render: (data: { stroke: string; points: { x: number; y: number }[] }) => {
    return (
      <></>
      // <Path
      //   d={
      //     d3Line().curve(curveCatmullRom)(
      //       data.points.map(({ x, y }) => [x, y])
      //     ) ?? ""
      //   }
      //   fill={"none"}
      //   stroke={data.stroke}
      //   strokeWidth={1.5}
      //   strokeLinecap={"round"}
      //   strokeLinejoin={"round"}
      //   strokeMiterlimit={1}
      // />
    );
  },
});

export const Line: React.FC<{
  data?: any[];
  encodings: { x: string; y: string; color: string };
}> = forwardRef((props, ref) => {
  const context = React.useContext(PlotContext);

  const { encodings } = props;
  const data = props.data ?? context.data;
  const { x, y, color } = encodings;
  const mark = line(data, { x, y, color });
  return (
    <Group ref={ref}>
      {plotMarkReified(mark, context.scales, context.dimensions)}
    </Group>
  );
});
