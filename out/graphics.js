var Graphics;

Graphics = (function() {
  function Graphics(ctx) {
    this.ctx = ctx;
  }

  Graphics.prototype.setColor = function(color) {
    this.ctx.fillStyle = color;
    return this.ctx.strokeStyle = color;
  };

  Graphics.prototype.setLineWidth = function(linewidth) {
    return this.ctx.lineWidth = linewidth;
  };

  Graphics.prototype.setFont = function(fontdef) {
    return this.ctx.font = fontdef;
  };

  Graphics.prototype.drawArc = function(x, y, r, sAngle, eAngle) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, sAngle, eAngle, true);
    return this.ctx.stroke();
  };

  Graphics.prototype.fillArc = function(x, y, r, sAngle, eAngle) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, r, sAngle, eAngle, true);
    return this.ctx.fill();
  };

  Graphics.prototype.drawCircle = function(x, y, r) {
    return this.drawArc(x, y, r, 0, 2 * Math.PI);
  };

  Graphics.prototype.fillCircle = function(x, y, r) {
    return this.fillArc(x, y, r, 0, 2 * Math.PI);
  };

  Graphics.prototype.drawRect = function(x, y, width, height) {
    return this.ctx.strokeRect(x, y, width, height);
  };

  Graphics.prototype.fillRect = function(x, y, width, height) {
    return this.ctx.fillRect(x, y, width, height);
  };

  Graphics.prototype.drawText = function(x, y, text) {
    return this.ctx.fillText(text, x, y);
  };

  Graphics.prototype.drawLine = function(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    return this.ctx.stroke();
  };

  Graphics.prototype.drawPoly = function(ptlist) {
    var i, len, pt;
    this.ctx.beginPath();
    this.ctx.moveTo(ptlist[0].x, ptlist[0].y);
    for (i = 0, len = ptlist.length; i < len; i++) {
      pt = ptlist[i];
      this.ctx.lineTo(pt.x, pt.y);
    }
    this.ctx.closePath();
    return this.ctx.stroke();
  };

  Graphics.prototype.fillPoly = function(ptlist) {
    var i, len, pt;
    this.ctx.beginPath();
    this.ctx.moveTo(ptlist[0].x, ptlist[0].y);
    for (i = 0, len = ptlist.length; i < len; i++) {
      pt = ptlist[i];
      this.ctx.lineTo(pt.x, pt.y);
    }
    this.ctx.closePath();
    return this.ctx.fill();
  };

  return Graphics;

})();

exports.createFromCanvas = function(canvas) {
  return new Graphics(canvas.getContext('2d'));
};
