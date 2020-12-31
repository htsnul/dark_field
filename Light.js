import Vector3 from "./Vector3.js"

class Light {
  constructor(lightManager) {
    this._pos = new Vector3();
    this._color = [255, 255, 255];
    this._influenceDistance = 1;
    lightManager.append(this);
  }
  set position(pos) {
    this._pos = pos;
  }
  get position() {
    return this._pos;
  }
  set color(color) {
    this._color = color;
  }
  get color() {
    return this._color;
  }
  set influenceDistance(influenceDistance) {
    this._influenceDistance = influenceDistance;
  }
  get influenceDistance() {
    return this._influenceDistance;
  }
}

export default Light;
