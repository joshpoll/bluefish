import { isNaN } from 'lodash';

export type CoordinateTransform = {
  translate?: { x?: number; y?: number };
  scale?: { x?: number; y?: number };
};

export type NewBBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  coord: CoordinateTransform;
  hidden: boolean;
};

// an abstract datatype for the NewBBox type that keeps the fields synchronized
export class NewBBoxClass {
  private _left?: number;
  private _top?: number;
  private _right?: number;
  private _bottom?: number;
  private _width?: number;
  private _height?: number;
  private _hidden?: boolean;
  private _coord?: CoordinateTransform;
  private _setLeft?(left: number | undefined): void;
  private _setTop?(top: number | undefined): void;
  private _setRight?(right: number | undefined): void;
  private _setBottom?(bottom: number | undefined): void;
  private _setWidth?(width: number | undefined): void;
  private _setHeight?(height: number | undefined): void;
  private _setHidden?(hidden: boolean | undefined): void;
  private _setCoord?(coord: CoordinateTransform | undefined): void;

  constructor(
    bbox: Partial<NewBBox>,
    callbacks: { [K in keyof NewBBox]?: (value: NewBBox[K] | undefined) => void } = {},
  ) {
    this._setLeft = callbacks.left;
    this._setTop = callbacks.top;
    this._setRight = callbacks.right;
    this._setBottom = callbacks.bottom;
    this._setWidth = callbacks.width;
    this._setHeight = callbacks.height;
    this._setHidden = callbacks.hidden;
    this._setCoord = callbacks.coord;

    this.intrinsicLeft = bbox.left;
    this.intrinsicTop = bbox.top;
    this.intrinsicRight = bbox.right;
    this.intrinsicBottom = bbox.bottom;
    this.intrinsicWidth = bbox.width;
    this.intrinsicHeight = bbox.height;
    this.coord = bbox.coord;
    this.hidden = bbox.hidden;
  }

  get coord() {
    return this._coord;
  }

  set coord(coord: CoordinateTransform | undefined) {
    this._coord = coord;
    if (this._setCoord) {
      this._setCoord(coord);
    }
  }

  get hidden() {
    return this._hidden;
  }

  set hidden(hidden: boolean | undefined) {
    this._hidden = hidden;
    if (this._setHidden) {
      this._setHidden(hidden);
    }
  }

  get left() {
    if (this.intrinsicLeft === undefined || this.coord?.translate?.x === undefined) {
      return undefined;
    }

    return this.intrinsicLeft + (this.coord?.translate?.x ?? 0);
  }

  set left(left: number | undefined) {
    if (isNaN(left)) {
      throw new Error('left is NaN');
    }

    // mutate intrinsicLeft if it hasn't been set yet
    // otherwise, mutate coord

    if (left === undefined) {
      this.intrinsicLeft = undefined;
    } else if (this.intrinsicLeft === undefined) {
      this.intrinsicLeft = left;

      // initialize coord if it's undefined
      // TODO: I'm not sure if this.coord updates require spread syntax
      if (this.coord === undefined) {
        this.coord = { translate: { x: 0 } };
      } else if (this.coord.translate === undefined) {
        this.coord = { ...this.coord, translate: { x: 0 } };
      } else if (this.coord.translate.x === undefined) {
        this.coord = { ...this.coord, translate: { ...this.coord.translate, x: 0 } };
      }
    } else {
      // translate the bbox extrinsically
      this.coord = { ...this.coord, translate: { ...this.coord!.translate, x: left - this.intrinsicLeft } };
    }
  }

  get right() {
    if (this.intrinsicRight === undefined || this.coord?.translate?.x === undefined) {
      return undefined;
    }

    return this.intrinsicRight + (this.coord?.translate?.x ?? 0);
  }

  set right(right: number | undefined) {
    // console.log('padding setting right', right);
    if (isNaN(right)) {
      throw new Error('right is NaN');
    }

    if (right === undefined) {
      this.intrinsicRight = undefined;
    } else if (this.intrinsicRight === undefined) {
      // console.log('padding hit intrinsicRight === undefined');
      this.intrinsicRight = right;

      // initialize coord if it's undefined
      if (this.coord === undefined) {
        this.coord = { translate: { x: 0 } };
      } else if (this.coord.translate === undefined) {
        this.coord = { ...this.coord, translate: { x: 0 } };
      } else if (this.coord.translate.x === undefined) {
        this.coord = { ...this.coord, translate: { ...this.coord.translate, x: 0 } };
      }
    } else {
      // translate the bbox extrinsically
      this.coord = { ...this.coord, translate: { ...this.coord!.translate, x: right - this.intrinsicRight } };
    }
  }

