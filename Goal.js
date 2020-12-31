import Matrix4 from "./Matrix4.js"
import RayMarchingUtil from "./RayMarchingUtil.js"
import Vector3 from "./Vector3.js"

class Goal {
  constructor(enemyManager, pos) {
    this._pos = pos;
    this._count = 0;
    this._distMtx = null;
    enemyManager.append(this);
  }
  update() {
    this._count++;
    this._distMtx = Matrix4.mul(
      Matrix4.rotateY(Math.PI * this._count / 12),
      Matrix4.rotateZ(Math.PI * this._count / 12),
      Matrix4.translate(new Vector3(-this._pos.x, 0, +this._pos.y)),
    );
  }
  updateClosest(closest, rayPos) {
    {
      const dist = RayMarchingUtil.getBoxDistance(rayPos, new Vector3(this._pos.x, 0, -this._pos.y), Vector3.all(0.5));
      if (dist > 0.25) {
        if (dist < closest.distance) {
          closest.distance = dist;
        }
        return;
      }
    }
    RayMarchingUtil.updateClosestByBoxWithTransform(closest, rayPos, this._distMtx, Vector3.all(1 / 8));
    RayMarchingUtil.updateClosestBySpehere(closest, rayPos, new Vector3(this._pos.x, +0.5, -this._pos.y), 0.25);
  }
}

export default Goal;
