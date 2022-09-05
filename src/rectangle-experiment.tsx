import * as _ from 'lodash';
import React, {
  ComponentType,
  forwardRef,
  isValidElement,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useRef } from 'react';
import { BBox, Constraints, Placeable, useFigLayout, withFig } from './fig';
import { Layout, Measure } from './react-experiment';

export type RectProps = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill: string;
};

// const measurePolicy: Measure = (_measurables, _constraints) => {
//   return { width, height };
// };

export const useMeasure = (measure: Measure, childrenRef?: any): BBox => {
  return measure(
    // pass child measure function
    childrenRef === undefined ? [] : childrenRef.current,
    {},
  ) as BBox;
};

export const Rect = forwardRef((props: RectProps, ref) => {
  //   const { x, y, width, height } = useMeasure(measurePolicy);
  //   const [width, setWidth] = useState<number | undefined>(props.width);
  //   const [height, setHeight] = useState<number | undefined>(props.height);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [x, setX] = useState<number | undefined>(props.x);
  const [y, setY] = useState<number | undefined>(props.y);

  const place = useCallback(({ x, y }: { x?: number; y?: number }) => {
    console.log('rect: place', x, y);
    if (x !== undefined) setX(x);
    if (y !== undefined) setY(y);
  }, []);

  const placeUnlessDefined = useCallback(
    (point: { x?: number; y?: number }) => {
      console.log('rect: placeUnlessDefined', point);
      if (point.x !== undefined && x !== undefined) setX(x);
      if (point.y !== undefined && y !== undefined) setY(y);
    },
    [x, y],
  );

  useImperativeHandle(
    ref,
    () => ({
      measure(constraints: Constraints): Placeable {
        console.log('measuring rect');
        // TODO: make the `set` logic smarter here, incorporating constraints
        const width = props.width ?? 0;
        const height = props.height ?? 0;
        setWidth(width);
        setHeight(height);
        return { measuredWidth: width, measuredHeight: height, place, placeUnlessDefined };
      },
    }),
    [place, placeUnlessDefined, props.width, props.height],
  );

  return <rect x={x ?? 0} y={y ?? 0} width={width ?? 0} height={height ?? 0} fill={props.fill} />;
});

export type SVGProps = {
  width: number;
  height: number;
};

const svgMeasurePolicy: Measure = (measurables, constraints) => {
  console.log('measuring children', measurables);
  const placeables = measurables.map((measurable) => measurable.measure(constraints));
  placeables.forEach((placeable) => {
    placeable.placeUnlessDefined({ x: 0, y: 0 });
  });
  return { width: constraints.width, height: constraints.height };
};

export const SVG = (props: PropsWithChildren<SVGProps>) => {
  const childrenRef = useRef<any>([]);
  const { width, height } = useMeasure(svgMeasurePolicy);

  //   useCallback(() => {
  //     console.log('childrenRef', childrenRef.current);
  //     return svgMeasurePolicy(childrenRef.current, { width: props.width, height: props.height });
  //   }, [props.height, props.width]);
  useEffect(() => {
    svgMeasurePolicy(childrenRef.current, { width: props.width, height: props.height });
  });

  return (
    <svg width={width} height={height}>
      {React.Children.map(props.children, (child, index) =>
        //   TODO: not sure why this cast is necessary
        React.cloneElement(child as ReactElement, {
          ref: (ref: any) => (childrenRef.current[index] = ref),
        }),
      )}
    </svg>
  );
};

const colMeasurePolicy: Measure = (measurables, constraints: Constraints) => {
  const placeables = measurables.map((measurable) => measurable.measure(constraints)) as Placeable[];
  // TODO: make proper interface for placeable with width and height (not measuredWidth and measuredHeight)
  const height = _.sumBy(placeables, 'measuredHeight');
  const width = _.max(_.map(placeables, 'measuredWidth')) ?? 0;

  let y = 0;
  placeables.forEach((placeable) => {
    console.log('col: placing', placeable, 'at', { x: 0, y });
    placeable.place({ x: 0, y });
    y += placeable.measuredHeight;
  });

  return { width, height };
};

export type ColumnProps = {
  x?: number;
  y?: number;
  //   width?: number;
  //   height?: number;
};

export const Column = forwardRef((props: PropsWithChildren<ColumnProps>, ref) => {
  const childrenRef = useRef<any>([]);
  //   const { x, y, width, height } = useMeasure(measurePolicy);
  //   const [width, setWidth] = useState<number | undefined>(props.width);
  //   const [height, setHeight] = useState<number | undefined>(props.height);
  const [_width, setWidth] = useState<number | undefined>(undefined);
  const [_height, setHeight] = useState<number | undefined>(undefined);
  const [x, setX] = useState<number | undefined>(props.x);
  const [y, setY] = useState<number | undefined>(props.y);

  const place = useCallback(({ x, y }: { x?: number; y?: number }) => {
    console.log('placing column', x, y);
    if (x !== undefined) setX(x);
    if (y !== undefined) setY(y);
  }, []);

  const placeUnlessDefined = useCallback(
    (point: { x?: number; y?: number }) => {
      console.log('placeUnlessDefined', point);
      if (point.x !== undefined && x !== undefined) setX(x);
      if (point.y !== undefined && y !== undefined) setY(y);
    },
    [x, y],
  );

  useImperativeHandle(
    ref,
    () => ({
      measure(constraints: Constraints): Placeable {
        console.log('measuring col');
        const { width, height } = colMeasurePolicy(childrenRef.current, constraints);
        setWidth(width);
        setHeight(height);
        return { measuredWidth: width!, measuredHeight: height!, place, placeUnlessDefined };
      },
    }),
    [place, placeUnlessDefined],
  );

  return (
    <g transform={`translate(${x ?? 0}, ${y ?? 0})`}>
      {React.Children.map(props.children, (child, index) =>
        //   TODO: not sure why this cast is necessary
        React.cloneElement(child as ReactElement, {
          ref: (ref: any) => (childrenRef.current[index] = ref),
        }),
      )}
    </g>
  );
});

export const FigColumn = forwardRef((props: PropsWithChildren<ColumnProps>, ref) => {
  const { x, y, width, height, children } = useFigLayout(
    colMeasurePolicy,
    { x: props.x, y: props.y },
    ref,
    props.children,
  );

  return <g transform={`translate(${x ?? 0}, ${y ?? 0})`}>{children}</g>;
});

export const FigColumnHOC = withFig(colMeasurePolicy, (props: PropsWithChildren<ColumnProps>) => {
  return <g transform={`translate(${props.x ?? 0}, ${props.y ?? 0})`}>{props.children}</g>;
});
