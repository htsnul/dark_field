import Matrix4 from "./Matrix4.js"
import RayMarchingUtil from "./RayMarchingUtil.js"
import Vector3 from "./Vector3.js"

class Skeleton {
  constructor(enemyManager, pos) {
    this._pos = pos;
    this._count = 0;
    enemyManager.append(this);
  }
  update() {
    this._count++;
    this._distMtx0 = Matrix4.translate(new Vector3(-this._pos.x, 0, +this._pos.y));
    this._headDistMtx = Matrix4.mul(
      Matrix4.translate(new Vector3(0, 3 / 16, 0)),
      this._distMtx0
    );
    this._leftLegDistMtx = Matrix4.mul(
      Matrix4.translate(new Vector3(0, -3 / 16, 0)),
      Matrix4.rotateX(1 / 8 * Math.PI * Math.sin(this._count * Math.PI / 12)),
      Matrix4.translate(new Vector3(0.5 / 16, -2 / 16, 0)),
      this._distMtx0
    );
    this._rightLegDistMtx = Matrix4.mul(
      Matrix4.translate(new Vector3(0, -3 / 16, 0)),
      Matrix4.rotateX(1 / 8 * Math.PI * Math.sin(Math.PI + this._count * Math.PI / 12)),
      Matrix4.translate(new Vector3(-0.5 / 16, -2 / 16, 0)),
      this._distMtx0
    );
  }
  getDistance(rayPos) {
    let dist = RayMarchingUtil.getBoxDistance(rayPos, new Vector3(this._pos.x, 0, -this._pos.y), Vector3.all(0.5));
    if (dist > 0.25) {
      return dist;
    }
    return Math.min(
      RayMarchingUtil.getBoxDistanceWithTransform(rayPos, this._distMtx0, new Vector3(1 / 16, 2 / 16, 0.5 / 16)),
      RayMarchingUtil.getSphereDistanceWithTransform(rayPos, this._headDistMtx, 0.5 / 16),
      RayMarchingUtil.getBoxDistanceWithTransform(rayPos, this._leftLegDistMtx, new Vector3(0.25 / 16, 3 / 16, 0.25 / 16)),
      RayMarchingUtil.getBoxDistanceWithTransform(rayPos, this._rightLegDistMtx, new Vector3(0.25 / 16, 3 / 16, 0.25 / 16)),
    );
  }
}

export default Skeleton;
