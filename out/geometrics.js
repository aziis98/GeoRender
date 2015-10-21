var GeoPlane, PPoint;

GeoPlane = (function() {
  function GeoPlane() {
    this.primitives = [];
  }

  GeoPlane.prototype.render = function(g) {
    var j, len, primitive, ref, results;
    ref = this.primitives;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      primitive = ref[j];
      results.push(primitive.render(g));
    }
    return results;
  };

  GeoPlane.prototype.addPrimitive = function(primitive) {
    return this.primitives.push(primitive);
  };

  GeoPlane.prototype.getClosestTo = function(x, y) {
    var j, len, primitive, ref;
    ref = this.primitives;
    for (j = 0, len = ref.length; j < len; j++) {
      primitive = ref[j];
      primitive._dist = primitive.distance(x, y);
    }
    this.primitives.sort(function(a, b) {
      return a._dist - b._dist;
    });
    return this.primitives[0];
  };

  return GeoPlane;

})();

PPoint = (function() {
  function PPoint(x1, y1) {
    this.x = x1;
    this.y = y1;
  }

  PPoint.prototype.render = function(g) {
    g.setColor('#000000');
    g.drawCircle(this.getX, this.getY, 7);
    return g.fillCircle(this.getX, this.getY, 5);
  };

  PPoint.prototype.getX = function() {
    var ref;
    return (ref = typeof x === "function" ? x() : void 0) != null ? ref : x;
  };

  PPoint.prototype.getY = function() {
    var ref;
    return (ref = typeof y === "function" ? y() : void 0) != null ? ref : y;
  };

  PPoint.prototype.distance = function(x, y) {
    var dx, dy;
    dx = x - this.getX();
    dy = y - this.getY();
    return Math.sqrt(dx * dx + dy * dy);
  };

  PPoint.getCentroid = function(ptlist) {
    var i, j, ref, sx, sy;
    sx = ptlist[0].x;
    sy = ptlist[0].y;
    for (i = j = 1, ref = ptlist.length; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      sx = function() {
        var base, ref1, ref2;
        return ((ref1 = typeof sx === "function" ? sx() : void 0) != null ? ref1 : sx) + ((ref2 = typeof (base = ptlist[i]).x === "function" ? base.x() : void 0) != null ? ref2 : ptlist[i].x);
      };
      sy = function() {
        var base, ref1, ref2;
        return ((ref1 = typeof sy === "function" ? sy() : void 0) != null ? ref1 : sy) + ((ref2 = typeof (base = ptlist[i]).y === "function" ? base.y() : void 0) != null ? ref2 : ptlist[i].y);
      };
    }
    return new PPoint((function() {
      return sx / ptlist.length;
    }), (function() {
      return sy / ptlist.length;
    }));
  };

  return PPoint;

})();

exports.GeoPlane = GeoPlane;

exports.PPoint = PPoint;
