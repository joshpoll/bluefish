import { withBluefish, Measure } from '../bluefish';

/* TODO: convert to new Bluefish */

// const svgMeasurePolicy: Measure = (measurables, constraints) => {
//   const placeables = measurables.map((measurable) => measurable.measure(constraints));
//   placeables.forEach((placeable) => {
//     placeable.placeUnlessDefined({ x: 0, y: 0 });
//   });
//   return { width: constraints.width, height: constraints.height };
// };

// export const SVGClass = withBluefish(({ width, height }: { width: number; height: number }) => svgMeasurePolicy)(
//   (props) => {
//     return (
//       <svg width={props.width} height={props.height}>
//         {props.children}
//       </svg>
//     );
//   },
// );
