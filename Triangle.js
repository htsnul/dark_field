import Vector3 from "./Vector3.js"

class Triangle {
  constructor(points) {
    this.points = points;
  }
  getMultiplied(mtx) {
    return new Triangle([
      this.points[0].multiplied(mtx),
      this.points[1].multiplied(mtx),
      this.points[2].multiplied(mtx)
    ]);
  }
  getNormal() {
    const d1to2 = Vector3.sub(this.points[2], this.points[1]);
    const d1to0 = Vector3.sub(this.points[0], this.points[1]);
    return Vector3.cross(d1to2, d1to0).normalized();
  }
}

export default Triangle;
