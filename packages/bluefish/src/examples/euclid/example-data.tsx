// import { Distribute } from '../../components/Distribute';
// import { AlignNew as Align } from '../../components/AlignNew';
// import { Group, Ref, Text } from '../../main';
// import _ from 'lodash';
// import { BertinHotel } from '../bertin/bertin';
// import { Plot2 as Plot } from '../grammars/gog/Plot';

// export const bar_label_spec = {
//   $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
//   description: 'Bar chart with text labels. Set domain to make the frame cover the labels.',
//   data: {
//     values: [
//       { a: 'A', b: 28 },
//       { a: 'B', b: 55 },
//       { a: 'C', b: 43 },
//     ],
//   },
//   encoding: {
//     x: { field: 'a', type: 'nominal' },
//     y: { field: 'b', type: 'quantitative', scale: { domain: [0, 60] } },
//   },
//   layer: [
//     {
//       mark: 'bar',
//     },
//     {
//       transform: [{ filter: 'datum.b > 40' }],
//       layer: [
//         {
//           mark: {
//             type: 'text',
//             align: 'left',
//             baseline: 'middle',
//           },
//           encoding: {
//             x: { value: 65 },
//             text: { field: 'b', type: 'quantitative' },
//           },
//         },
//         {
//           mark: { type: 'rule' },
//           encoding: {
//             x: { field: 'a' },
//             x2: { value: 65 },
//           },
//         },
//       ],
//     },
//   ],
// };

// export const horsepower_max_spec = {
//   $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
//   description: 'Bar chart with text labels. Set domain to make the frame cover the labels.',
//   data: { url: 'data/cars.json' },
//   encoding: {
//     x: { field: 'Horsepower', type: 'quantitative' },
//     y: { field: 'Miles_per_Gallon', type: 'quantitative' },
//   },
//   layer: [
//     {
//       mark: 'point',
//     },
//     {
//       transform: [
//         {
//           window: [
//             {
//               op: 'rank',
//               as: 'rank',
//             },
//           ],
//           sort: [{ field: 'Miles_per_Gallon', order: 'descending' }],
//         },
//         {
//           filter: 'datum.rank <= 1',
//         },
//       ],
//       layer: [
//         {
//           mark: {
//             type: 'text',
//             align: 'left',
//             baseline: 'middle',
//           },
//           encoding: {
//             x: { value: 65 }, // magic value! very brittle
//             text: { field: 'Miles_per_Gallon', type: 'quantitative' },
//           },
//         },
//         {
//           mark: { type: 'rule' }, // add this to add a line
//           encoding: {
//             x: { field: 'Horsepower' },
//             x2: { value: 65 },
//           },
//         },
//       ],
//     },
//   ],
// };

// // transform: [
// //   {window: [{op: 'rank', as: 'rank'}],
// //    sort: [{ field: 'mpg', order: 'descending' }]},
// //   {filter: 'datum.rank <= 1'}],
// // mark: {type: 'text', align: 'left', baseline: 'middle'},
// // encoding: {
// //   xOffset: {value: 5},
// //   text: {field: 'mpg', type: 'Q'},
// // },

// // const horsepower_with_color_spec = {
// //   $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
// //   description: 'Bar chart with text labels. Set domain to make the frame cover the labels.',
// //   data: { url: 'data/cars.json' },
// //   encoding: {
// //     x: { field: 'Horsepower', type: 'quantitative' },
// //     y: { field: 'Miles_per_Gallon', type: 'quantitative' },
// //   },
// //   layer: [
// //     {
// //       mark: 'point',
// //     },
// //     {
// //       transform: [
// //         {
// //           window: [
// //             {
// //               op: 'rank',
// //               as: 'rank',
// //             },
// //           ],
// //           sort: [{ field: 'Miles_per_Gallon', order: 'descending' }],
// //         },
// //         {
// //           filter: 'datum.rank <= 1',
// //         },
// //       ],
// //       layer: [
// //         {
// //           mark: {
// //             type: 'text',
// //             align: 'left',
// //             baseline: 'middle',
// //             dx: 5,
// //           },
// //           encoding: {
// //             // "x": {"value": 100},
// //             text: { field: 'Miles_per_Gallon', type: 'quantitative' },
// //             color: { value: 'green' },
// //           },
// //         },
// //         { mark: 'point', encoding: { color: { value: 'green' } } },
// //         /* {
// //       "mark": { "type": "rule"},
// //       "encoding": {
// //         "x": {"field": "Horsepower"},
// //         "x2": {"value": 65},
// //       }, */
// //         /* } */
// //       ],
// //     },
// //   ],
// // };

