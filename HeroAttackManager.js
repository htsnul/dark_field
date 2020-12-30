class HeroAttackManager {
  constructor() {
    this._attacks = [];
  }
  reset() {
    this._attacks = [];
  }
  append(attack) {
    this._attacks.push(attack);
  }
  remove(attack) {
    this._attacks = this._attacks.filter(a => a !== attack);
  }
  update(stage) {
    this._attacks.forEach(attack => attack.update(this, stage));
  }
  getDistance(rayPos) {
    let dist = 1000;
    this._attacks.forEach(attack => {
      if (!attack.getDistance) {
        return dist;
      }
      dist = Math.min(dist, attack.getDistance(rayPos))
    });
    return dist;
  }
}

export default HeroAttackManager;
