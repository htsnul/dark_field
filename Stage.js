import Skeleton from "./Skeleton.js"
import Goal from "./Goal.js"
import Screen from "./Screen.js"
import RayMarchingUtil from "./RayMarchingUtil.js"
import Vector2 from "./Vector2.js"
import Vector3 from "./Vector3.js"
import stageDatas from "./stageDatas.js"

class Stage {
  static get CELL_WIDTH() {
    return 1;
  }
  static get WIDTH_IN_CELL() {
    return 32;
  }
  constructor() {
    this._index = 0;
    this._table = [];
    for (let y = 0; y < Stage.WIDTH_IN_CELL; ++y) {
      this._table[y] = [];
    }
  }
  _getStartPosition() {
    for (let y = 0; y < Stage.WIDTH_IN_CELL; ++y) {
      for (let x = 0; x < Stage.WIDTH_IN_CELL; ++x) {
        if (this._table[y][x] === 'S') {
          return new Vector3(Stage.CELL_WIDTH * (x + 0.5), 0, -Stage.CELL_WIDTH * (y + 0.5));
        }
      }
    }
  }
  goToFirstStage(ship, enemyManager, shots, bullets) {
    this._index = 0
    this.reset(ship, enemyManager, shots, bullets);
  }
  goToNextStage(ship, enemyManager, shots, bullets) {
    this._index++;
    if (this._index >= stageDatas.length) {
      this._index = 0
    }
    this.reset(ship, enemyManager, shots, bullets);
  }
  reset(ship, enemyManager, shots, bullets) {
    const stageData = stageDatas[this._index];
    const tableData = stageData.table;
    const enemiesData = stageData.enemies;
    for (let y = 0; y < Stage.WIDTH_IN_CELL; ++y) {
      for (let x = 0; x < Stage.WIDTH_IN_CELL; ++x) {
        this._table[y][x] = tableData[y][x];
      }
    }
    ship.reset(this._getStartPosition());
    enemyManager.reset();
    shots.reset();
    bullets.reset();
    for (let y = 0; y < Stage.WIDTH_IN_CELL; ++y) {
      for (let x = 0; x < Stage.WIDTH_IN_CELL; ++x) {
        const ch = this._table[y][x];
        const enemyData = enemiesData[ch];
        if (enemyData === undefined) {
          continue;
        }
        const pos = new Vector3(Stage.CELL_WIDTH * (x + 0.5), 0, -Stage.CELL_WIDTH * (y + 0.5));
        switch (enemyData.type) {
          case 'Enemy0':
            new Enemy0(pos);
            break;
          case 'Enemy1':
            new Enemy1(pos);
            break;
          case 'SurvivalModeManager':
            new SurvivalModeManager();
            break;
          case 'Skeleton':
            new Skeleton(enemyManager, pos);
            break;
          case 'Goal':
            new Goal(enemyManager, pos);
            break;
        }
      }
    }
  }
  renderMiniMap(screen) {
    const wic = Stage.WIDTH_IN_CELL;
    for (let y = 0; y < wic; ++y) {
      for (let x = 0; x < wic; ++x) {
        let color = [0, 0, 0];
        if (this._table[y][x] === '#') {
          color = [128, 128, 128];
        }
        screen.drawPixel(x, Screen.HEIGHT - Stage.WIDTH_IN_CELL + y, color);
      }
    }
  }
  _getCell(pos) {
    const posByGrid = { x: Math.floor(pos.x / Stage.CELL_WIDTH), y: Math.floor(-pos.z / Stage.CELL_WIDTH) };
    if (posByGrid.x < 0 || posByGrid.y < 0 || Stage.WIDTH_IN_CELL <= posByGrid.x || Stage.WIDTH_IN_CELL <= posByGrid.y) {
      return undefined;
    }
    return this._table[posByGrid.y][posByGrid.x];
  }
  isHit(pos) {
    return this._getCell(pos) === '#';
  }
  pushOut(pos, radius) {
    const cw = Stage.CELL_WIDTH;
    const posW = Vector3.add(pos, new Vector3(-radius, 0, 0));
    if (this.isHit(posW)) {
      pos.x = Math.ceil(posW.x / cw) * cw + radius;
    }
    const posE = Vector3.add(pos, new Vector3(radius, 0, 0));
    if (this.isHit(posE)) {
      pos.x = Math.floor(posE.x / cw) * cw - radius;
    }
    const posN = Vector3.add(pos, new Vector3(0, 0, radius));
    if (this.isHit(posN)) {
      pos.z = -Math.ceil(-posN.z / cw) * cw - radius;
    }
    const posS = Vector3.add(pos, new Vector3(0, 0, -radius));
    if (this.isHit(posS)) {
      pos.z = -Math.floor(-posS.z / cw) * cw + radius;
    }
  }
  updateClosest(closest, rayPos) {
    const shipIntPosX = Math.floor(rayPos.x);
    const shipIntPosY = Math.floor(-rayPos.z);
    const rangeWidth = 1;
    for (let iy = -rangeWidth; iy <= rangeWidth; ++iy) {
      for (let ix = -rangeWidth; ix <= rangeWidth; ++ix) {
        const pos = new Vector3(shipIntPosX + ix + 0.5, 0, -(shipIntPosY + iy + 0.5));
        if (!this.isHit(pos)) {
          continue;
        }
        const dist = RayMarchingUtil.getBoxDistance(
          rayPos, pos, Vector3.all(0.5)
        );
        if (dist < closest.distance) {
          closest.distance = dist;
          const localPos = Vector3.sub(rayPos, pos);
          if (Math.min(Math.abs(localPos.x), Math.abs(localPos.z)) > 0.5 - 1 / 8) {
            closest.material = { color: [224, 224, 224] };
          } else {
            closest.material = undefined;
          }
        }
      }
    }
    // Because not checking areas beyond 1 grid,
    // make sure ray doesn't go any farther.
    if (1 < closest.distance) {
      closest.distance = 1;
    }
  }
}

export default Stage;
