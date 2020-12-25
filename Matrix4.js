class Matrix4 {
  constructor(m) {
    this.m = m;
  }
  static translate(v) {
    return new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      v.x, v.y, v.z, 0,
    ]);
  }
  static rotateY(angle) {
    return new Matrix4([
      +Math.cos(angle), 0, +Math.sin(angle), 0,
      0, 1, 0, 0,
      -Math.sin(angle), 0, +Math.cos(angle), 0,
      0, 0, 0, 1
    ]);
  }
  static rotateZ(angle) {
    return new Matrix4([
      +Math.cos(angle), -Math.sin(angle), 0, 0,
      +Math.sin(angle), +Math.cos(angle), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }
}
export default Matrix4;
