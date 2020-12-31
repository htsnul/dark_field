import Matrix4 from "./Matrix4.js"
import RayMarchingUtil from "./RayMarchingUtil.js"
import Vector3 from "./Vector3.js"
import { app } from "./App.js"

class Skeleton {
  constructor(enemyManager, pos) {
    this._pos = pos;
    this._count = 0;
    enemyManager.append(this);
  }
  update() {
    this._count++;
    const vel = Vector3.sub(app.hero.position, this._pos).normalized().scaled(1 / 64);
    //this._pos.add(vel);
    //const angle = Math.atan2(vel.z, vel.x) - Math.PI / 2;
    const angle = this._count * Math.PI / 16;
    this._bodyInvMtx = Matrix4.mul(
      Matrix4.rotateY(angle),
      Matrix4.translate(this._pos.negated())
    );
    this._headInvMtx = Matrix4.mul(
      Matrix4.translate(new Vector3(0, 3 / 16, 0)),
      this._bodyInvMtx
    );
    this._leftLegInvMtx = Matrix4.mul(
      Matrix4.translate(new Vector3(0, -3 / 16, 0)),
      Matrix4.rotateX(1 / 8 * Math.PI * Math.sin(this._count * Math.PI / 12)),
      Matrix4.translate(new Vector3(0.5 / 16, -2 / 16, 0)),
      this._bodyInvMtx
    );
    this._rightLegInvMtx = Matrix4.mul(
      Matrix4.translate(new Vector3(0, -3 / 16, 0)),
      Matrix4.rotateX(1 / 8 * Math.PI * Math.sin(Math.PI + this._count * Math.PI / 12)),
      Matrix4.translate(new Vector3(-0.5 / 16, -2 / 16, 0)),
      this._bodyInvMtx
    );
  }
  updateClosest(closest, rayPos) {
    {
      const dist = RayMarchingUtil.getBoxDistance(rayPos, this._pos, Vector3.all(0.5));
      if (dist > 0.25) {
        if (dist < closest.distance) {
          closest.distance = dist;
        }
        return;
      }
    }
    RayMarchingUtil.updateClosestByBoxWithTransform(closest, rayPos, this._bodyInvMtx, new Vector3(1 / 16, 2 / 16, 0.5 / 16));
    RayMarchingUtil.updateClosestBySphereWithTransform(closest, rayPos, this._headInvMtx, 0.5 / 16);
    RayMarchingUtil.updateClosestByBoxWithTransform(closest, rayPos, this._leftLegInvMtx, new Vector3(0.25 / 16, 3 / 16, 0.25 / 16));
    RayMarchingUtil.updateClosestByBoxWithTransform(closest, rayPos, this._rightLegInvMtx, new Vector3(0.25 / 16, 3 / 16, 0.25 / 16));
  }
}

export default Skeleton;
