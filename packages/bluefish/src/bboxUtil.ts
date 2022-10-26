import { BBox } from './componentTypes';

export const union = (bbox1: BBox, bbox2: BBox): BBox => {
  const x = Math.min(bbox1.x, bbox2.x);
  const y = Math.min(bbox1.y, bbox2.y);
  const width = Math.max(bbox1.x + bbox1.width, bbox2.x + bbox2.width) - x;
  const height = Math.max(bbox1.y + bbox1.height, bbox2.y + bbox2.height) - y;
  return { x, y, width, height };
};

export const inflate = (bbox: BBox, padding: number): BBox => {
  return {
    x: bbox.x - padding,
    y: bbox.y - padding,
    width: bbox.width + padding * 2,
    height: bbox.height + padding * 2,
  };
};
