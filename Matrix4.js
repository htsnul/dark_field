// column-major
class Matrix4 {
  constructor(m) {
    this.m = m;
  }
  static mul() {
    const m = [];
    let m0, m1;
    m0 = arguments[0].m;
    for (let i = 1; i < arguments.length; ++i) {
      m1 = arguments[i].m;
      for (let x = 0; x < 4; ++x) {
        for (let y = 0; y < 4; ++y) {
          m[4 * x + y] = (
            m0[4 * 0 + y] * m1[4 * x + 0] +
            m0[4 * 1 + y] * m1[4 * x + 1] +
            m0[4 * 2 + y] * m1[4 * x + 2] +
            m0[4 * 3 + y] * m1[4 * x + 3]
          );
        }
      }
      m0 = m;
    }
    return new Matrix4(m);
  }
  static identity() {
    return new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }
  static translate(v) {
    return new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      v.x, v.y, v.z, 1,
    ]);
  }
  static rotateX(angle) {
    return new Matrix4([
      1, 0, 0, 0,
      0, +Math.cos(angle), +Math.sin(angle), 0,
      0, -Math.sin(angle), +Math.cos(angle), 0,
      0, 0, 0, 1
    ]);
  }
  static rotateY(angle) {
    return new Matrix4([
      +Math.cos(angle), 0, -Math.sin(angle), 0,
      0, 1, 0, 0,
      +Math.sin(angle), 0, +Math.cos(angle), 0,
      0, 0, 0, 1
    ]);
  }
  static rotateZ(angle) {
    return new Matrix4([
      +Math.cos(angle), +Math.sin(angle), 0, 0,
      -Math.sin(angle), +Math.cos(angle), 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }
}
export default Matrix4;
