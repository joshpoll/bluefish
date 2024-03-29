import { tidy, groupBy, Key } from '@tidyjs/tidy';
import { svg, row, rect, text, col, group } from '../component';
import { padding } from '../modifier';
import * as d3 from 'd3-array';
import { Component } from '../componentTypes';

const data = [
  { type: '1. % CLIENTELE FEMALE', month: 'Jan', count: 26 },
  { type: '1. % CLIENTELE FEMALE', month: 'Feb', count: 21 },
  { type: '1. % CLIENTELE FEMALE', month: 'Mar', count: 26 },
  { type: '1. % CLIENTELE FEMALE', month: 'Apr', count: 28 },
  { type: '1. % CLIENTELE FEMALE', month: 'May', count: 20 },
  { type: '1. % CLIENTELE FEMALE', month: 'Jun', count: 20 },
  { type: '1. % CLIENTELE FEMALE', month: 'Jul', count: 20 },
  { type: '1. % CLIENTELE FEMALE', month: 'Aug', count: 20 },
  { type: '1. % CLIENTELE FEMALE', month: 'Sep', count: 20 },
  { type: '1. % CLIENTELE FEMALE', month: 'Oct', count: 40 },
  { type: '1. % CLIENTELE FEMALE', month: 'Nov', count: 15 },
  { type: '1. % CLIENTELE FEMALE', month: 'Dec', count: 40 },
  { type: '2. % CLIENTELE LOCAL', month: 'Jan', count: 69 },
  { type: '2. % CLIENTELE LOCAL', month: 'Feb', count: 70 },
  { type: '2. % CLIENTELE LOCAL', month: 'Mar', count: 77 },
  { type: '2. % CLIENTELE LOCAL', month: 'Apr', count: 71 },
  { type: '2. % CLIENTELE LOCAL', month: 'May', count: 37 },
  { type: '2. % CLIENTELE LOCAL', month: 'Jun', count: 36 },
  { type: '2. % CLIENTELE LOCAL', month: 'Jul', count: 39 },
  { type: '2. % CLIENTELE LOCAL', month: 'Aug', count: 39 },
  { type: '2. % CLIENTELE LOCAL', month: 'Sep', count: 55 },
  { type: '2. % CLIENTELE LOCAL', month: 'Oct', count: 60 },
  { type: '2. % CLIENTELE LOCAL', month: 'Nov', count: 68 },
  { type: '2. % CLIENTELE LOCAL', month: 'Dec', count: 72 },
  { type: '3. % CLIENTELE USA', month: 'Jan', count: 7 },
  { type: '3. % CLIENTELE USA', month: 'Feb', count: 6 },
  { type: '3. % CLIENTELE USA', month: 'Mar', count: 3 },
  { type: '3. % CLIENTELE USA', month: 'Apr', count: 6 },
  { type: '3. % CLIENTELE USA', month: 'May', count: 23 },
  { type: '3. % CLIENTELE USA', month: 'Jun', count: 14 },
  { type: '3. % CLIENTELE USA', month: 'Jul', count: 19 },
  { type: '3. % CLIENTELE USA', month: 'Aug', count: 14 },
  { type: '3. % CLIENTELE USA', month: 'Sep', count: 9 },
  { type: '3. % CLIENTELE USA', month: 'Oct', count: 6 },
  { type: '3. % CLIENTELE USA', month: 'Nov', count: 8 },
  { type: '3. % CLIENTELE USA', month: 'Dec', count: 8 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'Jan', count: 0 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'Feb', count: 0 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'Mar', count: 0 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'Apr', count: 0 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'May', count: 8 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'Jun', count: 6 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'Jul', count: 6 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'Aug', count: 4 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'Sep', count: 2 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'Oct', count: 12 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'Nov', count: 0 },
  { type: '4. % CLIENTELE SOUTH-AMERICA', month: 'Dec', count: 0 },
  { type: '5. % CLIENTELE EUROPE', month: 'Jan', count: 20 },
  { type: '5. % CLIENTELE EUROPE', month: 'Feb', count: 15 },
  { type: '5. % CLIENTELE EUROPE', month: 'Mar', count: 14 },
  { type: '5. % CLIENTELE EUROPE', month: 'Apr', count: 15 },
  { type: '5. % CLIENTELE EUROPE', month: 'May', count: 23 },
  { type: '5. % CLIENTELE EUROPE', month: 'Jun', count: 27 },
  { type: '5. % CLIENTELE EUROPE', month: 'Jul', count: 22 },
  { type: '5. % CLIENTELE EUROPE', month: 'Aug', count: 30 },
  { type: '5. % CLIENTELE EUROPE', month: 'Sep', count: 27 },
  { type: '5. % CLIENTELE EUROPE', month: 'Oct', count: 19 },
  { type: '5. % CLIENTELE EUROPE', month: 'Nov', count: 19 },
  { type: '5. % CLIENTELE EUROPE', month: 'Dec', count: 17 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'Jan', count: 1 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'Feb', count: 0 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'Mar', count: 0 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'Apr', count: 8 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'May', count: 6 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'Jun', count: 4 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'Jul', count: 6 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'Aug', count: 4 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'Sep', count: 2 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'Oct', count: 1 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'Nov', count: 0 },
  { type: '6. % CLIENTELE M.EAST, AFRICA', month: 'Dec', count: 1 },
  { type: '7. % CLIENTELE ASIA', month: 'Jan', count: 3 },
  { type: '7. % CLIENTELE ASIA', month: 'Feb', count: 10 },
  { type: '7. % CLIENTELE ASIA', month: 'Mar', count: 6 },
  { type: '7. % CLIENTELE ASIA', month: 'Apr', count: 0 },
  { type: '7. % CLIENTELE ASIA', month: 'May', count: 3 },
  { type: '7. % CLIENTELE ASIA', month: 'Jun', count: 13 },
  { type: '7. % CLIENTELE ASIA', month: 'Jul', count: 8 },
  { type: '7. % CLIENTELE ASIA', month: 'Aug', count: 9 },
  { type: '7. % CLIENTELE ASIA', month: 'Sep', count: 5 },
  { type: '7. % CLIENTELE ASIA', month: 'Oct', count: 2 },
  { type: '7. % CLIENTELE ASIA', month: 'Nov', count: 5 },
  { type: '7. % CLIENTELE ASIA', month: 'Dec', count: 2 },
  { type: '8. % BUSINESSMEN', month: 'Jan', count: 78 },
  { type: '8. % BUSINESSMEN', month: 'Feb', count: 80 },
  { type: '8. % BUSINESSMEN', month: 'Mar', count: 85 },
  { type: '8. % BUSINESSMEN', month: 'Apr', count: 86 },
  { type: '8. % BUSINESSMEN', month: 'May', count: 85 },
  { type: '8. % BUSINESSMEN', month: 'Jun', count: 87 },
  { type: '8. % BUSINESSMEN', month: 'Jul', count: 70 },
  { type: '8. % BUSINESSMEN', month: 'Aug', count: 76 },
  { type: '8. % BUSINESSMEN', month: 'Sep', count: 87 },
  { type: '8. % BUSINESSMEN', month: 'Oct', count: 85 },
  { type: '8. % BUSINESSMEN', month: 'Nov', count: 87 },
  { type: '8. % BUSINESSMEN', month: 'Dec', count: 80 },
  { type: '9. % TOURISTS', month: 'Jan', count: 22 },
  { type: '9. % TOURISTS', month: 'Feb', count: 20 },
  { type: '9. % TOURISTS', month: 'Mar', count: 15 },
  { type: '9. % TOURISTS', month: 'Apr', count: 14 },
  { type: '9. % TOURISTS', month: 'May', count: 15 },
  { type: '9. % TOURISTS', month: 'Jun', count: 13 },
  { type: '9. % TOURISTS', month: 'Jul', count: 30 },
  { type: '9. % TOURISTS', month: 'Aug', count: 24 },
  { type: '9. % TOURISTS', month: 'Sep', count: 13 },
  { type: '9. % TOURISTS', month: 'Oct', count: 15 },
  { type: '9. % TOURISTS', month: 'Nov', count: 13 },
  { type: '9. % TOURISTS', month: 'Dec', count: 20 },
  { type: '10. % DIRECT RESERVATIONS', month: 'Jan', count: 70 },
  { type: '10. % DIRECT RESERVATIONS', month: 'Feb', count: 70 },
  { type: '10. % DIRECT RESERVATIONS', month: 'Mar', count: 75 },
  { type: '10. % DIRECT RESERVATIONS', month: 'Apr', count: 74 },
  { type: '10. % DIRECT RESERVATIONS', month: 'May', count: 69 },
  { type: '10. % DIRECT RESERVATIONS', month: 'Jun', count: 68 },
  { type: '10. % DIRECT RESERVATIONS', month: 'Jul', count: 74 },
  { type: '10. % DIRECT RESERVATIONS', month: 'Aug', count: 75 },
  { type: '10. % DIRECT RESERVATIONS', month: 'Sep', count: 68 },
  { type: '10. % DIRECT RESERVATIONS', month: 'Oct', count: 68 },
  { type: '10. % DIRECT RESERVATIONS', month: 'Nov', count: 64 },
  { type: '10. % DIRECT RESERVATIONS', month: 'Dec', count: 75 },
  { type: '11. % AGENCY RESERVATIONS', month: 'Jan', count: 20 },
  { type: '11. % AGENCY RESERVATIONS', month: 'Feb', count: 18 },
  { type: '11. % AGENCY RESERVATIONS', month: 'Mar', count: 19 },
  { type: '11. % AGENCY RESERVATIONS', month: 'Apr', count: 17 },
  { type: '11. % AGENCY RESERVATIONS', month: 'May', count: 27 },
  { type: '11. % AGENCY RESERVATIONS', month: 'Jun', count: 27 },
  { type: '11. % AGENCY RESERVATIONS', month: 'Jul', count: 19 },
  { type: '11. % AGENCY RESERVATIONS', month: 'Aug', count: 19 },
  { type: '11. % AGENCY RESERVATIONS', month: 'Sep', count: 26 },
  { type: '11. % AGENCY RESERVATIONS', month: 'Oct', count: 27 },
  { type: '11. % AGENCY RESERVATIONS', month: 'Nov', count: 21 },
  { type: '11. % AGENCY RESERVATIONS', month: 'Dec', count: 15 },
  { type: '12. % AIR CREWS', month: 'Jan', count: 10 },
  { type: '12. % AIR CREWS', month: 'Feb', count: 12 },
  { type: '12. % AIR CREWS', month: 'Mar', count: 6 },
  { type: '12. % AIR CREWS', month: 'Apr', count: 9 },
  { type: '12. % AIR CREWS', month: 'May', count: 4 },
  { type: '12. % AIR CREWS', month: 'Jun', count: 5 },
  { type: '12. % AIR CREWS', month: 'Jul', count: 7 },
  { type: '12. % AIR CREWS', month: 'Aug', count: 6 },
  { type: '12. % AIR CREWS', month: 'Sep', count: 6 },
  { type: '12. % AIR CREWS', month: 'Oct', count: 5 },
  { type: '12. % AIR CREWS', month: 'Nov', count: 15 },
  { type: '12. % AIR CREWS', month: 'Dec', count: 10 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'Jan', count: 2 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'Feb', count: 2 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'Mar', count: 4 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'Apr', count: 2 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'May', count: 2 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'Jun', count: 1 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'Jul', count: 1 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'Aug', count: 2 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'Sep', count: 2 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'Oct', count: 4 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'Nov', count: 2 },
  { type: '13. % CLIENTS UNDER 20 YEARS', month: 'Dec', count: 5 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'Jan', count: 25 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'Feb', count: 27 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'Mar', count: 37 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'Apr', count: 35 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'May', count: 25 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'Jun', count: 25 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'Jul', count: 27 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'Aug', count: 28 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'Sep', count: 24 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'Oct', count: 30 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'Nov', count: 24 },
  { type: '14. % CLIENTS 20-35 YEARS', month: 'Dec', count: 30 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'Jan', count: 48 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'Feb', count: 49 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'Mar', count: 42 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'Apr', count: 48 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'May', count: 54 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'Jun', count: 55 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'Jul', count: 53 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'Aug', count: 51 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'Sep', count: 55 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'Oct', count: 46 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'Nov', count: 55 },
  { type: '15. % CLIENTS 35-55 YEARS', month: 'Dec', count: 43 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'Jan', count: 25 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'Feb', count: 22 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'Mar', count: 17 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'Apr', count: 15 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'May', count: 19 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'Jun', count: 19 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'Jul', count: 19 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'Aug', count: 19 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'Sep', count: 19 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'Oct', count: 20 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'Nov', count: 19 },
  { type: '16. % CLIENTS MORE THAN 55 YEARS', month: 'Dec', count: 22 },
  { type: '17. PRICE OF ROOMS', month: 'Jan', count: 163 },
  { type: '17. PRICE OF ROOMS', month: 'Feb', count: 167 },
  { type: '17. PRICE OF ROOMS', month: 'Mar', count: 166 },
  { type: '17. PRICE OF ROOMS', month: 'Apr', count: 174 },
  { type: '17. PRICE OF ROOMS', month: 'May', count: 152 },
  { type: '17. PRICE OF ROOMS', month: 'Jun', count: 155 },
  { type: '17. PRICE OF ROOMS', month: 'Jul', count: 145 },
  { type: '17. PRICE OF ROOMS', month: 'Aug', count: 170 },
  { type: '17. PRICE OF ROOMS', month: 'Sep', count: 157 },
  { type: '17. PRICE OF ROOMS', month: 'Oct', count: 174 },
  { type: '17. PRICE OF ROOMS', month: 'Nov', count: 165 },
  { type: '17. PRICE OF ROOMS', month: 'Dec', count: 158 },
  { type: '18. LENGTH OF STAY', month: 'Jan', count: 1.65 },
  { type: '18. LENGTH OF STAY', month: 'Feb', count: 1.71 },
  { type: '18. LENGTH OF STAY', month: 'Mar', count: 1.65 },
  { type: '18. LENGTH OF STAY', month: 'Apr', count: 1.91 },
  { type: '18. LENGTH OF STAY', month: 'May', count: 1.9 },
  { type: '18. LENGTH OF STAY', month: 'Jun', count: 2 },
  { type: '18. LENGTH OF STAY', month: 'Jul', count: 1.54 },
  { type: '18. LENGTH OF STAY', month: 'Aug', count: 1.6 },
  { type: '18. LENGTH OF STAY', month: 'Sep', count: 1.73 },
  { type: '18. LENGTH OF STAY', month: 'Oct', count: 1.82 },
  { type: '18. LENGTH OF STAY', month: 'Nov', count: 1.66 },
  { type: '18. LENGTH OF STAY', month: 'Dec', count: 1.44 },
  { type: '19. % OCCUPANCY', month: 'Jan', count: 67 },
  { type: '19. % OCCUPANCY', month: 'Feb', count: 82 },
  { type: '19. % OCCUPANCY', month: 'Mar', count: 70 },
  { type: '19. % OCCUPANCY', month: 'Apr', count: 83 },
  { type: '19. % OCCUPANCY', month: 'May', count: 74 },
  { type: '19. % OCCUPANCY', month: 'Jun', count: 77 },
  { type: '19. % OCCUPANCY', month: 'Jul', count: 56 },
  { type: '19. % OCCUPANCY', month: 'Aug', count: 62 },
  { type: '19. % OCCUPANCY', month: 'Sep', count: 90 },
  { type: '19. % OCCUPANCY', month: 'Oct', count: 92 },
  { type: '19. % OCCUPANCY', month: 'Nov', count: 78 },
  { type: '19. % OCCUPANCY', month: 'Dec', count: 55 },
  { type: '20. CONVENTIONS', month: 'Jan', count: 0 },
  { type: '20. CONVENTIONS', month: 'Feb', count: 0 },
  { type: '20. CONVENTIONS', month: 'Mar', count: 0 },
  { type: '20. CONVENTIONS', month: 'Apr', count: 1 },
  { type: '20. CONVENTIONS', month: 'May', count: 1 },
  { type: '20. CONVENTIONS', month: 'Jun', count: 1 },
  { type: '20. CONVENTIONS', month: 'Jul', count: 0 },
  { type: '20. CONVENTIONS', month: 'Aug', count: 0 },
  { type: '20. CONVENTIONS', month: 'Sep', count: 1 },
  { type: '20. CONVENTIONS', month: 'Oct', count: 1 },
  { type: '20. CONVENTIONS', month: 'Nov', count: 1 },
  { type: '20. CONVENTIONS', month: 'Dec', count: 1 },
];

