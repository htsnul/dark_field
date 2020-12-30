import Controller from "./Controller.js"
import EnemyManager from "./EnemyManager.js"
import Hero from "./Hero.js"
import HeroAttackManager from "./HeroAttackManager.js"
import Matrix4 from "./Matrix4.js"
import RayMarchingUtil from "./RayMarchingUtil.js"
import Screen from "./Screen.js"
import Stage from "./Stage.js"
import Vector2 from "./Vector2.js"
import Vector3 from "./Vector3.js"

class Bullet {
  constructor(pos, vel) {
    this._pos = new Vector2(pos);
    this._vel = new Vector2(vel);
    this._count = 0;
    bullets.append(this);
  }
  update(stage, hero) {
    this._pos.add(this._vel);
    this._count++;
    if (stage.isHit(this._pos)) {
      new Explosion(this._pos, 2);
      bullets.remove(this);
      return;
    }
    if (hero.isHit(this._pos)) {
      hero.onHit();
      new Explosion(this._pos, 2);
      bullets.remove(this);
      return;
    }
    screen.drawCircle(this._pos, 2, [255, 192, 192]);
  }
}

class Bullets {
  constructor() {
    this._bullets = [];
  }
  reset() {
    this._bullets = [];
  }
  append(bullet) {
    this._bullets.push(bullet);
  }
  remove(bullet) {
    this._bullets = this._bullets.filter(s => s !== bullet);
  }
  update() {
    this._bullets.forEach(bullet => bullet.update());
  }
}

class Explosion {
  constructor(pos, sourceRadius) {
    this._pos = new Vector2(pos);
    this._sourceRadius = sourceRadius;
    this._count = 0;
    this._fragmentCount = Math.max(1, 4 * Math.floor(sourceRadius / 4));
    this._fragmentVel = (this._fragmentCount === 1) ? 0 : sourceRadius / 2;
    effects.append(this);
  }
  update() {
    if (this._count >= 4) {
      effects.remove(this);
      return;
    }
    for (let i = 0; i < this._fragmentCount; ++i) {
      screen.drawCircle(
        this._pos.clone().add((new Vector2(this._fragmentVel * this._count, 0)).rotate((i / this._fragmentCount) * 2 * Math.PI)),
        this._sourceRadius * 1.5 * (1 - (this._count / 4)),
        [255 - 64 * this._count, 255 - 64 * this._count, 255 - 64 * this._count]
      );
    }
    this._count++;
  }
}

class Effects {
  constructor() {
    this._effects = [];
  }
  reset() {
    this._effects = [];
  }
  append(effect) {
    this._effects.push(effect);
  }
  remove(effect) {
    this._effects = this._effects.filter(s => s !== effect);
  }
  update() {
    this._effects.forEach(effect => effect.update());
  }
}

let bullets;
let effects;

class App {
  constructor() {
    this._controller = new Controller();
    this._screen = new Screen();
    this._stage = new Stage();
    this._hero = new Hero();
    this._enemyManager = new EnemyManager();
    this._heroAttackManager = new HeroAttackManager();
    bullets = new Bullets();
    effects = new Effects();
    this._stage.reset(this._hero, this._enemyManager, this._heroAttackManager, bullets);
    setInterval(() => this.update(), 100);
  }
  update() {
    if (this._enemyManager.isEmpty) {
      //this._stage.goToNextStage(this._hero, this._enemyManager, this._heroAttackManager, bullets);
    }
    this._screen.beginFrame();
    this._hero.update(this._controller, this._stage, this._heroAttackManager);
    this._enemyManager.update(this._stage, this._hero);
    this._heroAttackManager.update(this._stage);
    bullets.update();
    effects.update();
    this._renderRayMarching();
    this._stage.renderMiniMap(this._screen);
    {
      const dirIndex = Math.floor((this._hero.angle + Math.PI / 4) / (Math.PI / 2)) % 4;
      const dirAlphabet = "NESW"[dirIndex];
      this._screen.drawText(new Vector2(0, 0), dirAlphabet, [255, 255, 255]);
    }
    this._controller.updatePrev();
    this._screen.endFrame();
  }
  _getDistance(rayPos) {
    return Math.min(
     RayMarchingUtil.getPlaneYDistance(rayPos, -0.5),
     RayMarchingUtil.getPlaneYDistance(rayPos, 0.5),
     this._stage.getDistance(rayPos),
     this._enemyManager.getDistance(rayPos),
     this._heroAttackManager.getDistance(rayPos),
    );
  }
  //   z
  //  /
  // +-- x
  // |
  // y
  _renderRayMarching() {
    const height = 64;
    const width = 64;
    const pixelW = 4;
    for (let y = 0; y < height; ++y) {
      const fy = -0.5 + y / height;
      for (let x = 0; x < width; ++x) {
        const fx = (-0.5 + x / width) * width / height;
        const camPos = this._hero.position;
        const rayDir = new Vector3(fx, fy, 1).normalized().multiplied(Matrix4.rotateY(this._hero.angle));
        let rayPos = camPos.clone();
        let color = [0, 0, 0];
        for (let i = 0; i < 40; ++i) {
          const dist = this._getDistance(rayPos);
          if (dist < 0.01) {
            const distFromCam = Vector3.sub(rayPos, camPos).length();
            const normal = RayMarchingUtil.getNormal(rayPos, (rayPos) => this._getDistance(rayPos));
            const dot = Vector3.dot(rayDir.negated(), normal);
            const intensity = Math.min(Math.pow(2, -distFromCam / 2) * dot, 1);
            color = [255 * intensity, 255 * intensity, 255 * intensity];
            break;
          }
          rayPos = Vector3.add(rayPos, rayDir.scaled(dist));
        }
        this._screen.drawSquare(
          new Vector2((x + 0.5) * pixelW, (y + 0.5) * pixelW), pixelW,
          color,
        );
      }
    }
  }
}

export let app;

onload = () => app = new App();

