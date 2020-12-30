import Matrix4 from "./Matrix4.js"
import Vector3 from "./Vector3.js"

class RayMarchingUtil {
  static getBoxDistance(rayPos, pos, halfSize) {
    return Math.max(
      Math.abs(rayPos.x - pos.x) - halfSize.x,
      Math.abs(rayPos.y - pos.y) - halfSize.y,
      Math.abs(rayPos.z - pos.z) - halfSize.z
    );
  }
  static getBoxDistanceWithTransform(rayPos, mtx, halfSize) {
    const p = rayPos.multiplied(mtx);
    return Math.max(
      Math.abs(p.x) - halfSize.x,
      Math.abs(p.y) - halfSize.y,
      Math.abs(p.z) - halfSize.z
    );
  }
  static getSpehereDistance(rayPos, pos, len) {
    return Vector3.sub(rayPos, pos).length() - len;
  }
  static getSphereDistanceWithTransform(rayPos, mtx, len) {
    const p = rayPos.multiplied(mtx);
    return p.length() - len;
  }
  static getPlaneYDistance(rayPos, posY) {
    return Math.abs(rayPos.y - posY);
  }
  static getNormal(rayPos, getDistance) {
    const epsilon = 0.01;
    const dist = getDistance(rayPos);
    const distPx = getDistance(Vector3.add(rayPos, new Vector3(-epsilon, 0, 0)));
    const distPy = getDistance(Vector3.add(rayPos, new Vector3(0, -epsilon, 0)));
    const distPz = getDistance(Vector3.add(rayPos, new Vector3(0, 0, -epsilon)));
    return new Vector3(dist - distPx, dist - distPy, dist - distPz).normalized();
  }
}

export default RayMarchingUtil;
