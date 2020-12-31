import Controller from "./Controller.js"
import EnemyManager from "./EnemyManager.js"
import Hero from "./Hero.js"
import HeroAttackManager from "./HeroAttackManager.js"
import LightManager from "./LightManager.js"
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
    this._lightManager = new LightManager();
    this._stage = new Stage();
    this._hero = new Hero();
    this._enemyManager = new EnemyManager();
    this._heroAttackManager = new HeroAttackManager();
    bullets = new Bullets();
    effects = new Effects();
    this._stage.reset(this._hero, this._enemyManager, this._heroAttackManager, bullets);
    setInterval(() => this.update(), 100);
  }
  get lightManager() {
    return this._lightManager;
  }
  get hero() {
    return this._hero;
  }
  update() {
    performance.clearMarks("update start");
    performance.mark("update start");
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
      const dirIndex = Math.floor((this._hero.angle + Math.PI / 8) / (Math.PI / 4)) % 8;
      const dirAlphabet = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][dirIndex];
      this._screen.drawText(new Vector2(0, 0), dirAlphabet, [255, 255, 255]);
    }
    this._controller.updatePrev();
    {
      performance.measure("update", "update start");
      const duration = performance.getEntriesByName("update")[0].duration;
      const durationStr = duration.toFixed(2);
      this._screen.drawText(
        new Vector2(Screen.WIDTH - durationStr.length * 8, 0), durationStr, [255, 255, 255]
      );
      performance.clearMeasures("update");
    }
    this._screen.endFrame();
  }
  _updateClosest(closest, rayPos) {
    {
      const dist = 0.5 - Math.abs(rayPos.y);
      if (dist < closest.distance) {
        closest.distance = dist;
        const localX = rayPos.x % 1 + ((rayPos.x < 0) ? 1 : 0) - 0.5;
        const localZ = rayPos.z % 1 + ((rayPos.z < 0) ? 1 : 0) - 0.5;
        if (Math.max(Math.abs(localX), Math.abs(localZ)) > 0.5 - 1 / 4) {
          closest.material = { color: [224, 224, 224] };
        } else {
          closest.material = undefined;
        }
      }
    }
    this._stage.updateClosest(closest, rayPos);
    this._enemyManager.updateClosest(closest, rayPos);
    this._heroAttackManager.updateClosest(closest, rayPos);
  }
  _calcRayMarchingPointColor(eyePos, rayDir) {
    let rayPos = eyePos.clone();
    let closest;
    for (let i = 0; i < 64; ++i) {
      closest = { distance: Infinity };
      this._updateClosest(closest, rayPos);
      if (closest.distance < 0.01) {
        break;
      }
      rayPos.add(rayDir.scaled(closest.distance));
    }
    const collisionPos = rayPos;
    const collisionNormal = RayMarchingUtil.calcNormal(
      collisionPos,
      closest.distance,
      (rayPos) => {
        const closest = { distance: Infinity };
        this._updateClosest(closest, rayPos)
        return closest.distance;
      }
    );
    const material = closest.material;
    let color = [0, 0, 0];
    if (material && material.light) {
      color = [255, 255, 255];
      if (material.color) {
        color = material.color;
      }
      return color;
    }
    {
      const distFromCam = Vector3.sub(collisionPos, eyePos).length();
      const dot = Vector3.dot(rayDir.negated(), collisionNormal);
      if (dot > 0) {
        const influenceDistance = 4;
        const intensity = Math.min((1 - distFromCam / influenceDistance) * dot, 1);
        let baseColor = [255, 255, 255];
        if (material && material.color) {
          baseColor = material.color;
        }
        color = [baseColor[0] * intensity, baseColor[1] * intensity, baseColor[2] * intensity];
      }
    }
    this._lightManager.lights.forEach((light) => {
      const lightPos = light.position;
      const lightDistance = Vector3.sub(lightPos, collisionPos).length();
      const rayDir = Vector3.sub(lightPos, collisionPos).normalized();
      const rayDirDotCollisionNormal = Vector3.dot(rayDir, collisionNormal);
      if (rayDirDotCollisionNormal <= 0) {
        return;
      }
      const lightIntensity = (Math.max(0, Math.min(
        (1 - lightDistance / light.influenceDistance) * rayDirDotCollisionNormal, 1
      )));
      if (lightIntensity <= 0) {
        return;
      }
      let rayPos = collisionPos.clone();
      rayPos.add(rayDir.scaled(0.02));
      for (let i = 0; i < 64; ++i) {
        let closest = { distance: Infinity };
        this._updateClosest(closest, rayPos);
        if (closest.material && closest.material.light === light) {
          const dot = rayDirDotCollisionNormal;
          color[0] = Math.min(color[0] + light.color[0] * lightIntensity, 255); 
          color[1] = Math.min(color[1] + light.color[1] * lightIntensity, 255); 
          color[2] = Math.min(color[2] + light.color[2] * lightIntensity, 255); 
          break;
        } else if (closest.distance < 0.01) {
          break;
        }
        rayPos.add(rayDir.scaled(closest.distance));
      }
    });
    return color;
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
        const eyePos = this._hero.position;
        const rayDir = new Vector3(fx, fy, 1).normalized().multiplied(Matrix4.rotateY(this._hero.angle));
        const color = this._calcRayMarchingPointColor(eyePos, rayDir);
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

