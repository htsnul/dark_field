import HeroFireball from "./HeroFireball.js"
import Vector3 from "./Vector3.js"

class Hero {
  constructor() {
    this._pos = new Vector3(0, 0, 0);
    this._angle = 0.5 * Math.PI;
    this._vel = new Vector3(0, 0, 0);
    this._isDead = false;
    this._countToShot = 0;
    this._deadWaitCountToRestart = 0;
  }
  reset(pos) {
    this._isDead = 0;
    this._pos = pos;
    this._vel = new Vector3(0, 0, 0);
  }
  get position() {
    return this._pos;
  }
  get angle() {
    return this._angle;
  }
  get isDead() {
    return this._isDead;
  }
  update(controller, stage, heroAttackManager) {
    const lastPos = this._pos.clone();
    if (this._isDead) {
      this._deadWaitCountToRestart--;
      if (this._deadWaitCountToRestart <= 0) {
        stage.goToFirstStage(ship, enemies, shots, bullets);
      }
      return;
    }
    const velSign = new Vector3(0, 0, 0);
    if (controller.isButtonDown('KEY_A')) {
      velSign.x += -Math.cos(this._angle);
      velSign.z += +Math.sin(this._angle);
    } else if (controller.isButtonDown('KEY_D')) {
      velSign.x += +Math.cos(this._angle);
      velSign.z += -Math.sin(this._angle);
    }
    if (controller.isButtonDown('KEY_W')) {
      velSign.x += +Math.sin(this._angle);
      velSign.z += +Math.cos(this._angle);
    } else if (controller.isButtonDown('KEY_S')) {
      velSign.x += -Math.sin(this._angle);
      velSign.z += -Math.cos(this._angle);
    }
    if (controller.isButtonDown('KEY_LEFT')) {
      this._angle -= Math.PI / 16;
    } else if (controller.isButtonDown('KEY_RIGHT')) {
      this._angle += Math.PI / 16;
    }
    while (this._angle < 0) this._angle += 2 * Math.PI;
    const vel = velSign.scaled(4);
    vel.clampByLength(0, 0.25);
    this._pos.add(vel);
    stage.pushOut(this._pos, 0.5);
    if (this._countToShot > 0) {
      this._countToShot--;
    }
    if (controller.isButtonDown("KEY_SHIFT_RIGHT") && this._countToShot === 0) {
      const actualVel = Vector3.sub(this._pos, lastPos);
      new HeroFireball(heroAttackManager, lastPos.clone(), actualVel, this._angle);
      this._countToShot = 4;
    }
    //screen.drawCircle(this._pos, 4, [224, 224, 255]);
  }
  isHit(pos) {
    return !this._isDead && Vector3.sub(new Vector3(pos.x, 0, -pos.y), this._pos).length() <= 4;
  }
  onHit(pos) {
    //new Explosion(this._pos, 4);
    this._isDead = true;
    this._deadWaitCountToRestart = 3 * 10;
  }
}

export default Hero;
