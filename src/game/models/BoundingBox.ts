export class BoundingBox {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  contains(x: number, y: number) {
    return (
      this.x + this.width >= x &&
      x >= this.x &&
      this.y + this.height >= y &&
      y >= this.y
    );
  }
}
