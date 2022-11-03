import _ from "lodash";
import React, { forwardRef } from "react";
import {
  Measure,
  withBluefish,
  withBluefishFn,
  Col,
  Group,
  Rect,
  Row,
} from "@bluefish-js/core";
import { Mark, PlotContext, plotMarkReified } from "../Plot";
import { Scale } from "../Scale";
import { Scale as ScaleFn } from "../Plot";

export const barY = <T,>(
  data: T[],
  { x, y, color }: { x: string; y: string; color: string }
): Mark => ({
  data,
  encodings: { x, y, color },
  scale: (
    channels: { X: number[]; Y: number[]; COLOR: string[] },
    scales: {
      xScale: any;
      yScale: (y: number) => number;
      colorScale: (color: string) => string;
    },
    dimensions: any
  ) => {
    const { X, Y, COLOR } = channels;

    const { xScale, yScale, colorScale } = scales;

    const indices = _.range(X.length);
    return {
      spacing: xScale.step() - xScale.bandwidth(),
      totalWidth: dimensions.width,
      points: indices.map((i) => ({
        // height: yScale(Y[i]),
        height: Y[i],
        fill: colorScale(COLOR[i]),
      })),
      yScale: () => yScale,
    };
  },
  render: (data: {
    spacing: number;
    totalWidth: number;
    points: any[];
    yScale: ScaleFn;
  }) => {
    return (
      <Row
        totalWidth={data.totalWidth}
        spacing={data.spacing}
        alignment={"bottom"}
      >
        {/* {data.points.map(({ height, fill }: { width: any; height: number; fill: string }) => (
          <Rect height={height} fill={fill} />
        ))} */}
        {data.points.map(
          ({ height, fill }: { width: any; height: number; fill: string }) => (
            <Scale yScale={data.yScale}>
              <Rect height={height} fill={fill} />
            </Scale>
          )
        )}
      </Row>

      // stacked bars...
      // just have to combine it with a concat operator...
      // <Col spacing={data.spacing} alignment={'center'}>
      //   {data.points.reverse().map(({ height, fill }: { width: any; height: number; fill: string }) => (
      //     <Rect width={10} height={height} fill={fill} />
      //   ))}
      // </Col>
    );
  },
});

export const BarY: React.FC<{
  data?: any[];
  encodings: { x: string; y: string; color: string };
}> = forwardRef((props, ref) => {
  const context = React.useContext(PlotContext);

  const { encodings } = props;
  const data = props.data ?? context.data;
  const { x, y, color } = encodings;
  const mark = barY(data, { x, y, color });
  return (
    <Group ref={ref}>
      {plotMarkReified(mark, context.scales, context.dimensions)}
    </Group>
  );
});

const groupMeasurePolicy: Measure = (measurables, constraints) => {
  const placeables = measurables.map((measurable, idx) => {
    // console.log('[set to] name', measurable.name);
    console.log(`measurable ${idx}`, measurable);
    const placeable = measurable.measure(constraints);
    console.log(`placed measurable ${idx}`, placeable);
    return placeable;
  });
  // placeables.forEach((placeable, idx) => {
  //   console.log(`placeable ${idx}`, placeable);
  //   if (placeable.left === undefined) {
  //     console.log('placeable.left set to before', placeable.left);
  //     placeable.left = 0;
  //     console.log('placeable.left set to after', placeable.left);
  //   }
  //   if (placeable.top === undefined) {
  //     placeable.top = 0;
  //   }
  //   console.log(`group after: placed placeable ${idx}`, placeable);
  // });

  // TODO: might need to preserve "natural" position so I can figure out what the translation should be.

  const left = _.min(_.map(placeables, "left")) ?? 0;
  const top = _.min(_.map(placeables, "top")) ?? 0;
  const right = _.max(_.map(placeables, "right")) ?? 0;
  const bottom = _.max(_.map(placeables, "bottom")) ?? 0;
  console.log(
    "asdfs",
    "left",
    _.map(placeables, "left"),
    _.min(_.map(placeables, "left"))
  );
  console.log("asdfs", "group bbox", { left, top, right, bottom });
  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  };
  // const width = _.max(_.map(placeables, 'width')) ?? 0;
  // const height = _.max(_.map(placeables, 'height')) ?? 0;
  // return { width, height };
};

export const BarYWithBFN = withBluefish(
  groupMeasurePolicy,
  (
    props: { data?: any[]; encodings: { x: string; y: string; color: string } },
    ref
  ) => {
    const context = React.useContext(PlotContext);

    const { encodings } = props;
    const data = props.data ?? context.data;
    const { x, y, color } = encodings;
    const mark = barY(data, { x, y, color });
    return (
      <Group ref={ref}>
        {plotMarkReified(mark, context.scales, context.dimensions)}
      </Group>
    );
  }
);

// the marks need dimension information. this should be calculated during measurement and then
// passed to the renderer
// the problem is that I need the renderer to return a Bluefish component
