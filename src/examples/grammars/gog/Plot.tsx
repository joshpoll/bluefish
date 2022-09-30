import React, { PropsWithChildren } from 'react';
import { Group } from '../../../components/Group';
import { SVG } from '../../../components/SVG';

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

export const reifyScales = (scales: { [key in string]: Scale }, dimensions: any) => {
  let reifiedScales: { [key in string]: any } = {};
  for (const [name, scale] of Object.entries(scales)) {
    reifiedScales[name] = scale(dimensions);
  }
  return reifiedScales;
};

export const plotMark = (mark: Mark, scales: { [key in string]: Scale }, dimensions: Dimensions) => {
  const { data, encodings, scale, render } = mark;
  // 1. Use the encoding functions to extract channels from the data
  const channels = extractChannels(data, encodings);
  // 2. Reify the scales by feeding them the dimensions of the container.
  const reifiedScales = reifyScales(scales, dimensions);
  // 3. Call the mark's scale function get the screen space coordinates.
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

export const renameScales = (scales: { [key in string]: Scale }) => {
  let renamedScales: { [key in string]: any } = {};
  for (const [name, scale] of Object.entries(scales)) {
    renamedScales[name + 'Scale'] = scale;
  }
  return renamedScales;
};

export const plotMarkReified = (mark: Mark, scales: { [key in string]: Scale }, dimensions: Dimensions) => {
  const { data, encodings, scale, render } = mark;
  const channels = extractChannels(data, encodings);
  console.log('channels', channels);
  const scaledData = scale(channels, scales, dimensions);
  console.log('scaledData', scaledData);
  return scaledData.map(render);
};

export type PlotContextValue = {
  data?: any;
  dimensions: Dimensions;
  scales: { [key in string]: Scale };
};

export const PlotContext = React.createContext<PlotContextValue>({
  dimensions: { width: 0, height: 0 },
  scales: {},
});

export const Plot: React.FC<PropsWithChildren<PlotProps>> = (props) => {
  let { width, height, margin, data, children, ...scales } = props;
  // compute dimensions from outer width, height, and margins
  const dimensions = { width: width - margin.left - margin.right, height: height - margin.bottom - margin.top };
  // reify scales
  const reifiedScales = reifyScales(scales as any, dimensions);
  // append "Scale" to scale names
  const renamedScales = renameScales(reifiedScales);
  console.log('[renamedScales]', renamedScales);
  const { xScale, yScale, colorScale } = renamedScales;
  return (
    // TODO: contexts don't work inside Bluefish components...
    <PlotContext.Provider value={{ dimensions, scales: renamedScales, data }}>
      <SVG width={width} height={height}>
        <Group /* x={margin.left} y={margin.top} */>{children}</Group>
      </SVG>
    </PlotContext.Provider>
  );
};
