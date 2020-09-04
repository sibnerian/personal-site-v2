import { CroppedImage } from './models/CroppedImage';
import spritesheet from './spritesheet';
import { Ship } from './models/Ship';
import { Bullet } from './Bullet';

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 20;
const BULLET_SPRITE = new CroppedImage(spritesheet, 7, 450, 22, 35);

export class Player extends Ship {
  public willFire: boolean;
  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    topLeftX: number,
    topLeftY: number
  ) {
    super(
      ctx,
      canvas,
      BULLET_SPRITE,
      topLeftX,
      topLeftY,
      PLAYER_WIDTH,
      PLAYER_HEIGHT
    ); // TODO: CHANGE ME
    this.willFire = false;
  }
  getBullet() {
    const bullet = new Bullet(
      this.ctx,
      this.canvas,
      BULLET_SPRITE,
      this.topLeftX + this.width / 2,
      this.topLeftY + this.height,
      0,
      -10
    );
    bullet.shift(-bullet.getWidth() / 2, -bullet.getHeight());
    return bullet;
  }
  draw() {
    // TODO: Delete me when you do the spritesheet right
    this.ctx.fillStyle = 'rgb(200,0,0)';
    return this.ctx.fillRect(
      this.topLeftX,
      this.topLeftY,
      this.width,
      this.height
    );
  }
}
