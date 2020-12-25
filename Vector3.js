import Matrix4 from "./Matrix4.js"

class Vector3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  negated() {
    return new Vector3(-this.x, -this.y, -this.z);
  }
  scaled(s) {
    return new Vector3(s * this.x, s * this.y, s * this.z);
  }
  multiplied(mtx) {
    return new Vector3(
      mtx.m[0] * this.x + mtx.m[4] * this.y + mtx.m[8] * this.z + mtx.m[12],
      mtx.m[1] * this.x + mtx.m[5] * this.y + mtx.m[9] * this.z + mtx.m[13],
      mtx.m[2] * this.x + mtx.m[6] * this.y + mtx.m[10] * this.z + mtx.m[14]
    );
  }
  normalized() {
    const len = this.length();
    return new Vector3(this.x / len, this.y / len, this.z / len);
  }
  static add(v0, v1) {
    return new Vector3(v0.x + v1.x, v0.y + v1.y, v0.z + v1.z);
  }
  static sub(v0, v1) {
    return new Vector3(v0.x - v1.x, v0.y - v1.y, v0.z - v1.z);
  }
  static dot(v0, v1) {
    return (v0.x * v1.x + v0.y * v1.y + v0.z * v1.z);
  }
  static cross(v0, v1) {
    return new Vector3(
      v0.y * v1.z - v0.z * v1.y,
      v0.z * v1.x - v0.x * v1.z,
      v0.x * v1.y - v0.y * v1.x
    );
  }
}

export default Vector3;
