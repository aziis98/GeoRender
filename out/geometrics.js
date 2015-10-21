var GeoPlane, PPoint;

GeoPlane = (function() {
  function GeoPlane() {
    this.primitives = [];
  }

  GeoPlane.prototype.render = function(g) {
    var i, len, primitive, ref;
    ref = this.primitives;
    for (i = 0, len = ref.length; i < len; i++) {
      primitive = ref[i];
      primitive.render(g);
    }
  };

  GeoPlane.prototype.addPrimitive = function(primitive) {
    return this.primitives.push(primitive);
  };

  GeoPlane.prototype.getClosestTo = function(x, y) {
    var bf, i, len, primitive;
    bf = this.primitives.slice();
    for (i = 0, len = bf.length; i < len; i++) {
      primitive = bf[i];
      primitive._dist = primitive.distance(x, y);
    }
    bf.sort(function(a, b) {
      return a._dist - b._dist;
    });
    return bf[0];
  };

  return GeoPlane;

})();

PPoint = (function() {
  function PPoint(x1, y1) {
    this.x = x1;
    this.y = y1;
    this.typename = 'PPoint';
  }

  PPoint.prototype.render = function(g) {
    g.setColor('#000000');
    g.drawCircle(this.getX(), this.getY(), 5);
    return g.fillCircle(this.getX(), this.getY(), 3);
  };

  PPoint.prototype.highLight = function(g) {
    g.setColor('#ff4000');
    return g.drawCircle(this.getX(), this.getY(), 7);
  };

  PPoint.prototype.getX = function() {
    var ref;
    return (ref = typeof this.x === "function" ? this.x() : void 0) != null ? ref : this.x;
  };

  PPoint.prototype.getY = function() {
    var ref;
    return (ref = typeof this.y === "function" ? this.y() : void 0) != null ? ref : this.y;
  };

  PPoint.prototype.isUndependant = function() {
    return typeof this.x !== 'function';
  };

  PPoint.prototype.distance = function(x, y) {
    var dx, dy;
    dx = x - this.getX();
    dy = y - this.getY();
    return Math.sqrt(dx * dx + dy * dy);
  };

  PPoint.getCentroid = function(ptlist) {
    return new PPoint((function() {
      var i, len, pt, rx;
      rx = 0;
      for (i = 0, len = ptlist.length; i < len; i++) {
        pt = ptlist[i];
        rx += pt.getX();
      }
      return rx / ptlist.length;
    }), (function() {
      var i, len, pt, ry;
      ry = 0;
      for (i = 0, len = ptlist.length; i < len; i++) {
        pt = ptlist[i];
        ry += pt.getY();
      }
      return ry / ptlist.length;
    }));
  };

  return PPoint;

})();

exports.GeoPlane = GeoPlane;

exports.PPoint = PPoint;
