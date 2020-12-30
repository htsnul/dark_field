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
  getDistance(rayPos) {
    let dist = 1000;
    this._enemies.forEach(enemy => {
      if (!enemy.getDistance) {
        return dist;
      }
      dist = Math.min(dist, enemy.getDistance(rayPos))
    });
    return dist;
  }
}

export default EnemyManager;
