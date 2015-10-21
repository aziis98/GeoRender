var Graphics;

Graphics = (function() {
  function Graphics(ctx1) {
    this.ctx = ctx1;
  }

  Graphics.prototype.setColor = function(color) {
    ctx.fillStyle = color;
    return ctx.strokeStyle = color;
  };

  Graphics.prototype.setLineWidth = function(linewidth) {
    return ctx.lineWidth = linewidth;
  };

  Graphics.prototype.setFont = function(fontdef) {
    return ctx.font = fontdef;
  };

  Graphics.prototype.drawArc = function(x, y, r, sAngle, eAngle) {
    ctx.beginPath();
    ctx.arc(x, y, r, sAngle, eAngle, true);
    return ctx.stroke();
  };

  Graphics.prototype.fillArc = function(x, y, r, sAngle, eAngle) {
    ctx.beginPath();
    ctx.arc(x, y, r, sAngle, eAngle, true);
    return ctx.fill();
  };

  Graphics.prototype.drawCircle = function(x, y, r) {
    return this.drawArc(x, y, r, 0, 2 * Math.PI);
  };

  Graphics.prototype.fillCircle = function(x, y, r) {
    return this.fillArc(x, y, r, 0, 2 * Math.PI);
  };

  Graphics.prototype.drawRect = function(x, y, width, height) {
    return ctx.strokeRect(x, y, width, height);
  };

  Graphics.prototype.fillRect = function(x, y, width, height) {
    return ctx.fillRect(x, y, width, height);
  };

  Graphics.prototype.drawText = function(x, y, text) {
    return ctx.fillText(text, x, y);
  };

  Graphics.prototype.drawLine = function(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    return ctx.stroke();
  };

  Graphics.prototype.drawPoly = function(ptlist) {
    var i, len, pt;
    ctx.beginPath();
    ctx.moveTo(ptlist[0].x, ptlist[0].y);
    for (i = 0, len = ptlist.length; i < len; i++) {
      pt = ptlist[i];
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();
    return ctx.stroke();
  };

  Graphics.prototype.fillPoly = function(ptlist) {
    var i, len, pt;
    ctx.beginPath();
    ctx.moveTo(ptlist[0].x, ptlist[0].y);
    for (i = 0, len = ptlist.length; i < len; i++) {
      pt = ptlist[i];
      ctx.lineTo(pt.x, pt.y);
    }
    ctx.closePath();
    return ctx.fill();
  };

  return Graphics;

})();

exports.createFromCanvas = function(canvasId) {
  return new Graphics(document.getElementById(canvasId).getContext('2d'));
};
