export type PlaceableBBox = {
  x?: number;
  y?: number;
  width: number;
  height: number;
};

export class Placeable<BBoxType extends PlaceableBBox = PlaceableBBox> {
  public bbox!: BBoxType;
  private _place: Placeable<BBoxType>['place'];

  public place(point: { x: number }): this is Placeable<BBoxType & { x: number }>;
  public place(point: { y: number }): this is Placeable<BBoxType & { y: number }>;
  public place(point: { x: number; y: number }): this is Placeable<BBoxType & { x: number; y: number }> {
    return this._place(point);
  }

  // assumes the first BBoxType is always just width and height
  constructor(width: number, height: number, place: Placeable<BBoxType>['place']) {
    this.bbox = { width, height } as BBoxType;
    this._place = place;
  }

  public get x(): BBoxType['x'] {
    return this.bbox.x;
  }

  public get y(): BBoxType['y'] {
    return this.bbox.y;
  }

  public get width(): number {
    return this.bbox.width;
  }

  public get height(): number {
    return this.bbox.height;
  }
}
