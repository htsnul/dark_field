import Vector3 from "./Vector3.js"

class IntersectUtil {
  static getRayAndTriangleIntersection(
    rayStart,
    rayDir,
    triangle
  ) {
    const triangleNormal = triangle.getNormal();
    const rayDirDotTriangleNormal = Vector3.dot(rayDir, triangleNormal);
    if (rayDirDotTriangleNormal >= 0) return undefined;
    const signedPlaneDistance = Vector3.dot(triangle.points[0], triangleNormal);
    const t = (
      (signedPlaneDistance - Vector3.dot(rayStart, triangleNormal)) /
      rayDirDotTriangleNormal
    );
    if (t < 0) return undefined;
    const intersectPoint = Vector3.add(rayStart, rayDir.scaled(t));
    for (let i = 0; i < 3; ++i) {
      const sign = Vector3.dot(Vector3.cross(
        Vector3.sub(triangle.points[(i + 0) % 3], intersectPoint),
        Vector3.sub(triangle.points[(i + 1) % 3], intersectPoint)
      ), triangleNormal);
      if (sign < 0) return undefined;
    }
    return t;
  }
}

export default IntersectUtil;