/* Bertin's hand-picked order, grouping metrics by seasonal pattern. */
const order = [18, 17, 19, 7, 10, 3, 11, 12, 15, 13, 0, 1, 6, 8, 9, 16, 5, 2, 4, 14];

const maxes = d3.rollup(
  data,
  (v) => d3.max(v, (d) => d.count),
  (d) => d.type,
);

const means = d3.rollup(
  data,
  (v) => d3.mean(v, (d) => d.count),
  (d) => d.type,
);

const groupedData = tidy(
  data,
  groupBy('type', groupBy.entriesObject()),
  (
    data: {
      key: Key;
      values: {
        type: string;
        month: string;
        count: number;
      }[];
    }[],
  ) => d3.permute(data, order),
);

const cw = 11;

const h = 20;

const bar = ({ type, count }: { type: string; count: number }) =>
  rect({
    width: cw,
    height: (count / maxes.get(type)!) * h,
    stroke: 'black',
    strokeWidth: 1,
    shapeRendering: 'crispEdges',
    fill: count > means.get(type)! ? 'black' : 'white',
  });

/* 
vis.add(pv.Label)
    .data(pv.repeat("JFMAMJJASOND".split("")))
    .top(function() ((this.index % 6) > 2) ? 16 : 14)
    .left(function() cw * (this.index + .5))
    .textAlign("center")
    .font("bold 15px Arial");
*/

