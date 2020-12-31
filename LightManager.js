class LightManager {
  constructor() {
    this._lights = [];
  }
  append(light) {
    this._lights.push(light);
  }
  remove(light) {
    this._lights = this._lights.filter(l => l !== light);
  }
  get lights() {
    return this._lights;
  }
}

export default LightManager;

