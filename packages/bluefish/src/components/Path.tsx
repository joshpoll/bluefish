import { PaperScope } from 'paper/dist/paper-core';
import { withBluefish, withBluefishFn, BBox } from '../bluefish';
import { NewBBox } from '../NewBBox';

export type PathProps = React.SVGProps<SVGPathElement> & Partial<BBox>;

export const Path = withBluefishFn(
  ({ d }: PathProps) => {
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
  },
  (props: PathProps & { $bbox?: Partial<NewBBox> }) => {
    const { $bbox, ...rest } = props;
    return (
      <g transform={`translate(${$bbox!.coord?.translate?.x ?? 0}, ${$bbox!.coord?.translate?.y ?? 0})`}>
        <path {...rest} />
      </g>
    );
  },
);
