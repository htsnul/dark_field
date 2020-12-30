class Controller {
  constructor () {
    this._buttons = {
      KEY_W: false,
      KEY_A: false,
      KEY_S: false,
      KEY_D: false,
      KEY_LEFT: false,
      KEY_RIGHT: false,
      KEY_SHIFT_RIGHT: false,
    };
    this._buttonsPrev = { ...this._buttons };
    addEventListener('keydown', this._onKeyDown.bind(this));
    addEventListener('keyup', this._onKeyUp.bind(this));
  }
  isButtonDown(buttonId) {
    return this._buttons[buttonId];
  }
  isButtonTriggered(buttonId) {
    return this._buttons[buttonId] && !this._buttonsPrev[buttonId];
  }
  updatePrev(keyCode) {
    this._buttonsPrev = { ...this._buttons };
  }
  _onKeyDownOrUp(code, isDown) {
    if (code === "ArrowLeft") {
      this._buttons["KEY_LEFT"] = isDown;
    } else if (code === "ArrowRight") {
      this._buttons["KEY_RIGHT"] = isDown;
    } else if (code === "KeyA") {
      this._buttons["KEY_A"] = isDown;
    } else if (code === "KeyD") {
      this._buttons["KEY_D"] = isDown;
    } else if (code === "KeyW") {
      this._buttons["KEY_W"] = isDown;
    } else if (code === "KeyS") {
      this._buttons["KEY_S"] = isDown;
    } else if (code === "ShiftRight") {
      this._buttons["KEY_SHIFT_RIGHT"] = isDown;
    }
  }
  _onKeyDown(event) {
    this._onKeyDownOrUp(event.code, true);
  };
  _onKeyUp(event) {
    this._onKeyDownOrUp(event.code, false);
  };
}

export default Controller;