// // // Notice that using anything other than a point mark quickly becomes impossible!

// // // spatial proximity - using xOffset channel
// // const textLabel = {
// //   mark: {
// //     type: 'text',
// //     align: 'left',
// //     baseline: 'middle',
// //   },
// //   encoding: {
// //     xOffset: { value: 5 },
// //     text: { field: 'Miles_per_Gallon', type: 'quantitative' },
// //   },
// // };

// // // element connectedness - using param + rule mark
// // // top level param
// // const linkedLabelParam = { params: [{ name: 'pos', expr: 'width + 5' }] };

// // const linkedLabel = {
// //   layer: [
// //     {
// //       mark: {
// //         type: 'text',
// //         align: 'left',
// //         baseline: 'middle',
// //       },
// //       encoding: {
// //         x: { value: { expr: 'pos' } }, // change
// //         text: { field: 'Miles_per_Gallon', type: 'quantitative' },
// //       },
// //     },
// //     // added rule mark
// //     {
// //       mark: { type: 'rule' },
// //       encoding: {
// //         x: { field: 'Horsepower' },
// //         x2: { value: { expr: 'pos' } }, // notice duplication of value
// //       },
// //     },
// //   ],
// // };

// // // similar attribute - using color channel. could also use a param again...
// // const coloredLabel = [
// //   {
// //     mark: {
// //       type: 'text',
// //       align: 'left',
// //       baseline: 'middle',
// //     },
// //     encoding: {
// //       x: { value: { expr: 'pos' } },
// //       text: { field: 'Miles_per_Gallon', type: 'quantitative' },
// //       color: { value: 'green' }, // change
// //     },
// //   },
// //   { mark: 'point', encoding: { color: { value: 'green' } } }, // rule replaced with overdrawn point
// // ];

// // const ex1 = {
// //   mark: {
// //     type: 'text',
// //     align: 'left',
// //     baseline: 'middle',
// //   },
// //   encoding: {
// //     xOffset: { value: 5 },
// //     text: {
// //       field: 'mpg',
// //       type: 'Q',
// //     },
// //   },
// // };

// // const ex2 = [
// //   { params: [{ name: 'pos', expr: 'width + 5' }] },
// //   {
// //     layer: [
// //       {
// //         mark: '...',
// //         encoding: {
// //           x: { value: { expr: 'pos' } },
// //           text: '...',
// //         },
// //       },
// //       {
// //         mark: { type: 'rule' },
// //         encoding: {
// //           x: { field: 'Horsepower' },
// //           x2: { value: { expr: 'pos' } },
// //         },
// //       },
// //     ],
// //   },
// // ];

// // const ex3 = [
// //   { params: ['...', { name: 'color', expr: 'green' }] },
// //   {
// //     layer: [
// //       {
// //         mark: '...',
// //         encoding: {
// //           _: '...',
// //           color: { value: { expr: 'color' } },
// //         },
// //       },
// //       { mark: 'point', encoding: { color: { value: { expr: 'color' } } } },
// //     ],
// //   },
// // ];

// // const plot = useName('plot');
// // const label = useName('label');
// // // const maxDot = lookup(plot, ...);

// // const data = [{ mpg: 10 }];

// // const bf_ex1 = {
// //   names: [useName('plot'), useName('label')],
// //   jsx: (
// //     <>
// //       <Text name={label} contents={_.maxBy(data, 'mpg')?.mpg} />
// //       <Align alignment="centerVertically">
// //         <Ref select={maxDot} />
// //         <Ref select={label} />
// //       </Align>
// //       <Distribute direction="horizontal" spacing={5}>
// //         <Ref select={label} />
// //         <Ref select={maxDot} />
// //       </Distribute>
// //     </>
// //   ),
// // };

