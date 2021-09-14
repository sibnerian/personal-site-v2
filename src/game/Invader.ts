import spritesheet from './spritesheet';
import { CroppedImage } from './models/CroppedImage';
import { Ship } from './models/Ship';
import { Bullet } from './Bullet';

// Invaders fit in an area 42x28
export const INVADER_WIDTH = 42;
export const INVADER_HEIGHT = 28;

const squidPixelWidth = 65;
const SPRITE_SQUID_1 = new CroppedImage(
  spritesheet,
  40,
  30,
  squidPixelWidth,
  65
);
const SPRITE_SQUID_2 = new CroppedImage(
  spritesheet,
  142,
  30,
  squidPixelWidth,
  65
);

const crabPixelWidth = 88;
const SPRITE_CRAB_1 = new CroppedImage(
  spritesheet,
  27,
  134,
  crabPixelWidth,
  65
);
const SPRITE_CRAB_2 = new CroppedImage(
  spritesheet,
  131,
  134,
  crabPixelWidth,
  65
);

const jellyPixelWidth = 98;
const SPRITE_JELLY_1 = new CroppedImage(
  spritesheet,
  15,
  241,
  jellyPixelWidth,
  65
);
const SPRITE_JELLY_2 = new CroppedImage(
  spritesheet,
  129,
  241,
  jellyPixelWidth,
  65
);

const EXPLODE_SPRITE = new CroppedImage(spritesheet, 243, 0, 106, 68);
const BULLET_SPRITE = new CroppedImage(spritesheet, 7, 460, 22, 35);

export type InvaderType = 'squid' | 'crab' | 'jelly';

function getImage1(type: InvaderType): CroppedImage {
  const map = {
    'squid': SPRITE_SQUID_1,
    'crab': SPRITE_CRAB_1,
    'jelly': SPRITE_JELLY_1,
  };
  return map[type];
}

function getImage2(type: InvaderType): CroppedImage {
  const map = {
    'squid': SPRITE_SQUID_2,
    'crab': SPRITE_CRAB_2,
    'jelly': SPRITE_JELLY_2,
  };
  return map[type];
}

function getPointValue(type: InvaderType): number {
  const map = {
    'squid': 40,
    'crab': 20,
    'jelly': 10,
  };
  return map[type];
}

function getWidth(type: InvaderType): number {
  const map = {
    'squid': (squidPixelWidth / jellyPixelWidth) * INVADER_WIDTH,
    'crab': (crabPixelWidth / jellyPixelWidth) * INVADER_WIDTH,
    'jelly': INVADER_WIDTH,
  };
  return map[type];
}

export class Invader extends Ship {
  private readonly image1: CroppedImage;
  private readonly image2: CroppedImage;
  public readonly pointValue: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    topLeftX: number,
    topLeftY: number,
    type: InvaderType
  ) {
    super(
      ctx,
      canvas,
      getImage1(type),
      topLeftX,
      topLeftY,
      getWidth(type),
      INVADER_HEIGHT
    );
    this.image1 = getImage1(type);
    this.image2 = getImage2(type);
    this.pointValue = getPointValue(type);
  }

  getBullet() {
    return new Bullet(
      this.ctx,
      this.canvas,
      BULLET_SPRITE,
      this.topLeftX + this.width / 2,
      this.topLeftY + this.height,
      0,
      5
    );
  }

  explode() {
    super.explode();
    this.image = EXPLODE_SPRITE;
    this.shift((this.width - INVADER_WIDTH) / 2, 0);
    this.width = INVADER_WIDTH;
    window.gtag('event', 'explode_invader', {
      'event_category': 'game',
    });
  }

  swapSprite() {
    this.image = this.image === this.image1 ? this.image2 : this.image1;
  }

  move() {
    super.move();
    if (!this.exploded) {
      this.swapSprite();
    }
  }
}
