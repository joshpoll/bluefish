import { PropsWithChildren } from 'react';
import { withBluefish, BBox, useBluefishLayout } from '../bluefish';

export type ArrowProps = {
  from: React.MutableRefObject<any> | undefined;
  to: React.MutableRefObject<any> | undefined;
};

const arrowMeasurePolicy = ({ from, to }: ArrowProps) => {
  return () => {
    const fromBox = from?.current.measure();
    const toBox = to?.current.measure();
    return { width: 0, height: 0 };
  };
};

export const Arrow = withBluefish((props: PropsWithChildren<ArrowProps>) => {
  const { bbox } = useBluefishLayout({}, props, arrowMeasurePolicy(props));

  return (
    <line
      x1={bbox.left ?? 0}
      x2={(bbox.left ?? 0) + (bbox.width ?? 0)}
      y1={bbox.top ?? 0}
      y2={(bbox.top ?? 0) + (bbox.height ?? 0)}
    />
  );
});