const monthLabels = 'JFMAMJJASOND'
  .split('')
  .map((m, i) =>
    text(m, { x: cw * (i + 0.5), y: i % 6 > 2 ? 16 : 14, fontFamily: 'Arial', fontSize: '15px', fontWeight: 'bold' }),
  );

console.log('bertinHotel');
export const bertinHotel = svg([
  col(
    { y: 35, spacing: 5, alignment: 'left' },
    groupedData.map(({ key, values }) => {
      return row({ spacing: 8, alignment: 'bottom' }, [
        row(
          { spacing: 0, alignment: 'bottom' },
          values.map((d) => bar(d)),
        ),
        text(key.toString(), { fontSize: '13px', fontFamily: 'Georgia' }),
      ]);
    }),
  ).mod(padding({ left: 5, right: 200, bottom: 100, top: 5 })),
  group(monthLabels),
]);

const visualize = <T>(data: T, render: (data: T) => Component): Component => render(data);

function colC(options: any): (children: Component[]) => Component;
function colC(options: any, children: Component[]): Component;
function colC(options: any, children?: Component[]): Component | ((children: Component[]) => Component) {
  if (children === undefined) {
    return (children: Component[]) => col(options, children);
  } else {
    return col(options, children);
  }
}

export const bertinHotelV = svg([
  visualize(
    groupedData.map(({ key, values }) => {
      //   console.log('key', key);
      return row({ spacing: 8, alignment: 'bottom' }, [
        row(
          { spacing: 0, alignment: 'bottom' },
          values.map((d) => bar(d)),
        ),
        text('test'),
      ]);
    }),
    // (data) => col({ spacing: 5, alignment: 'center' }, data),
    // (data) => colC({ spacing: 5, alignment: 'center' }, data),
    colC({ spacing: 5, alignment: 'center' }),
  ),
]);
