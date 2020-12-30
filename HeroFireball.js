import Matrix4 from "./Matrix4.js"
import RayMarchingUtil from "./RayMarchingUtil.js"
import Vector3 from "./Vector3.js"

class HeroFireball {
  constructor(heroAttackManager, pos, angle) {
    this._pos = new Vector3(pos.x, pos.y + 1 / 8, pos.z);
    this._angle = angle;
    heroAttackManager.append(this);
  }
  update(heroAttackManager, stage) {
    const velSign = new Vector3(0, 0, 0);
    velSign.x += +Math.sin(this._angle);
    velSign.z += +Math.cos(this._angle);
    const vel = velSign.scaled(0.5);
    this._pos.add(vel);
    if (stage.isHit(this._pos)) {
      //new Explosion(this._pos, 2);
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
  }
  getDistance(rayPos) {
    return RayMarchingUtil.getSpehereDistance(rayPos, this._pos, 1 / 16);
  }
}

export default HeroFireball;
