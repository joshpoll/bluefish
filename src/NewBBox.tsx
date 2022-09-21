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

  get left() {
    return this._left;
  }

  set left(left: number | undefined) {
    this._left = left;
    if (this._right !== undefined && this._left !== undefined) {
      this._width = this._right - this._left;
    }
  }

  get top() {
    return this._top;
  }

  set top(top: number | undefined) {
    this._top = top;
    if (this._bottom !== undefined && this._top !== undefined) {
      this._height = this._bottom - this._top;
    }
  }

  get right() {
    return this._right;
  }

  set right(right: number | undefined) {
    this._right = right;
    if (this._left !== undefined && this._right !== undefined) {
      this._width = this._right - this._left;
    }
  }

  get bottom() {
    return this._bottom;
  }

  set bottom(bottom: number | undefined) {
    this._bottom = bottom;
    if (this._top !== undefined && this._bottom !== undefined) {
      this._height = this._bottom - this._top;
    }
  }

  get width() {
    return this._width;
  }

  set width(width: number | undefined) {
    this._width = width;
    if (this._left !== undefined && this._width !== undefined) {
      this._right = this._left + this._width;
    }
  }

  get height() {
    return this._height;
  }

  set height(height: number | undefined) {
    this._height = height;
    if (this._top !== undefined && this._height !== undefined) {
      this._bottom = this._top + this._height;
    }
  }
}

// a function that returns a NewBBoxClass instance
export function newBBox() {
  return new NewBBoxClass();
}
