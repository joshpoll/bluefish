import { isNaN } from 'lodash';

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
    this._setLeft = callbacks.left;
    this._setTop = callbacks.top;
    this._setRight = callbacks.right;
    this._setBottom = callbacks.bottom;
    this._setWidth = callbacks.width;
    this._setHeight = callbacks.height;

    this.left = bbox.left;
    this.top = bbox.top;
    this.right = bbox.right;
    this.bottom = bbox.bottom;
    this.width = bbox.width;
    this.height = bbox.height;
  }

  get left() {
    return this._left;
  }

  set left(left: number | undefined) {
    if (isNaN(left)) {
      throw new Error('left must be a number');
    }
    this._left = left;
    if (this._setLeft) {
      this._setLeft(left);
    }
    if (this.right !== undefined && this.left !== undefined && this.width !== this.right - this.left) {
      this.width = this.right - this.left;
    } else if (this.width !== undefined && this.left !== undefined && this.right !== this.left + this.width) {
      this.right = this.left + this.width;
    }
  }

  get top() {
    return this._top;
  }

  set top(top: number | undefined) {
    if (isNaN(top)) {
      throw new Error('top must be a number');
    }
    this._top = top;
    if (this._setTop) {
      this._setTop(top);
    }
    if (this.bottom !== undefined && this.top !== undefined && this.height !== this.bottom - this.top) {
      this.height = this.bottom - this.top;
    } else if (this.height !== undefined && this.top !== undefined && this.bottom !== this.top + this.height) {
      this.bottom = this.top + this.height;
    }
  }

  get right() {
    return this._right;
  }

  set right(right: number | undefined) {
    if (isNaN(right)) {
      throw new Error('right must be a number');
    }
    this._right = right;
    if (this._setRight) {
      this._setRight(right);
    }
    if (this.left !== undefined && this.right !== undefined && this.width !== this.right - this.left) {
      this.width = this.right - this.left;
    } else if (this.width !== undefined && this.right !== undefined && this.left !== this.right - this.width) {
      this.left = this.right - this.width;
    }
  }

  get bottom() {
    return this._bottom;
  }

  set bottom(bottom: number | undefined) {
    if (isNaN(bottom)) {
      throw new Error('bottom must be a number');
    }
    this._bottom = bottom;
    if (this._setBottom) {
      this._setBottom(bottom);
    }
    if (this.top !== undefined && this.bottom !== undefined && this.height !== this.bottom - this.top) {
      this.height = this.bottom - this.top;
    } else if (this.height !== undefined && this.bottom !== undefined && this.top !== this.bottom - this.height) {
      this.top = this.bottom - this.height;
    }
  }

  get width() {
    return this._width;
  }

  set width(width: number | undefined) {
    if (isNaN(width)) {
      throw new Error('width must be a number');
    }
    this._width = width;
    if (this._setWidth) {
      this._setWidth(width);
    }
    if (this.left !== undefined && this.width !== undefined && this.right !== this.left + this.width) {
      this.right = this.left + this.width;
    } else if (this.right !== undefined && this.width !== undefined && this.left !== this.right - this.width) {
      this.left = this.right - this.width;
    }
  }

  get height() {
    return this._height;
  }

  set height(height: number | undefined) {
    if (isNaN(height)) {
      throw new Error('height must be a number');
    }
    this._height = height;
    if (this._setHeight) {
      this._setHeight(height);
    }
    if (this.top !== undefined && this.height !== undefined && this.bottom !== this.top + this.height) {
      this.bottom = this.top + this.height;
    } else if (this.bottom !== undefined && this.height !== undefined && this.top !== this.bottom - this.height) {
      this.top = this.bottom - this.height;
    }
  }
}

// a function that returns a NewBBoxClass instance
export function newBBox() {
  return new NewBBoxClass({}, {});
}
