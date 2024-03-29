import _ from 'lodash';
import React, { forwardRef, PropsWithChildren } from 'react';
import { Measure, PropsWithBluefish, useBluefishLayout, withBluefish } from '../../../bluefish';
import { Group } from '../../../components/Group';
import { Padding } from '../../../components/Padding';
import { SVG } from '../../../components/SVG';
import { NewBBox } from '../../../NewBBox';

export type Dimensions = {
  width: number;
  height: number;
};

export const extractChannels = (data: any, encodings: any) => {
  let channels: any = {};
  for (const [c, encoding] of Object.entries(encodings)) {
    channels[c.toUpperCase()] = data.map((d: any) => d[encoding as string]);
  }
  return channels;
};

export const reifyScales = (scales: { [key in string]: Scale }, dimensions: Dimensions) => {
  let reifiedScales: { [key in string]: any } = {};
  for (const [name, scale] of Object.entries(scales)) {
    reifiedScales[name] = scale(dimensions);
  }
  return reifiedScales;
};

export const plotMark = (mark: Mark, scales: { [key in string]: Scale }, dimensions: Dimensions) => {
  const { data, encodings, scale, render } = mark;
  const channels = extractChannels(data, encodings);
  const reifiedScales = reifyScales(scales, dimensions);
  const scaledData = scale(channels, reifiedScales, dimensions);
  // 4. Call the mark's render function on the scaled data.
  return scaledData.map(render);
};

export type Mark = {
  data: any;
  encodings: any;
  scale: any;
  render: any;
};

// export type Mark = any;

export type Scale = (dims: Dimensions) => any;

export type PlotProps = {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  x?: Scale;
  y?: Scale;
  color?: Scale;
  data?: any;
};

export type Plot2Props = {
  width?: number;
  height?: number;
  x?: Scale;
  y?: Scale;
  color?: Scale;
  data?: any;
};

export const renameScales = (scales: { [key in string]: Scale }) => {
  let renamedScales: { [key in string]: any } = {};
  for (const [name, scale] of Object.entries(scales)) {
    renamedScales[name + 'Scale'] = scale;
  }
  return renamedScales;
};

export const plotMarkReified = (mark: Mark, scales: { [key in string]: Scale }, dimensions: Dimensions) => {
  const { data, encodings, scale, render } = mark;
  // 1. Use the encoding functions to extract channels from the data
  const channels = extractChannels(data, encodings);
  console.log('channels', channels);
  // 2. Call the mark's scale function get the screen space coordinates.
  const scaledData = scale(channels, scales, dimensions);
  console.log('scaledData', scaledData);
  return render(scaledData);
};

export type PlotContextValue = {
  data?: any;
  dimensions: Dimensions;
  scales: { [key in string /* Scale */]: any };
};

const groupMeasurePolicy =
  (props: Plot2Props): Measure =>
  (measurables, constraints) => {
    console.log('[plot] measurables', measurables);
    constraints = { width: props.width ?? constraints.width, height: props.height ?? constraints.height };
    const placeables = measurables.map((measurable, idx) => {
      // console.log('[set to] name', measurable.name);
      console.log(`measurable ${idx}`, measurable);
      const placeable = measurable.measure(constraints);
      console.log(`placed measurable ${idx}`, placeable);
      return placeable;
    });
    console.log(
      '[plot] placeables',
      placeables.map((p) => ({
        left: p.left,
        top: p.top,
        right: p.right,
        bottom: p.bottom,
        width: p.width,
        height: p.height,
      })),
    );
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

    const left = _.min(_.map(placeables, 'left')) ?? 0;
    const top = _.min(_.map(placeables, 'top')) ?? 0;
    const width = _.max(_.map(placeables, 'width')) ?? 0;
    const height = _.max(_.map(placeables, 'height')) ?? 0;
    // const right = _.max(_.map(placeables, 'right')) ?? 0;
    // const bottom = _.max(_.map(placeables, 'bottom')) ?? 0;
    console.log('asdfs', 'left', _.map(placeables, 'left'), _.min(_.map(placeables, 'left')));
    console.log('[plot]', 'Plot bbox', { left, top, width, height });
    return {
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
    };
    // const width = _.max(_.map(placeables, 'width')) ?? 0;
    // const height = _.max(_.map(placeables, 'height')) ?? 0;
    // return { width, height };
  };

export const PlotContext = React.createContext<PlotContextValue>({
  dimensions: { width: 0, height: 0 },
  scales: {},
});

// TODO: this is weird b/c we need access to the bbox information to compute the scales, which are
// then passed as data.  Copilot proposes making the scales a separate component that can be
// composed with the marks.
export const Plot2 = withBluefish((props: PropsWithBluefish<Plot2Props>) => {
  const { children, constraints, domRef, id } = useBluefishLayout({}, props, groupMeasurePolicy(props));

  let { data, width, height, children: _, name, guidePrimary, ...scales } = props;
  // compute dimensions from outer width, height, and margins
  const dimensions = { width: width ?? constraints?.width ?? 0, height: height ?? constraints?.height ?? 0 };
  // reify scales
  console.log('scales', scales);
  const reifiedScales = reifyScales(scales as any, dimensions);
  // append "Scale" to scale names
  const renamedScales = renameScales(reifiedScales);
  console.log('[renamedScales]', renamedScales);
  const { xScale, yScale, colorScale } = renamedScales;

  return (
    <g id={id} ref={domRef}>
      <PlotContext.Provider
        value={{
          dimensions,
          scales: renamedScales,
          data,
        }}
      >
        {children}
      </PlotContext.Provider>
    </g>
  );
});
