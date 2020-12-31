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
  static updateClosestByBox(closest, rayPos, pos, halfSize, material) {
    const dist = Math.max(
      Math.abs(rayPos.x - pos.x) - halfSize.x,
      Math.abs(rayPos.y - pos.y) - halfSize.y,
      Math.abs(rayPos.z - pos.z) - halfSize.z
    );
    if (dist < closest.distance) {
      closest.distance = dist;
      closest.material = material;
    }
  }
  static getBoxDistanceWithTransform(rayPos, mtx, halfSize) {
    const p = rayPos.multiplied(mtx);
    return Math.max(
      Math.abs(p.x) - halfSize.x,
      Math.abs(p.y) - halfSize.y,
      Math.abs(p.z) - halfSize.z
    );
  }
  static updateClosestByBoxWithTransform(closest, rayPos, mtx, halfSize, material) {
    const p = rayPos.multiplied(mtx);
    const dist = Math.max(
      Math.abs(p.x) - halfSize.x,
      Math.abs(p.y) - halfSize.y,
      Math.abs(p.z) - halfSize.z
    );
    if (dist < closest.distance) {
      closest.distance = dist;
      closest.material = material;
    }
  }
  static getSpehereDistance(rayPos, pos, len) {
    return Vector3.sub(rayPos, pos).length() - len;
  }
  static updateClosestBySpehere(closest, rayPos, pos, len, material) {
    const dist = Vector3.sub(rayPos, pos).length() - len;
    if (dist < closest.distance) {
      closest.distance = dist;
      closest.material = material;
    }
  }
  static getSphereDistanceWithTransform(rayPos, mtx, len) {
    const p = rayPos.multiplied(mtx);
    return p.length() - len;
  }
  static updateClosestBySphereWithTransform(closest, rayPos, mtx, len, material) {
    const p = rayPos.multiplied(mtx);
    const dist = p.length() - len;
    if (dist < closest.distance) {
      closest.distance = dist;
      closest.material = material;
    }
  }
  static getPlaneYDistance(rayPos, posY) {
    return Math.abs(rayPos.y - posY);
  }
  static updateClosestByPlaneY(closest, rayPos, posY, material) {
    const dist = Math.abs(rayPos.y - posY);
    if (dist < closest.distance) {
      closest.distance = dist;
      closest.material = material;
    }
  }
  static calcNormal(pos, closestDistance, getDistance) {
    const epsilon = 0.01;
    const dist = closestDistance;
    const distPx = getDistance(Vector3.add(pos, new Vector3(-epsilon, 0, 0)));
    const distPy = getDistance(Vector3.add(pos, new Vector3(0, -epsilon, 0)));
    const distPz = getDistance(Vector3.add(pos, new Vector3(0, 0, -epsilon)));
    return new Vector3(dist - distPx, dist - distPy, dist - distPz).normalized();
  }
}

export default RayMarchingUtil;
