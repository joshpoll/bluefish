import { PropsWithBluefish, withBluefish } from '../bluefish';
import { VerticalAlignment } from './Align';

export type GridProps = PropsWithBluefish<{
  x?: number;
  y?: number;
  numRows?: number;
  numColumns?: number;
  totalWidth?: number;
  totalHeight?: number;
  verticalSpacing?: number;
  horizontalSpacing?: number;
  verticalAlignment: VerticalAlignment;
  horizontalAlignment: VerticalAlignment;
}>;

export const Grid = withBluefish((props: GridProps) => {
  /* TODO: this is complicated, because computing rows and columns requires access to children... */
  return null;
});
