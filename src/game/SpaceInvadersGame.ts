import rafLoop from 'raf-loop';
import type { Engine } from 'raf-loop';
import { Player } from './Player';
import { InvaderGroup } from './InvaderGroup';
import { BulletGroup } from './BulletGroup';
import { UFO } from './UFO';

export class SpaceInvadersGame {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly bulletFreq: number;
  private readonly ufoFreq: number;
  private ticks: number = 0;
  private lives: number = 2;
  private score: number = 0;
  private player?: Player;
  private readonly keysDown: Set<number> = new Set();
  private keyDownFn: (e: KeyboardEvent) => void;
  private keyUpFn: (e: KeyboardEvent) => void;
  private started: boolean = false;
  private paused: boolean = false;
  private readonly loop: Engine;
  private levelsCleared: number = 0;
  private invaders?: InvaderGroup;
  private bullets?: BulletGroup;
  private playerBullets?: BulletGroup;
  private UFO?: UFO;

  constructor(private readonly canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = this.canvas.getContext('2d');
    if (ctx == null) {
      throw new Error('Context null');
    }
    this.ctx = ctx;
    this.bulletFreq = 0.02;
    this.ufoFreq = 0.001;
    this.keyDownFn = (e: KeyboardEvent) => this.onKeyDown(e);
    this.keyUpFn = (e: KeyboardEvent) => this.onKeyUp(e);
    document.addEventListener('keydown', this.keyDownFn);
    document.addEventListener('keyup', this.keyUpFn);
    this.loop = rafLoop(() => {
      this.tick();
      this.ticks++;
    });
  }

  start() {
    return this.reset();
  }