// // const bf_ex2 = (
// //   <>
// //     <Distribute direction="horizontal" spacing={5}>
// //       <Ref select={plot} />
// //       <Ref select={label} />
// //     </Distribute>
// //     <Link>
// //       <Ref select={maxDot} />
// //       <Ref select={label} />
// //     </Link>
// //   </>
// // );

// // const bf_ex3 = (
// //   <>
// //     <AlignProps props="fill">
// //       <Ref select={maxDot} />
// //       <Ref select={label} />
// //     </AlignProps>
// //   </>
// // );

// // prettier-ignore
// const first_step = {
//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//   "description": "Bar chart with text labels. Set domain to make the frame cover the labels.",
//   "data": {"url": "data/cars.json"},
//   "encoding": {
//     "x": {"field": "Horsepower", "type": "quantitative"},
//     "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
//   },
//   // delete layer
//     "mark": "point",
//     // delete mark
//   "config": {}
// }
// // prettier-ignore
// const prev_prev_step = {
//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//   "description": "Bar chart with text labels. Set domain to make the frame cover the labels.",
//   "data": {"url": "data/cars.json"},
//   "encoding": {
//     "x": {"field": "Horsepower", "type": "quantitative"},
//     "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
//   },
//   // delete params
//   "layer": [
//     {"mark": "point"},
//     {
//       "transform": [
//         {
//           "window": [{"op": "rank", "as": "rank"}],
//           "sort": [{"field": "Miles_per_Gallon", "order": "descending"}]
//         },
//         {"filter": "datum.rank <= 1"},
//       ],
//       // delete layer
//           "mark": {
//             "type": "text",
//             "align": "left",
//             "baseline": "middle",
//           },
//           "encoding": {
//             // swap encoding channel
//             "xOffset": {"value": 5},
//             // "x": {"value": {"expr": "pos"}},
//             "text": {"field": "Miles_per_Gallon", "type": "quantitative"}
//           }
//         // delete rule
//     },
//   ],
//   "config": {}
// }

// const formated_prev_prev_step = {
//   data: { url: 'data/cars.json' },
//   encoding: {
//     x: { field: 'Horsepower', type: 'quantitative' },
//     y: { field: 'Miles_per_Gallon', type: 'quantitative' },
//   },
//   layer: [
//     { mark: 'point' },
//     {
//       transform: [
//         {
//           window: [{ op: 'rank', as: 'rank' }],
//           sort: [{ field: 'Miles_per_Gallon', order: 'descending' }],
//         },
//         { filter: 'datum.rank <= 1' },
//       ],
//       mark: {
//         type: 'text',
//         align: 'left',
//         baseline: 'middle',
//       },
//       encoding: {
//         xOffset: { value: 5 },
//         text: { field: 'Miles_per_Gallon', type: 'quantitative' },
//       },
//     },
//   ],
// };

// // prettier-ignore
// const prev_step = {
//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//   "description": "Bar chart with text labels. Set domain to make the frame cover the labels.",
//   "data": {"url": "data/cars.json"},
//   "encoding": {
//     "x": {"field": "Horsepower", "type": "quantitative"},
//     "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
//   },
//   "params": [{"name": "pos", "expr": "width + 5"}],
//   "layer": [
//     {"mark": "point"},
//     {
//       "transform": [
//         {
//           "window": [{"op": "rank", "as": "rank"}],
//           "sort": [{"field": "Miles_per_Gallon", "order": "descending"}]
//         },
//         {"filter": "datum.rank <= 1"},
//        // delete calculate
//       ],
//       "layer": [
//         // delete mark
//         {
//           "mark": {
//             "type": "text",
//             "align": "left",
//             "baseline": "middle",
//           },
//           "encoding": {
//             // "xOffset": {"value": 5},
//             "x": {"value": {"expr": "pos"}},
//             "text": {"field": "Miles_per_Gallon", "type": "quantitative"}
//           }
//         },
//         {
//           "mark": {"type": "rule"},
//           "encoding": {"x": {"field": "Horsepower"}, "x2": {"value": {"expr": "pos"}}},
//         },
//       ]
//     },
//   ],
//   "config": {}
// }

