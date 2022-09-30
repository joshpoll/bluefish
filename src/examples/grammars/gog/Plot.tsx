import { Group } from '../../../components/Group';
import { SVG } from '../../../components/SVG';

export const extractChannels = (data: any, encodings: any) => {
  let channels: any = {};
  for (const [c, encoding] of Object.entries(encodings)) {
    channels[c.toUpperCase()] = data.map((d: any) => d[encoding as string]);
  }
  return channels;
};

export const reifyScales = (scales: any, dimensions: any) => {
  let reifiedScales: any = {};
  for (const [name, scale] of Object.entries(scales)) {
    reifiedScales[name] = (scale as any)(dimensions);
  }
  return reifiedScales;
};

export const plotMark = (mark: any, scales: any, dimensions: any) => {
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

export type PlotProps = {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  x?: any;
  y?: any;
  color?: any;
  marks: Mark[];
};

export const renameScales = (scales: { [key in string]: any }) => {
  let renamedScales: { [key in string]: any } = {};
  for (const [name, scale] of Object.entries(scales)) {
    renamedScales[name + 'Scale'] = scale;
  }
  return renamedScales;
};

export const plotMarkReified = (mark: any, scales: any, dimensions: any) => {
  const { data, encodings, scale, render } = mark;
  const channels = extractChannels(data, encodings);
  console.log('channels', channels);
  const scaledData = scale(channels, scales, dimensions);
  console.log('scaledData', scaledData);
  return scaledData.map(render);
};

export const Plot: React.FC<PlotProps> = (props) => {
  let { width, height, margin, marks, ...scales } = props;
  // compute dimensions from outer width, height, and margins
  const dimensions = { width: width - margin.left - margin.right, height: height - margin.bottom - margin.top };
  // reify scales
  const reifiedScales = reifyScales(scales, dimensions);
  // append "Scale" to scale names
  const renamedScales = renameScales(reifiedScales);
  console.log('[renamedScales]', renamedScales);
  const { xScale, yScale, colorScale } = renamedScales;
  return (
    <SVG width={width} height={height}>
      <Group /* x={margin.left} y={margin.top} */>
        {marks.map((mark: any) => plotMarkReified(mark, renamedScales, dimensions))}
      </Group>
    </SVG>
  );
  // svg(
  //   { width, height },
  //   g({ x: margin.left, y: margin.top }, [
  //     // here are our axes and legends!
  //     g({ y: dimensions.height }, xAxis(xScale)),
  //     g({}, yAxis(yScale)),
  //     ...(colorScale ? [g({ x: dimensions.width - 350 }, Legend(colorScale))] : []),
  //     // and here are our marks! (we use a modified version of `plotMark` that assumes the scales have already been reified)
  //     ...marks.map((m) =>
  //       /* TODO: not sure why this is off by half a pixel... */
  //       g({ x: 0, y: -0.5 }, plotMarkReified(m, scales, dimensions)),
  //     ),
  //   ]),
  // );
};
