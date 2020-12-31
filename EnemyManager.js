class EnemyManager {
  constructor() {
    this._enemies = [];
  }
  reset() {
    this._enemies = [];
  }
  append(enemy) {
    this._enemies.push(enemy);
  }
  remove(enemy) {
    this._enemies = this._enemies.filter(e => e !== enemy);
  }
  get isEmpty() {
    return this._enemies.length === 0;
  }
  findHit(pos, offset = 0) {
    return this._enemies.find(e => e.isHit && e.isHit(pos, offset));
  }
  update(stage, hero) {
    this._enemies.forEach(enemy => enemy.update(stage, hero));
  }
  updateClosest(closest, rayPos) {
    this._enemies.forEach(enemy => {
      if (!enemy.updateClosest) {
        return;
      }
      enemy.updateClosest(closest, rayPos);
    });
  }
}

export default EnemyManager;
