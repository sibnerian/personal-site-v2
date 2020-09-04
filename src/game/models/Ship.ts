import { GameObject } from './GameObject';

export class Ship extends GameObject {
  public exploded: boolean = false;
  public ticksSinceExplode?: number;

  explode() {
    this.exploded = true;
    this.ticksSinceExplode = 0;
  }
}
