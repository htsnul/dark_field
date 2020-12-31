import { app } from "./App.js"
import Light from "./Light.js"
import Matrix4 from "./Matrix4.js"
import RayMarchingUtil from "./RayMarchingUtil.js"
import Vector3 from "./Vector3.js"

class HeroFireball {
  constructor(heroAttackManager, pos, vel, angle) {
    this._pos = new Vector3(pos.x, pos.y + 1 / 8, pos.z);
    this._vel = vel.clone();
    this._angle = angle;
    this._light = new Light(app.lightManager);
    const velSign = new Vector3(0, 0, 0);
    velSign.x += +Math.sin(this._angle);
    velSign.z += +Math.cos(this._angle);
    this._vel = Vector3.add(vel, velSign.scaled(1 / 2));
    heroAttackManager.append(this);
  }
  update(heroAttackManager, stage) {
    this._pos.add(this._vel);
    if (stage.isHit(this._pos)) {
      //new Explosion(this._pos, 2);
      app.lightManager.remove(this._light);
      heroAttackManager.remove(this);
      return;
    }
    //{
    //  const hitEnemy = enemies.findHit(this._pos, 4);
    //  if (hitEnemy !== undefined) {
    //    hitEnemy.onHit();
    //    new Explosion(this._pos, 2);
    //    shots.remove(this);
    //    return;
    //  }
    //}
    //screen.drawCircle(this._pos, 2, [128, 128, 255]);
    this._light.color = [ 255, 128, 64 ];
    this._light.position = this._pos.clone();
    this._light.influenceDistance = 2;
  }
  updateClosest(closest, rayPos) {
    RayMarchingUtil.updateClosestBySpehere(
      closest, rayPos, this._pos, 1 / 16,
      { light: this._light, color: [ 255, 224, 192 ] }
    );
  }
}

export default HeroFireball;