  get top() {
    if (this.intrinsicTop === undefined || this.coord?.translate?.y === undefined) {
      return undefined;
    }

    return this.intrinsicTop + (this.coord?.translate?.y ?? 0);
  }

  set top(top: number | undefined) {
    if (isNaN(top)) {
      throw new Error('top is NaN');
    }

    if (top === undefined) {
      this.intrinsicTop = undefined;
    } else if (this.intrinsicTop === undefined) {
      this.intrinsicTop = top;

      // initialize coord if it's undefined
      if (this.coord === undefined) {
        this.coord = { translate: { y: 0 } };
      } else if (this.coord.translate === undefined) {
        this.coord = { ...this.coord, translate: { y: 0 } };
      } else if (this.coord.translate.y === undefined) {
        this.coord = { ...this.coord, translate: { ...this.coord.translate, y: 0 } };
      }
    } else {
      // translate the bbox extrinsically
      this.coord = { ...this.coord, translate: { ...this.coord!.translate, y: top - this.intrinsicTop } };
    }
  }

  get bottom() {
    if (this.intrinsicBottom === undefined || this.coord?.translate?.y === undefined) {
      return undefined;
    }

    return this.intrinsicBottom + (this.coord?.translate?.y ?? 0);
  }

  set bottom(bottom: number | undefined) {
    if (isNaN(bottom)) {
      throw new Error('bottom is NaN');
    }

    if (bottom === undefined) {
      this.intrinsicBottom = undefined;
    } else if (this.intrinsicBottom === undefined) {
      this.intrinsicBottom = bottom;

      // initialize coord if it's undefined
      if (this.coord === undefined) {
        this.coord = { translate: { y: 0 } };
      } else if (this.coord.translate === undefined) {
        this.coord = { ...this.coord, translate: { y: 0 } };
      } else if (this.coord.translate.y === undefined) {
        this.coord = { ...this.coord, translate: { ...this.coord.translate, y: 0 } };
      }
    } else {
      // translate the bbox extrinsically
      this.coord = { ...this.coord, translate: { ...this.coord!.translate, y: bottom - this.intrinsicBottom } };
    }
  }

  get width() {
    if (this.intrinsicWidth === undefined) {
      return undefined;
    }

    return this.intrinsicWidth * (this.coord?.scale?.x ?? 1);
  }

  set width(width: number | undefined) {
    if (isNaN(width)) {
      throw new Error('width is NaN');
    }

    if (width === undefined) {
      this.intrinsicWidth = undefined;
    } else if (this.intrinsicWidth === undefined) {
      this.intrinsicWidth = width;

      // initialize coord if it's undefined
      if (this.coord === undefined) {
        this.coord = { scale: { x: 1 } };
      } else if (this.coord.scale === undefined) {
        this.coord = { ...this.coord, scale: { x: 1 } };
      } else if (this.coord.scale.x === undefined) {
        this.coord = { ...this.coord, scale: { ...this.coord.scale, x: 1 } };
      }
    } else {
      // scale the bbox extrinsically
      this.coord = { ...this.coord, scale: { ...this.coord!.scale, x: width / this.intrinsicWidth } };
    }
  }

  get height() {
    if (this.intrinsicHeight === undefined) {
      return undefined;
    }

    return this.intrinsicHeight * (this.coord?.scale?.y ?? 1);
  }

  set height(height: number | undefined) {
    if (isNaN(height)) {
      throw new Error('height is NaN');
    }

    if (height === undefined) {
      this.intrinsicHeight = undefined;
    } else if (this.intrinsicHeight === undefined) {
      this.intrinsicHeight = height;

      // initialize coord if it's undefined
      if (this.coord === undefined) {
        this.coord = { scale: { y: 1 } };
      } else if (this.coord.scale === undefined) {
        this.coord = { ...this.coord, scale: { y: 1 } };
      } else if (this.coord.scale.y === undefined) {
        this.coord = { ...this.coord, scale: { ...this.coord.scale, y: 1 } };
      }
    } else {
      // scale the bbox extrinsically
      this.coord = { ...this.coord, scale: { ...this.coord!.scale, y: height / this.intrinsicHeight } };
    }
  }

  get intrinsicLeft() {
    return this._left;
  }

  set intrinsicLeft(left: number | undefined) {
    if (isNaN(left)) {
      throw new Error('left must be a number');
    }
    this._left = left;
    if (this._setLeft) {
      this._setLeft(left);
    }
    if (
      this.intrinsicRight !== undefined &&
      this.intrinsicLeft !== undefined &&
      this.intrinsicWidth !== this.intrinsicRight - this.intrinsicLeft
    ) {
      this.intrinsicWidth = this.intrinsicRight - this.intrinsicLeft;
    } else if (
      this.intrinsicWidth !== undefined &&
      this.intrinsicLeft !== undefined &&
      this.intrinsicRight !== this.intrinsicLeft + this.intrinsicWidth
    ) {
      this.intrinsicRight = this.intrinsicLeft + this.intrinsicWidth;
    }
  }

