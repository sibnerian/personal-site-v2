import { BoundingBox } from './BoundingBox';
import { CroppedImage } from './CroppedImage';

export class GameObject {
  protected velX: number = 0;
  protected velY: number = 0;

  constructor(
    protected readonly ctx: CanvasRenderingContext2D,
    protected readonly canvas: HTMLCanvasElement,
    protected image: CroppedImage | null,
    protected topLeftX: number,
    protected topLeftY: number,
    protected width: number,
    protected height: number
  ) {}

  setPosition(x: number, y: number) {
    this.topLeftX = x;
    this.topLeftY = y;
  }

  setVelocity(vx: number, vy: number) {
    this.velX = vx;
    this.velY = vy;
  }

  move() {
    const newX = Math.max(
      0,
      Math.min(this.canvas.width - this.width, this.topLeftX + this.velX)
    );
    const newY = Math.max(
      0,
      Math.min(this.canvas.height - this.height, this.topLeftY + this.velY)
    );
    this.setPosition(newX, newY);
  }

  shift(dx: number, dy: number) {
    this.topLeftX += dx;
    this.topLeftY += dy;
  }

  draw() {
    this.image?.draw(
      this.ctx,
      this.topLeftX,
      this.topLeftY,
      this.width,
      this.height
    );
  }

  clear() {
    this.ctx.clearRect(
      this.topLeftX - 2,
      this.topLeftY - 2,
      this.width + 4,
      this.height + 4
    );
  }

  boundingBox() {
    return new BoundingBox(
      this.topLeftX,
      this.topLeftY,
      this.width,
      this.height
    );
  }

  bbIntersects(other: GameObject) {
    if (other == null) {
      return false;
    }
    const bb = this.boundingBox();
    return (
      bb.contains(other.topLeftX, other.topLeftY) ||
      bb.contains(other.topLeftX, other.topLeftY + other.height) ||
      bb.contains(other.topLeftX + other.width, other.topLeftY) ||
      bb.contains(other.topLeftX + other.width, other.topLeftY + other.height)
    );
  }

  intersects(other: GameObject) {
    return this.bbIntersects(other) || other.bbIntersects(this);
  }

  isOnScreen() {
    return (
      this.topLeftX + this.width >= 0 &&
      this.topLeftX <= this.canvas.width &&
      this.topLeftY + this.height >= 0 &&
      this.topLeftY <= this.canvas.height
    );
  }

  explode() {}

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  getTopLeftX() {
    return this.topLeftX;
  }

  getTopLeftY() {
    return this.topLeftY;
  }
}