// const formatted_prev_step = {
//   data: { url: 'data/cars.json' },
//   encoding: {
//     x: { field: 'Horsepower', type: 'quantitative' },
//     y: { field: 'Miles_per_Gallon', type: 'quantitative' },
//   },
//   params: [{ name: 'pos', expr: 'width + 5' }],
//   layer: [
//     { mark: 'point' },
//     {
//       transform: [
//         {
//           window: [{ op: 'rank', as: 'rank' }],
//           sort: [{ field: 'Miles_per_Gallon', order: 'descending' }],
//         },
//         { filter: 'datum.rank <= 1' },
//         // delete calculate
//       ],
//       layer: [
//         // delete mark
//         {
//           mark: {
//             type: 'text',
//             align: 'left',
//             baseline: 'middle',
//           },
//           encoding: {
//             x: { value: { expr: 'pos' } },
//             text: { field: 'Miles_per_Gallon', type: 'quantitative' },
//           },
//         },
//         {
//           mark: { type: 'rule' },
//           encoding: { x: { field: 'Horsepower' }, x2: { value: { expr: 'pos' } } },
//         },
//       ],
//     },
//   ],
// };

// // prettier-ignore
// const example ={
//   "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
//   "description": "Bar chart with text labels. Set domain to make the frame cover the labels.",
//   "data": {"url": "data/cars.json"},
//   "encoding": {
//     "x": {"field": "Horsepower", "type": "quantitative"},
//     "y": {"field": "Miles_per_Gallon", "type": "quantitative"}
//   },
//   "params": [{"name": "pos", "expr": "width + 5"}],
//   "layer": [
//     {"mark": "point"},
//     {
//       "transform": [
//         {
//           "window": [{"op": "rank", "as": "rank"}],
//           "sort": [{"field": "Miles_per_Gallon", "order": "descending"}]
//         },
//         {"filter": "datum.rank <= 1"},
//         {
//       "calculate": "datum.Miles_per_Gallon - 2",
//       "as": "Miles_per_Gallon_lower"
//     },
//     {
//       "calculate": "datum.Miles_per_Gallon + 2.5",
//       "as": "Miles_per_Gallon_upper"
//     }
//       ],
//       "layer": [
//         {"mark": {"type": "rect", "color": "gold", "opacity": 0.5},
//           "encoding": {
//             "x": {"field": "Horsepower"},
//             "x2": {"value": {"expr": "pos + 25"}},
//             "y": {"field": "Miles_per_Gallon_lower"},
//             "y2": {"field": "Miles_per_Gallon_upper"},
//           }
//         },
//         {
//           "mark": {
//             "type": "text",
//             "align": "left",
//             "baseline": "middle",
//           },
//           "encoding": {
//             // "xOffset": {"value": 5},
//             "x": {"value": {"expr": "pos"}},
//             "text": {"field": "Miles_per_Gallon", "type": "quantitative"}
//           }
//         },
//         {
//           "mark": {"type": "rule"},
//           "encoding": {"x": {"field": "Horsepower"}, "x2": {"value": {"expr": "pos"}}},
//         },
//       ]
//     },
//   ],
//   "config": {}
// }

