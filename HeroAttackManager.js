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
  updateClosest(closest, rayPos) {
    this._attacks.forEach(attack => {
      if (!attack.updateClosest) {
        return;
      }
      attack.updateClosest(closest, rayPos);
    });
  }
}

export default HeroAttackManager;
