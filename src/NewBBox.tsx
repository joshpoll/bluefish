export type NewBBox = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

// an abstract datatype for the NewBBox type that keeps the fields synchronized
export class NewBBoxClass {
  private _left?: number;
  private _top?: number;
  private _right?: number;
  private _bottom?: number;
  private _width?: number;
  private _height?: number;
  private _setLeft?(left: number | undefined): void;
  private _setTop?(top: number | undefined): void;
  private _setRight?(right: number | undefined): void;
  private _setBottom?(bottom: number | undefined): void;
  private _setWidth?(width: number | undefined): void;
  private _setHeight?(height: number | undefined): void;

  constructor(bbox: Partial<NewBBox>, callbacks: { [K in keyof NewBBox]?: (value: number | undefined) => void } = {}) {
    this._left = bbox.left;
    this._top = bbox.top;
    this._right = bbox.right;
    this._bottom = bbox.bottom;
    this._width = bbox.width;
    this._height = bbox.height;
    this._setLeft = callbacks.left;
    this._setTop = callbacks.top;
    this._setRight = callbacks.right;
    this._setBottom = callbacks.bottom;
    this._setWidth = callbacks.width;
    this._setHeight = callbacks.height;
  }

  get left() {
    return this._left;
  }

  set left(left: number | undefined) {
    this._left = left;
    if (this._setLeft) {
      this._setLeft(left);
    }
    if (this.right !== undefined && this.left !== undefined && this.width !== this.right - this.left) {
      this.width = this.right - this.left;
    }
  }

  get top() {
    return this._top;
  }

  set top(top: number | undefined) {
    this._top = top;
    if (this._setTop) {
      this._setTop(top);
    }
    if (this.bottom !== undefined && this.top !== undefined && this.height !== this.bottom - this.top) {
      this.height = this.bottom - this.top;
    }
  }

  get right() {
    return this._right;
  }

  set right(right: number | undefined) {
    this._right = right;
    if (this._setRight) {
      this._setRight(right);
    }
    if (this.left !== undefined && this.right !== undefined && this.width !== this.right - this.left) {
      this.width = this.right - this.left;
    }
  }

  get bottom() {
    return this._bottom;
  }

  set bottom(bottom: number | undefined) {
    this._bottom = bottom;
    if (this._setBottom) {
      this._setBottom(bottom);
    }
    if (this.top !== undefined && this.bottom !== undefined && this.height !== this.bottom - this.top) {
      this.height = this.bottom - this.top;
    }
  }

  get width() {
    return this._width;
  }

  set width(width: number | undefined) {
    this._width = width;
    if (this._setWidth) {
      this._setWidth(width);
    }
    if (this.left !== undefined && this.width !== undefined && this.right !== this.left + this.width) {
      this.right = this.left + this.width;
    }
  }

  get height() {
    return this._height;
  }

  set height(height: number | undefined) {
    this._height = height;
    if (this._setHeight) {
      this._setHeight(height);
    }
    if (this.top !== undefined && this.height !== undefined && this.bottom !== this.top + this.height) {
      this.bottom = this.top + this.height;
    }
  }
}

// a function that returns a NewBBoxClass instance
export function newBBox() {
  return new NewBBoxClass({}, {});
}
