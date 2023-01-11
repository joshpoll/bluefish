import { PaperScope } from 'paper/dist/paper-core';
import { PropsWithChildren } from 'react';
import { withBluefish, BBox, useBluefishLayout } from '../bluefish';
import { NewBBox } from '../NewBBox';

export type PathProps = React.SVGProps<SVGPathElement> & Partial<BBox>;

const pathMeasurePolicy = ({ d }: PathProps) => {
  const canvas = document.createElement('canvas');
  const paperScope = new PaperScope();
  paperScope.setup(canvas);
  const path = new paperScope.Path(d!);
  const bounds = path.bounds;
  return () => {
    return {
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
    };
  };
};

export const Path = withBluefish((props: PropsWithChildren<PathProps>) => {
  const { ...rest } = props;

  const { bbox } = useBluefishLayout({}, props, pathMeasurePolicy(props));

  return (
    <g transform={`translate(${bbox!.coord?.translate?.x ?? 0}, ${bbox!.coord?.translate?.y ?? 0})`}>
      <path {...rest} />
    </g>
  );
});