// const example_formatted = {
//   data: { url: 'data/cars.json' },
//   encoding: {
//     x: { field: 'Horsepower', type: 'quantitative' },
//     y: { field: 'Miles_per_Gallon', type: 'quantitative' },
//   },
//   params: [{ name: 'pos', expr: 'width + 5' }],
//   layer: [
//     { mark: 'point' },
//     {
//       transform: [
//         {
//           window: [{ op: 'rank', as: 'rank' }],
//           sort: [{ field: 'Miles_per_Gallon', order: 'descending' }],
//         },
//         { filter: 'datum.rank <= 1' },
//         {
//           calculate: 'datum.Miles_per_Gallon - 2',
//           as: 'Miles_per_Gallon_lower',
//         },
//         {
//           calculate: 'datum.Miles_per_Gallon + 2.5',
//           as: 'Miles_per_Gallon_upper',
//         },
//       ],
//       layer: [
//         {
//           mark: { type: 'rect', color: 'gold', opacity: 0.5 },
//           encoding: {
//             x: { field: 'Horsepower' },
//             x2: { value: { expr: 'pos + 25' } },
//             y: { field: 'Miles_per_Gallon_lower' },
//             y2: { field: 'Miles_per_Gallon_upper' },
//           },
//         },
//         {
//           mark: {
//             type: 'text',
//             align: 'left',
//             baseline: 'middle',
//           },
//           encoding: {
//             x: { value: { expr: 'pos' } },
//             text: { field: 'Miles_per_Gallon', type: 'quantitative' },
//           },
//         },
//         {
//           mark: { type: 'rule' },
//           encoding: { x: { field: 'Horsepower' }, x2: { value: { expr: 'pos' } } },
//         },
//       ],
//     },
//   ],
// };

// import { Dot } from '../grammars/gog/marks/Dot';
// import { AlignNew as Align } from '../../components/AlignNew';
// import { Distribute } from '../../components/Distribute';

// import { data } from 'data/cars.json';
// import { useName, lookup } from '../../bluefish';

// const BluefishCode = () => {
//   const most_efficient = _.minBy(data, 'mpg');
//   const index_of_most_efficient = _.findIndex(data, most_efficient);

//   const label = useName('label');
//   const dot = useName('dot');
//   const maxDot = lookup(dot, index_of_most_efficient);

//   return (
//     <Group>
//       <Plot data={data} x="hp" y="mpg">
//         <Dot name={dot} />
//       </Plot>
//       <Text name={label} contents={most_efficient.mpg} />
//       <Align alignment="centerVertically">
//         <Ref select={maxDot} />
//         <Ref select={label} />
//       </Align>
//       <Distribute direction="horizontal" spacing={5}>
//         <Ref select={maxDot} />
//         <Ref select={label} />
//       </Distribute>
//     </Group>
//   );
// };

// const BluefishCode3 = () => {
//   const most_efficient = _.minBy(data, 'mpg');
//   const index_of_most_efficient = _.findIndex(data, most_efficient);

//   const plot = useName('plot');
//   const label = useName('label');
//   const dot = useName('dot');
//   const maxDot = lookup(dot, index_of_most_efficient);

//   return (
//     <Group>
//       <Plot name={plot} data={data} x="hp" y="mpg">
//         <Dot name={dot} />
//       </Plot>
//       <Text name={label} contents={most_efficient.mpg} />
//       <Align alignment="centerVertically">
//         <Ref select={maxDot} />
//         <Ref select={label} />
//       </Align>
//       <Distribute direction="horizontal" spacing={5}>
//         <Ref select={plot} />
//         <Ref select={label} />
//       </Distribute>
//       <Link strokeWidth={5}>
//         <Ref select={maxDot} />
//         <Ref select={label} />
//       </Link>
//     </Group>
//   );
// };

// const BluefishCode4 = () => {
//   const most_efficient = _.minBy(data, 'mpg');
//   const index_of_most_efficient = _.findIndex(data, most_efficient);

//   const plot = useName('plot');
//   const label = useName('label');
//   const dot = useName('dot');
//   const maxDot = lookup(dot, index_of_most_efficient);

//   const link = useName('link');

//   return (
//     <Group>
//       <Plot name={plot} data={data} x="hp" y="mpg">
//         <Dot name={dot} />
//       </Plot>
//       <Text name={label} contents={most_efficient.mpg} />
//       <Align alignment="centerVertically">
//         <Ref select={maxDot} />
//         <Ref select={label} />
//       </Align>
//       <Distribute direction="horizontal" spacing={5}>
//         <Ref select={plot} />
//         <Ref select={label} />
//       </Distribute>
//       <Link name={link} strokeWidth={5}>
//         <Ref select={maxDot} />
//         <Ref select={label} />
//       </Link>
//       <Contain padding={top: 2.5, bottom: 2, right: 1}>
//         <Ref select={link} />
//       </Contain>
//     </Group>
//   );
// };
export {};
