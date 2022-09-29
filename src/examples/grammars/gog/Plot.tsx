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

export const plot = (mark: any, scales: any, dimensions: any) => {
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
