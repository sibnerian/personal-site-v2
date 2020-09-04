import { GameObject } from './models/GameObject';
import { CroppedImage } from './models/CroppedImage';

const BULLET_WIDTH = 11;
const BULLET_HEIGHT = 17;

export class Bullet extends GameObject {
  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    sprite: CroppedImage,
    topLeftX: number,
    topLeftY: number,
    vx: number,
    vy: number
  ) {
    super(ctx, canvas, sprite, topLeftX, topLeftY, BULLET_WIDTH, BULLET_HEIGHT);
    this.setVelocity(vx, vy);
  }

  move() {
    this.setPosition(this.topLeftX + this.velX, this.topLeftY + this.velY);
  }
}
