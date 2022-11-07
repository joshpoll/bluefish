const DIV = 5, // bit shift from x, y index to bit vector array index
  MOD = 31, // bit mask for index lookup within a bit vector
  SIZE = 32, // individual bit vector size
  RIGHT0 = new Uint32Array(SIZE + 1), // left-anchored bit vectors, full -> 0
  RIGHT1 = new Uint32Array(SIZE + 1); // right-anchored bit vectors, 0 -> full

RIGHT1[0] = 0;
RIGHT0[0] = ~RIGHT1[0];
for (let i = 1; i <= SIZE; ++i) {
  RIGHT1[i] = (RIGHT1[i - 1] << 1) | 1;
  RIGHT0[i] = ~RIGHT1[i];
}

export type BitmapType = {
  array: Uint32Array;
  get: (x: number, y: number) => number;
  set: (x: number, y: number) => void;
  clear: (x: number, y: number) => void;
  getRange: (x: number, y: number, x2: number, y2: number) => boolean;
  setRange: (x: number, y: number, x2: number, y2: number) => void;
  clearRange: (x: number, y: number, x2: number, y2: number) => void;
  outOfBounds: (x: number, y: number, x2: number, y2: number) => boolean;
};

export default function Bitmap(w: number, h: number): BitmapType {
  const array = new Uint32Array(~~((w * h + SIZE) / SIZE));

  function _set(index: number, mask: number) {
    array[index] |= mask;
  }

  function _clear(index: number, mask: number) {
    array[index] &= mask;
  }

  return {
    array: array,

    get: (x: number, y: number) => {
      const index = y * w + x;
      return array[index >>> DIV] & (1 << (index & MOD));
    },

    set: (x: number, y: number) => {
      const index = y * w + x;
      _set(index >>> DIV, 1 << (index & MOD));
    },

    clear: (x: number, y: number) => {
      const index = y * w + x;
      _clear(index >>> DIV, ~(1 << (index & MOD)));
    },

    getRange: (x: number, y: number, x2: number, y2: number) => {
      let r = y2,
        start,
        end,
        indexStart,
        indexEnd;
      for (; r >= y; --r) {
        start = r * w + x;
        end = r * w + x2;
        indexStart = start >>> DIV;
        indexEnd = end >>> DIV;
        if (indexStart === indexEnd) {
          if (array[indexStart] & RIGHT0[start & MOD] & RIGHT1[(end & MOD) + 1]) {
            return true;
          }
        } else {
          if (array[indexStart] & RIGHT0[start & MOD]) return true;
          if (array[indexEnd] & RIGHT1[(end & MOD) + 1]) return true;
          for (let i = indexStart + 1; i < indexEnd; ++i) {
            if (array[i]) return true;
          }
        }
      }
      return false;
    },

    setRange: (x: number, y: number, x2: number, y2: number) => {
      let start, end, indexStart, indexEnd, i;
      for (; y <= y2; ++y) {
        start = y * w + x;
        end = y * w + x2;
        indexStart = start >>> DIV;
        indexEnd = end >>> DIV;
        if (indexStart === indexEnd) {
          _set(indexStart, RIGHT0[start & MOD] & RIGHT1[(end & MOD) + 1]);
        } else {
          _set(indexStart, RIGHT0[start & MOD]);
          _set(indexEnd, RIGHT1[(end & MOD) + 1]);
          for (i = indexStart + 1; i < indexEnd; ++i) _set(i, 0xffffffff);
        }
      }
    },

    clearRange: (x: number, y: number, x2: number, y2: number) => {
      let start, end, indexStart, indexEnd, i;
      for (; y <= y2; ++y) {
        start = y * w + x;
        end = y * w + x2;
        indexStart = start >>> DIV;
        indexEnd = end >>> DIV;
        if (indexStart === indexEnd) {
          _clear(indexStart, RIGHT1[start & MOD] | RIGHT0[(end & MOD) + 1]);
        } else {
          _clear(indexStart, RIGHT1[start & MOD]);
          _clear(indexEnd, RIGHT0[(end & MOD) + 1]);
          for (i = indexStart + 1; i < indexEnd; ++i) _clear(i, 0);
        }
      }
    },

    outOfBounds: (x: number, y: number, x2: number, y2: number) => x < 0 || y < 0 || y2 >= h || x2 >= w,
  };
}
