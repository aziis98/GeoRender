var PLine, PPlane, PPoint, geometrics, onLines, onPoints;

geometrics = require('../geometrics.js');

PPlane = geometrics.PPlane;

PPoint = geometrics.PPoint;

PLine = geometrics.PLine;

onPoints = function(p) {
  return p.typename === 'PPoint' && p._dist <= 7;
};

onLines = function(p) {
  return p.typename === 'PLine' && p._dist <= 2;
};

module.exports = {
  'none': {
    doHighLight: function(primitive) {
      return (primitive._dist <= 7 && primitive.typename === 'PPoint') || (primitive._dist <= 2 && primitive.typename === 'PLine');
    }
  },
  'point': {
    handler: function(nearests) {
      plane.addPrimitive(new PPoint(mouse.x - translation.x, mouse.y - translation.y));
      return 'none';
    },
    doHighLight: function(p) {
      return false;
    },
    complete: function() {
      return 'none';
    }
  },
  'point-centroid': {
    handler: function(nearests) {
      var npts;
      npts = nearests.filter(function(p) {
        return p.typename === 'PPoint';
      });
      if (npts[0]._dist <= 7) {
        toolHandlers._centroidbuff.push(npts[0]);
      }
      return 'point-centroid';
    },
    doHighLight: onPoints,
    complete: function() {
      plane.addPrimitive(PPoint.getCentroid(toolHandlers._centroidbuff));
      toolHandlers._centroidbuff = [];
      return 'none';
    }
  },
  'line:1': {
    handler: function(nearests) {
      var npts;
      npts = nearests.filter(function(p) {
        return p.typename === 'PPoint';
      });
      if (npts[0]._dist <= 7) {
        toolHandlers._linebuff = npts[0];
        return 'line:2';
      }
      return 'line:1';
    },
    doHighLight: onPoints
  },
  'line:2': {
    handler: function(nearests) {
      var npts;
      npts = nearests.filter(function(p) {
        return p.typename === 'PPoint';
      });
      if (npts[0]._dist <= 7) {
        plane.addPrimitive(new PLine(toolHandlers._linebuff, npts[0]));
        return 'none';
      }
      return 'line:2';
    },
    doHighLight: onPoints
  },
  'line-perpendicular:line': {
    handler: function(nearests) {
      var npts;
      npts = nearests.filter(function(p) {
        return p.typename === 'PLine';
      });
      if (npts[0]._dist <= 2) {
        toolHandlers._linebuff = npts[0];
        return 'line-perpendicular:point';
      }
      return 'line-perpendicular:line';
    },
    doHighLight: onLines
  },
  'line-perpendicular:point': {
    handler: function(nearests) {
      var npts;
      npts = nearests.filter(function(p) {
        return p.typename === 'PPoint';
      });
      if (npts[0]._dist <= 7) {
        plane.addPrimitive(PLine.getPerpendicular(toolHandlers._linebuff, npts[0]));
        return 'none';
      }
      return 'line-perpendicular:point';
    },
    doHighLight: onPoints
  },
  'line-intersection:1': {
    handler: function(nearests) {
      var npts;
      npts = nearests.filter(function(p) {
        return p.typename === 'PLine';
      });
      if (npts[0]._dist <= 2) {
        toolHandlers._linebuff = npts[0];
        return 'line-intersection:2';
      }
      return 'line-intersection:1';
    },
    doHighLight: onLines
  },
  'line-intersection:2': {
    handler: function(nearests) {
      var npts;
      npts = nearests.filter(function(p) {
        return p.typename === 'PLine';
      });
      if (npts[0]._dist <= 2) {
        plane.addPrimitive(PLine.getIntersection(toolHandlers._linebuff, npts[0]));
        return 'none';
      }
      return 'line-intersection:2';
    },
    doHighLight: onLines
  },
  _centroidbuff: []
};
