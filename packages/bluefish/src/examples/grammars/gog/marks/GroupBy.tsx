import _ from 'lodash';
import React from 'react';
import { withBluefish, PropsWithBluefishFn } from '../../../../bluefish';
import { Col, Rect, Row, Text } from '../../../../main';
import { PlotContext } from '../Plot';
import { ReactNode } from 'react';

export type GroupByProps<T> = PropsWithBluefishFn<{
  // x?: keyof T;
  // y?: keyof T;
  field: keyof T;
  data?: T[];
  totalWidth?: number;
  totalHeight?: number;
  verticalSpacing?: number;
  horizontalSpacing?: number;
  numRows?: number;
  numCols?: number;
  positioning?: (keyof T | null | undefined)[][] | (({ x, y }: { x: number; y: number }) => keyof T | null | undefined);
}>;

export const GroupBy = withBluefish((props: GroupByProps<any>) => {
  const context = React.useContext(PlotContext);
  const data = props.data ?? context.data;
  const totalWidth = props.totalWidth ?? context.dimensions.width;
  const totalHeight = props.totalHeight ?? context.dimensions.height;

  const positioningMatrixDims = Array.isArray(props.positioning)
    ? {
        numRows: props.positioning.length,
        numCols: props.positioning[0].length,
      }
    : {};

  const groupedData = _.groupBy(data, props.field);

  // compute numRows. if numRows is not specified, then compute it from the number of groups
  // const numRows =
  //   props.numRows ??
  //   (props.numColumns !== undefined ? Math.ceil(Object.keys(groupedData).length / props.numColumns) : 1);

  // compute numColumns. if numColumns is not specified, then compute it from the number of groups
  const numCols =
    props.numCols ??
    positioningMatrixDims.numCols ??
    (props.numRows !== undefined
      ? Math.ceil(Object.keys(groupedData).length / props.numRows)
      : Object.keys(groupedData).length);

  const grid =
    props.positioning !== undefined
      ? Array.isArray(props.positioning)
        ? _.range(positioningMatrixDims.numRows!).map((row) =>
            _.range(positioningMatrixDims.numCols!).map((col) => {
              const key = (props.positioning as any[][])[row][col];
              console.log('grid key', key);
              const data = groupedData[key as string];
              return data !== undefined ? (
                (props.children as ({ key, data }: { key: any; data: any }) => ReactNode)({ key, data })
              ) : (
                <Rect height={30} width={40} fill="none" />
              );
            }),
          )
        : /* position data based in rows and cols based on given positioning map. fill the gaps with nulls */
          _.range(props.numRows ?? 1).map((row) =>
            _.range(props.numCols ?? 1).map((col) => {
              const key = (props.positioning as ({ x, y }: { x: number; y: number }) => string)!({ x: col, y: row });
              const data = groupedData[key as string];
              return data !== undefined
                ? (props.children as ({ key, data }: { key: any; data: any }) => ReactNode)({ key, data })
                : null;
            }),
          )
      : _.chunk(
          Object.entries(groupedData).map(([key, value]) =>
            (props.children as ({ key, data }: { key: string; data: any }) => ReactNode)({ key, data: value }),
          ),
          numCols,
        );

  console.log('grid', grid);

  return (
    <Col totalHeight={totalHeight} spacing={props.verticalSpacing} alignment="center">
      {grid.map((chunk, i) => (
        <Row totalWidth={totalWidth} spacing={props.horizontalSpacing} alignment="middle">
          {chunk}
        </Row>
      ))}
    </Col>
  );
});
GroupBy.displayName = 'GroupBy';