  get intrinsicTop() {
    return this._top;
  }

  set intrinsicTop(top: number | undefined) {
    if (isNaN(top)) {
      throw new Error('top must be a number');
    }
    this._top = top;
    if (this._setTop) {
      this._setTop(top);
    }
    if (
      this.intrinsicBottom !== undefined &&
      this.intrinsicTop !== undefined &&
      this.intrinsicHeight !== this.intrinsicBottom - this.intrinsicTop
    ) {
      this.intrinsicHeight = this.intrinsicBottom - this.intrinsicTop;
    } else if (
      this.intrinsicHeight !== undefined &&
      this.intrinsicTop !== undefined &&
      this.intrinsicBottom !== this.intrinsicTop + this.intrinsicHeight
    ) {
      this.intrinsicBottom = this.intrinsicTop + this.intrinsicHeight;
    }
  }

  get intrinsicRight() {
    return this._right;
  }

  set intrinsicRight(right: number | undefined) {
    // console.log('padding intrinsicRight', right, this.coord);
    if (isNaN(right)) {
      throw new Error('right must be a number');
    }
    this._right = right;
    if (this._setRight) {
      this._setRight(right);
    }
    if (
      this.intrinsicLeft !== undefined &&
      this.intrinsicRight !== undefined &&
      this.intrinsicWidth !== this.intrinsicRight - this.intrinsicLeft
    ) {
      this.intrinsicWidth = this.intrinsicRight - this.intrinsicLeft;
    } else if (
      this.intrinsicWidth !== undefined &&
      this.intrinsicRight !== undefined &&
      this.intrinsicLeft !== this.intrinsicRight - this.intrinsicWidth
    ) {
      this.intrinsicLeft = this.intrinsicRight - this.intrinsicWidth;
    }
  }

  get intrinsicBottom() {
    return this._bottom;
  }

  set intrinsicBottom(bottom: number | undefined) {
    if (isNaN(bottom)) {
      throw new Error('bottom must be a number');
    }
    this._bottom = bottom;
    if (this._setBottom) {
      this._setBottom(bottom);
    }
    if (
      this.intrinsicTop !== undefined &&
      this.intrinsicBottom !== undefined &&
      this.intrinsicHeight !== this.intrinsicBottom - this.intrinsicTop
    ) {
      this.intrinsicHeight = this.intrinsicBottom - this.intrinsicTop;
    } else if (
      this.intrinsicHeight !== undefined &&
      this.intrinsicBottom !== undefined &&
      this.intrinsicTop !== this.intrinsicBottom - this.intrinsicHeight
    ) {
      this.intrinsicTop = this.intrinsicBottom - this.intrinsicHeight;
    }
  }

  get intrinsicWidth() {
    return this._width;
  }

  set intrinsicWidth(width: number | undefined) {
    if (isNaN(width)) {
      throw new Error('width must be a number');
    }
    this._width = width;
    if (this._setWidth) {
      this._setWidth(width);
    }
    if (
      this.intrinsicLeft !== undefined &&
      this.intrinsicWidth !== undefined &&
      this.intrinsicRight !== this.intrinsicLeft + this.intrinsicWidth
    ) {
      this.intrinsicRight = this.intrinsicLeft + this.intrinsicWidth;
    } else if (
      this.intrinsicRight !== undefined &&
      this.intrinsicWidth !== undefined &&
      this.intrinsicLeft !== this.intrinsicRight - this.intrinsicWidth
    ) {
      this.intrinsicLeft = this.intrinsicRight - this.intrinsicWidth;
    }
  }

  get intrinsicHeight() {
    return this._height;
  }

  set intrinsicHeight(height: number | undefined) {
    if (isNaN(height)) {
      throw new Error('height must be a number');
    }
    this._height = height;
    if (this._setHeight) {
      this._setHeight(height);
    }
    if (
      this.intrinsicTop !== undefined &&
      this.intrinsicHeight !== undefined &&
      this.intrinsicBottom !== this.intrinsicTop + this.intrinsicHeight
    ) {
      this.intrinsicBottom = this.intrinsicTop + this.intrinsicHeight;
    } else if (
      this.intrinsicBottom !== undefined &&
      this.intrinsicHeight !== undefined &&
      this.intrinsicTop !== this.intrinsicBottom - this.intrinsicHeight
    ) {
      this.intrinsicTop = this.intrinsicBottom - this.intrinsicHeight;
    }
  }
}

// a function that returns a NewBBoxClass instance
export function newBBox() {
  return new NewBBoxClass({}, {});
}
