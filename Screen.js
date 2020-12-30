import Vector2 from "./Vector2.js"
import charImageDatas from "./charImageDatas.js"

class Screen {
  static get WIDTH() {
    return 256;
  }
  static get HEIGHT() {
    return 256;
  }
  constructor() {
    this._elm = document.createElement('canvas');
    this._elm.width = Screen.WIDTH;
    this._elm.height = Screen.HEIGHT;
    this._elm.className = 'screen';
    this._elm.style.border = '1px solid #444';
    this._elm.style.imageRendering = 'pixelated';
    this._elm.style.width = `${this._elm.width * 2}px`;
    this._elm.style.height = `${this._elm.height * 2}px`;
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.appendChild(this._elm);
  }
  clientToScreen(pos) {
    const borderWidth = 1;
    const scale = 2;
    const clientRect = this._elm.getBoundingClientRect();
    return new Vector2(
      Math.round((pos.x - (clientRect.x + borderWidth)) / scale),
      Math.round((pos.y - (clientRect.y + borderWidth)) / scale)
    );
  }
  beginFrame() {
    const ctx = this._elm.getContext('2d');
    this._imageData = ctx.getImageData(0, 0, Screen.WIDTH, Screen.HEIGHT);
    this.clear();
  }
  endFrame() {
    const ctx = this._elm.getContext('2d');
    ctx.putImageData(this._imageData, 0, 0);
  }
  clear() {
    for (let i = 0; i < 256 * 256; ++i) {
      this._imageData.data[4 * i + 0] = 0;
      this._imageData.data[4 * i + 1] = 0;
      this._imageData.data[4 * i + 2] = 0;
      this._imageData.data[4 * i + 3] = 255;
    }
  }
  drawPixel(x, y, color) {
    const i = Screen.WIDTH * y + x;
    this._imageData.data[4 * i + 0] = color[0];
    this._imageData.data[4 * i + 1] = color[1];
    this._imageData.data[4 * i + 2] = color[2];
  }
  drawSquare(pos, width, color) {
    const hw = width / 2;
    let xs = Math.round(pos.x - hw);
    let xe = Math.round(pos.x + hw);
    let ys = Math.round(pos.y - hw);
    let ye = Math.round(pos.y + hw);
    if (xe < 0 || xs >= Screen.WIDTH || ye < 0 || ys >= Screen.HEIGHT) {
      return;
    }
    xs = Math.max(xs, 0);
    xe = Math.min(xe, Screen.WIDTH - 1);
    ys = Math.max(ys, 0);
    ye = Math.min(ye, Screen.HEIGHT - 1);
    for (let y = ys; y <= ye; ++y) {
      for (let x = xs; x <= xe; ++x) {
        const i = Screen.WIDTH * y + x;
        this._imageData.data[4 * i + 0] = color[0];
        this._imageData.data[4 * i + 1] = color[1];
        this._imageData.data[4 * i + 2] = color[2];
      }
    }
  }
  drawCircle(pos, radius, color) {
    const cx = Math.round(pos.x);
    const cy = Math.round(pos.y);
    const r = Math.round(radius);
    let ys = cy - r;
    let ye = cy + r;
    if (ye < 0 || ys >= Screen.HEIGHT) {
      return;
    }
    ys = Math.max(ys, 0);
    ye = Math.min(ye, Screen.HEIGHT);
    for (let y = ys; y < ye; ++y) {
      const hx = Math.round(Math.sqrt(r * r - (y + 0.5 - cy) * (y  + 0.5 - cy)));
      let xs = cx - hx;
      let xe = cx + hx;
      if (xe < 0 || xs >= Screen.WIDTH) {
        continue;
      }
      xs = Math.max(xs, 0);
      xe = Math.min(xe, Screen.WIDTH);
      for (let x = xs; x < xe; ++x) {
        const i = Screen.WIDTH * y + x;
        this._imageData.data[4 * i + 0] = color[0];
        this._imageData.data[4 * i + 1] = color[1];
        this._imageData.data[4 * i + 2] = color[2];
      }
    }
  }
  drawText(pos, text, color) {
    Array.from(text).forEach(
      (ch, i) => this.drawChar(new Vector2(pos.x + 8 * i, pos.y), ch, color)
    );
  }
  drawChar(pos, ch, color) {
    let xs = Math.floor(pos.x);
    let xe = xs + 8;
    let ys = Math.floor(pos.y);
    let ye = ys + 8;
    if (xe < 0 || xs >= Screen.WIDTH || ye < 0 || ys >= Screen.HEIGHT) {
      return;
    }
    let sxs = Math.max(0, -xs);
    let sys = Math.max(0, -ys);
    xs = Math.max(xs, 0);
    xe = Math.min(xe, Screen.WIDTH);
    ys = Math.max(ys, 0);
    ye = Math.min(ye, Screen.HEIGHT);
    const charImageData = charImageDatas[ch];
    for (let y = ys, sy = sys; y < ye; ++y, ++sy) {
      for (let x = xs, sx = sxs; x < xe; ++x, ++sx) {
        const i = Screen.WIDTH * y + x;
        if (charImageData[sy][sx] === ' ') {
          continue;
        }
        this._imageData.data[4 * i + 0] = color[0];
        this._imageData.data[4 * i + 1] = color[1];
        this._imageData.data[4 * i + 2] = color[2];
      }
    }
  }
}

export default Screen;
