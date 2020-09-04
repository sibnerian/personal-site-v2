import { CroppedImage } from './models/CroppedImage';
import spritesheet from './spritesheet';
import { Ship } from './models/Ship';

const UFO_SPRITE = new CroppedImage(spritesheet, 31, 338, 192, 84);

export class UFO extends Ship {
  public readonly pointValue: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    topLeftX: number,
    topLeftY: number
  ) {
    super(ctx, canvas, UFO_SPRITE, topLeftX, topLeftY, 55, 24);

    this.pointValue = 50 * Math.ceil(Math.random() * 3);
  }
  move() {
    return this.shift(this.velX, this.velY);
  }
  draw() {
    if (this.exploded) {
      this.ctx.textAlign = 'center';
      this.ctx.font = '14px "Press Start 2P"';
      this.ctx.fillStyle = 'rgb(255, 255, 255)';
      return this.ctx.fillText(
        `${this.pointValue}`,
        this.topLeftX + this.width / 2,
        this.topLeftY + this.height,
        200
      );
    } else {
      return super.draw();
    }
  }
}
