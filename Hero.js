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
  update(controller, stage) {
    if (this._isDead) {
      this._deadWaitCountToRestart--;
      if (this._deadWaitCountToRestart <= 0) {
        stage.goToFirstStage(ship, enemies, shots, bullets);
      }
      return;
    }
    const velSign = new Vector3(0, 0, 0);
    if (controller.isButtonHeld('KEY_A')) {
      velSign.x += -Math.cos(this.angle);
      velSign.z += +Math.sin(this.angle);
    } else if (controller.isButtonHeld('KEY_D')) {
      velSign.x += +Math.cos(this.angle);
      velSign.z += -Math.sin(this.angle);
    }
    if (controller.isButtonHeld('KEY_W')) {
      velSign.x += +Math.sin(this.angle);
      velSign.z += +Math.cos(this.angle);
    } else if (controller.isButtonHeld('KEY_S')) {
      velSign.x += -Math.sin(this.angle);
      velSign.z += -Math.cos(this.angle);
    }
    if (controller.isButtonHeld('KEY_LEFT')) {
      this._angle -= Math.PI / 16;
    } else if (controller.isButtonHeld('KEY_RIGHT')) {
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
    if (controller.isButtonHeld('MOUSE_BUTTON_LEFT') && this._countToShot === 0) {
      new Shot(this._pos, controller.mousePosition.clone().sub(this._pos).normalize().multiplyScalar(8));
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
