import { Bullet } from './Bullet';

export class BulletGroup {
  private readonly data: Set<Bullet> = new Set();

  constructor() {}

  add(bullet: Bullet) {
    if (bullet != null) {
      this.data.add(bullet);
    }
  }

  addAll(bullets: Bullet[]) {
    bullets.forEach((bullet) => this.add(bullet));
  }

  draw() {
    this.data.forEach((bullet) => bullet.draw());
  }

  clear() {
    this.data.forEach((bullet) => bullet.clear());
  }

  shift(dx: number, dy: number) {
    this.data.forEach((bullet) => bullet.shift(dx, dy));
  }

  move() {
    this.data.forEach((bullet) => bullet.move());
    const offscreen = Array.from(this.data.values()).filter(
      (bullet) => !bullet.isOnScreen()
    );
    offscreen.forEach((offscreenBullet) => this.data.delete(offscreenBullet));
  }

  size() {
    return this.data.size;
  }

  remove(bullet: Bullet) {
    bullet.clear();
    return this.data.delete(bullet);
  }

  removeAll() {
    this.asArray().forEach((bullet) => this.remove(bullet));
  }

  asArray() {
    return Array.from(this.data.values());
  }
}