  clearCanvas() {
    this.ctx.fillStyle = '#000000';
    return this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  reset() {
    window.gtag('event', 'new_game', {
      'event_category': 'game',
    });
    this.clearCanvas();
    this.ticks = 0;
    this.lives = 2;
    this.score = 0;
    this.nextLevel();
    this.player = new Player(
      this.ctx,
      this.canvas,
      this.canvas.width / 2,
      this.canvas.height - 50
    );
    this.keysDown.clear();
    this.started = true;
    this.paused = false;
    this.loop.start();
  }

  onKeyDown(e: KeyboardEvent) {
    this.keysDown.add(e.which);
    if (e.which === 77) {
      // $('.soundIcon').trigger('click');
      // TODO figure out how to mute the damn game
    }
    if ((e.which === 13 || e.which === 32) && !this.started) {
      this.reset();
      return;
    }
    if (!this.player || !this.started) {
      return;
    }
    switch (e.which) {
      case 32: // spacebar
        e.preventDefault();
        this.player.willFire = true;
        break;
      case 37: // left arrow
        this.player.setVelocity(-10, 0);
        break;
      case 39: // right arrow
        this.player.setVelocity(10, 0);
        break;
      case 80: // 'p' for pause
        if (this.paused) {
          this.resume();
        } else {
          this.pause();
        }
        break;
    }
  }

  onKeyUp(e: KeyboardEvent) {
    this.keysDown.delete(e.which);
  }

  nextLevel() {
    if (this.levelsCleared != null) {
      this.levelsCleared++;
    } else {
      this.levelsCleared = 0;
    }
    const invaderCoord = Math.min(150, 25 + this.levelsCleared * 25);
    this.invaders = new InvaderGroup(
      this.ctx,
      this.canvas,
      11,
      6,
      invaderCoord,
      invaderCoord,
      this.bulletFreq
    );
    this.invaders.setVelocity(20 + 4 * this.levelsCleared, 0);
    if (this.bullets != null) {
      this.bullets.clear();
    }
    if (this.playerBullets != null) {
      this.playerBullets.clear();
    }
    this.bullets = new BulletGroup();
    this.playerBullets = new BulletGroup();
  }

  tick() {
    let bullet;
    if (
      this.paused ||
      !this.invaders ||
      !this.bullets ||
      !this.player ||
      !this.playerBullets
    ) {
      return;
    }
    this.clearCanvas();
    this.drawHud();
    if (this.ticks % 30 === 0) {
      this.invaders.move();
      this.bullets.addAll(this.invaders.getBullets());
    }
    this.bullets.move();
    this.player.move();
    this.playerBullets.move();
    this.bullets.draw();
    this.invaders.draw();
    this.player.draw();
    this.playerBullets.draw();
    //UFO logic
    if (this.UFO != null) {
      this.UFO.clear();
      if (!this.UFO.exploded) {
        this.UFO.move();
      }
      this.UFO.draw();
      if (this.UFO.exploded && this.UFO.ticksSinceExplode != null) {
        this.UFO.ticksSinceExplode++;
      }
      if (!this.UFO.isOnScreen()) {
        this.UFO.clear();
        this.UFO = undefined;
      }
    } else {
      if (this.invaders.getTopLeftY() > 50 && Math.random() < this.ufoFreq) {
        this.UFO = new UFO(this.ctx, this.canvas, 0, 25);
        this.UFO.setVelocity(3, 0);
      }
    }

    //get rid of exploded invaders/UFOs
    this.invaders.updateExploded(10);
    if (
      this.UFO != null &&
      this.UFO.exploded &&
      this.UFO.ticksSinceExplode != null &&
      this.UFO.ticksSinceExplode > 50
    ) {
      this.UFO.clear();
      this.UFO = undefined;
    }

    // invader/UFO destruction logic
    for (bullet of this.playerBullets.asArray()) {
      if (this.invaders.intersects(bullet)) {
        const invader = this.invaders.invaderAtCoords(
          bullet.getTopLeftX() + bullet.getWidth() / 2,
          bullet.getTopLeftY()
        );
        if (invader != null && !invader.exploded) {
          this.playerBullets.remove(bullet);
          invader.explode();
          this.score += invader.pointValue;
        }
      }
      if (
        this.UFO != null &&
        this.UFO.intersects(bullet) &&
        !this.UFO.exploded
      ) {
        this.playerBullets.remove(bullet);
        this.UFO.explode();
        this.score += this.UFO.pointValue;
      }
    }
    // player destruction logic
    for (bullet of this.bullets.asArray()) {
      if (this.player.intersects(bullet)) {
        this.bullets.removeAll();
        this.lives--;
        this.player.explode();
      }
    }
    // player movement logic
    switch (false) {
      case !this.keysDown.has(37) || !!this.keysDown.has(39):
        this.player.setVelocity(-10, 0);
        break;
      case !this.keysDown.has(39) || !!this.keysDown.has(37):
        this.player.setVelocity(10, 0);
        break;
      default:
        this.player.setVelocity(0, 0);
    }
    // player shooting logic
    if (this.ticks % 10 === 0) {
      if (this.player.willFire && this.playerBullets.size() === 0) {
        this.playerBullets.add(this.player.getBullet());
      }
      if (!this.keysDown.has(32)) {
        this.player.willFire = false;
      }
    }
    if (this.invaders.getSize() === 0) {
      this.nextLevel();
    }
    if (this.lives < 0 || this.invaders.hasReachedBottom()) {
      return this.loseGame();
    }
  }

  drawHud() {
    this.drawScore();
    return this.drawLives();
  }

  drawScore() {
    this.ctx.clearRect(this.canvas.width - 58, 0, 58, 22);
    this.ctx.textAlign = 'right';
    this.ctx.font = '16px "Press Start 2P"';
    this.ctx.fillStyle = 'rgb(200, 0, 0)';
    return this.ctx.fillText(`${this.score}`, this.canvas.width - 5, 20, 48);
  }

  drawLives() {
    this.ctx.clearRect(this.canvas.width - 80, this.canvas.height - 50, 80, 50);
    this.ctx.textAlign = 'right';
    this.ctx.font = '16px "Press Start 2P"';
    this.ctx.fillStyle = 'rgb(200, 0, 0)';
    return this.ctx.fillText(
      `Lives:${this.lives}`,
      this.canvas.width - 5,
      this.canvas.height - 5,
      80
    );
  }

  pause() {
    window.gtag('event', 'pause', {
      'event_category': 'game',
    });
    this.paused = true;
    this.ctx.textAlign = 'center';
    this.ctx.font = '20px "Press Start 2P"';
    this.ctx.fillStyle = 'rgb(255, 255, 255)';
    return this.ctx.fillText(
      'Paused',
      this.canvas.width / 2,
      this.canvas.height / 2,
      200
    );
  }

  resume() {
    if (
      !this.invaders ||
      !this.bullets ||
      !this.player ||
      !this.playerBullets
    ) {
      return;
    }
    window.gtag('event', 'resume', {
      'event_category': 'game',
    });
    this.paused = false;
    this.clearCanvas();
    this.invaders.draw();
    this.bullets.draw();
    this.player.draw();
    this.playerBullets.draw();
    return this.drawHud();
  }

  loseGame() {
    window.gtag('event', 'lose_game', {
      'event_category': 'game',
      'event_label': 'Game over (score is value)',
      'value': this.score,
    });
    this.loop.stop();
    this.clearCanvas();
    this.started = false;
    this.ctx.textAlign = 'center';
    this.ctx.font = '32px "Press Start 2P"';
    this.ctx.fillStyle = 'rgb(255, 255, 255)';
    this.ctx.fillText(
      'Game Over',
      this.canvas.width / 2,
      this.canvas.height / 2 - 40,
      250
    );
    this.ctx.font = '20px "Press Start 2P"';
    this.ctx.fillText(
      `Final Score: ${this.score}`,
      this.canvas.width / 2,
      this.canvas.height / 2 - 5,
      200
    );
    this.ctx.font = '24px "Press Start 2P"';
    return this.ctx.fillText(
      'Press enter to play again.',
      this.canvas.width / 2,
      this.canvas.height / 2 + 25,
      300
    );
  }
}
