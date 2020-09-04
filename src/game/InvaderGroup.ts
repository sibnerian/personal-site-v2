import { GameObject } from './models/GameObject';
import { Invader, INVADER_WIDTH, INVADER_HEIGHT } from './Invader';
import type { InvaderType } from './Invader';
import { Bullet } from './Bullet';
import { invaderSounds } from './sounds';

const OFFSET = 8;

export class InvaderGroup extends GameObject {
  private size: number;
  private rowSize: number;
  private data: Invader[];
  private originalTopLeftX: number;
  private originalTopLeftY: number;
  private soundIndex: number;
  private reachedBottom: boolean = false;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    cols: number,
    rows: number,
    topLeftX: number,
    topLeftY: number,
    private readonly bulletFreq: number
  ) {
    super(
      ctx,
      canvas,
      null,
      topLeftX,
      topLeftY,
      (cols - 1) * (INVADER_WIDTH + OFFSET) + INVADER_WIDTH,
      (rows - 1) * (INVADER_HEIGHT + OFFSET) + INVADER_HEIGHT
    );
    this.size = cols * rows;
    this.rowSize = cols;
    this.data = [];
    for (let i = 0; i < this.size; i++) {
      const x = topLeftX + (i % this.rowSize) * (INVADER_WIDTH + OFFSET);
      const y =
        topLeftY + Math.floor(i / this.rowSize) * (INVADER_HEIGHT + OFFSET);

      let invaderType: InvaderType;
      if (i < 2 * this.rowSize) {
        invaderType = 'squid';
      } else if (i < 4 * this.rowSize) {
        invaderType = 'crab';
      } else {
        invaderType = 'jelly';
      }

      this.data[i] = new Invader(ctx, canvas, x, y, invaderType);
      this.data[i].shift((INVADER_WIDTH - this.data[i].getWidth()) / 2, 0);
    }

    this.originalTopLeftX = topLeftX;
    this.originalTopLeftY = topLeftY;
    this.soundIndex = 0;
  }

  updateWidthHeight() {
    let maxX, maxY;
    if (this.data.length === 0) {
      return;
    }
    this.topLeftX = this.topLeftY = Infinity;
    maxX = maxY = -Infinity;
    for (let inv of this.data) {
      if (inv == null) {
        continue;
      }
      if (inv.getTopLeftX() < this.topLeftX) {
        this.topLeftX = Math.floor(inv.getTopLeftX());
      }
      if (inv.getTopLeftY() < this.topLeftY) {
        this.topLeftY = Math.floor(inv.getTopLeftY());
      }
      if (inv.getTopLeftX() + inv.getWidth() > maxX) {
        maxX = Math.ceil(inv.getTopLeftX()) + inv.getWidth();
      }
      if (inv.getTopLeftY() + inv.getHeight() > maxY) {
        maxY = Math.ceil(inv.getTopLeftY() + inv.getHeight());
      }
    }
    this.width = maxX - this.topLeftX;
    this.height = maxY - this.topLeftY;
  }

  draw() {
    this.data.forEach((invader) => invader?.draw());
  }

  shift(dx: number, dy: number) {
    super.shift(dx, dy);
    this.originalTopLeftX += dx;
    this.originalTopLeftY += dy;
    this.data.forEach((invader) => invader?.shift(dx, dy));
  }

  move() {
    const maxX = this.topLeftX + this.width;
    const maxY = this.topLeftY + this.height;
    if (maxX + this.velX > this.canvas.width || this.topLeftX + this.velX < 0) {
      this.shift(0, INVADER_HEIGHT);
      this.setVelocity(-this.velX, this.velY);
    } else if (maxY + this.velY > this.canvas.height) {
      this.reachedBottom = true;
    } else {
      super.move();
      this.originalTopLeftX += this.velX;
      this.originalTopLeftY += this.velY;
      for (let invader of this.data) {
        invader?.move();
      }
    }
    invaderSounds[this.soundIndex].play();
    console.log(this.soundIndex, 'play');
    this.soundIndex = (this.soundIndex + 1) % invaderSounds.length;
  }

  setVelocity(vx: number, vy: number) {
    for (let invader of this.data) {
      invader?.setVelocity(vx, vy);
    }
    return super.setVelocity(vx, vy);
  }

  invaderAtCoords(x: number, y: number) {
    const xIndex = Math.floor(
      (x - this.originalTopLeftX) / (INVADER_WIDTH + OFFSET)
    );
    if (xIndex >= this.rowSize) {
      return undefined;
    }
    const yIndex = Math.floor(
      (y - this.originalTopLeftY) / (INVADER_HEIGHT + OFFSET)
    );
    return this.data[xIndex + yIndex * this.rowSize];
  }

  intersects(other: GameObject): boolean {
    if (!(other != null && super.intersects(other))) {
      return false;
    }
    return !!(
      this.invaderAtCoords(
        other.getTopLeftX(),
        other.getTopLeftY()
      )?.intersects(other) ||
      this.invaderAtCoords(
        other.getTopLeftX(),
        other.getTopLeftY() + other.getHeight()
      )?.intersects(other) ||
      this.invaderAtCoords(
        other.getTopLeftX() + other.getWidth(),
        other.getTopLeftY()
      )?.intersects(other) ||
      this.invaderAtCoords(
        other.getTopLeftX() + other.getWidth(),
        other.getTopLeftY() + other.getHeight()
      )?.intersects(other)
    );
  }

  updateExploded(num: number) {
    this.data.forEach((invader, idx) => {
      if (invader == null) {
        return;
      }
      if (invader.exploded && invader.ticksSinceExplode != null) {
        if (invader.ticksSinceExplode! > num) {
          invader.clear();
          delete this.data[idx];
          this.size--;
          this.updateWidthHeight();
        } else if (invader.ticksSinceExplode != null) {
          invader.ticksSinceExplode++;
        }
      }
    });
  }

  getBullets(): Bullet[] {
    const freq = this.bulletFreq || 0.1;
    return this.data
      .map((invader) => invader.getBullet())
      .filter(() => Math.random() < freq);
  }

  getSize() {
    return this.size;
  }

  hasReachedBottom() {
    return this.reachedBottom;
  }
}
