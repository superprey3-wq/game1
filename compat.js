// Compatibility helpers for older Android WebViews / mobile browsers.
// game-v8 uses CanvasRenderingContext2D.roundRect; some browsers do not provide it.
if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii = 0) {
    const r0 = Array.isArray(radii) ? Number(radii[0] || 0) : Number(radii || 0);
    const r = Math.max(0, Math.min(Math.abs(w) / 2, Math.abs(h) / 2, r0));
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    this.closePath();
    return this;
  };
}
