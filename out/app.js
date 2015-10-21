var $, GeoPlane, Graphics, Menu, MenuItem, PPoint, Two, angular, geoRender, geometrics, ipc, mouse, ngAnimate, plane, remote, toolHandlers, translation;

remote = require('remote');

Menu = remote.require('menu');

MenuItem = remote.require('menu-item');

ipc = require('ipc');

angular = require('angular');

ngAnimate = require('angular-animate');

Graphics = require('./out/graphics.js');

geometrics = require('./out/geometrics.js');

GeoPlane = geometrics.GeoPlane;

PPoint = geometrics.PPoint;

$ = require('jquery');

Two = require('twojs-browserify');

plane = new GeoPlane;

mouse = {
  x: 0,
  y: 0,
  button: 0
};

translation = {
  x: 0,
  y: 0
};

toolHandlers = {
  'none': {
    doHighLight: function(primitive) {
      return primitive instanceof PPoint && primitive._dist <= 7;
    }
  },
  'point': {
    handler: function() {
      plane.addPrimitive(new PPoint(mouse.x - translation.x, mouse.y - translation.y));
      return 'none';
    },
    doHighLight: function(primitive) {
      return false;
    },
    complete: function() {
      return 'none';
    }
  },
  'point-centroid': {
    handler: function() {
      if (toolHandlers._nearest._dist <= 7) {
        toolHandlers._centroidbuff.push(toolHandlers._nearest);
      }
      return 'point-centroid';
    },
    doHighLight: function(primitive) {
      return primitive instanceof PPoint && primitive._dist <= 7;
    },
    complete: function() {
      plane.addPrimitive(PPoint.getCentroid(toolHandlers._centroidbuff));
      toolHandlers._centroidbuff = [];
      return 'none';
    }
  },
  _centroidbuff: []
};

geoRender = angular.module('geoRender', [ngAnimate]);

geoRender.controller('mainController', function($scope) {
  var template;
  template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Canvas',
          click: function() {
            return plane.primitives = [];
          }
        }
      ]
    }, {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              return focusedWindow.reload();
            }
          }
        }, {
          label: 'Toggle Full Screen',
          accelerator: (function() {
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F';
            } else {
              return 'F11';
            }
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              return focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          }
        }, {
          label: 'Toggle Developer Tools',
          accelerator: (function() {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I';
            } else {
              return 'Ctrl+Shift+I';
            }
          })(),
          click: function(item, focusedWindow) {
            if (focusedWindow) {
              return focusedWindow.toggleDevTools();
            }
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  $scope.groups = [
    {
      id: 'points',
      img: 'point.png'
    }, {
      id: 'lines',
      img: 'line.png'
    }, {
      id: 'circles',
      img: 'circle.png'
    }, {
      id: 'arcs',
      img: 'arc.png'
    }, {
      id: 'polygons',
      img: 'poly.png'
    }
  ];
  $scope.bodyClick = function() {
    if ($scope.toolstate !== 'none' && mouse.x > 150 && mouse.y < $(document).height() - 25) {
      return $scope.toolstate = toolHandlers[$scope.toolstate].handler();
    }
  };
  $scope.setMenu = function(group) {
    if ($scope.menu.currentGroup === group) {
      $scope.menu.currentGroup = 'none';
      return $scope.menu.current = [];
    } else {
      $scope.menu.currentGroup = group;
      return $scope.menu.current = $scope.menu.list[group];
    }
  };
  $scope.setInfo = function(infotext) {
    return $scope.informator = infotext;
  };
  $scope.setTool = function(stateid) {
    return $scope.toolstate = stateid;
  };
  $scope.actionComplete = function() {
    return $scope.toolstate = toolHandlers[$scope.toolstate].complete();
  };
  $scope.primitivelist = [];
  $scope.informator = '';
  $scope.showcomplete = false;
  $scope.toolstate = 'none';
  $scope.menu = {
    currentGroup: 'none',
    current: [],
    list: {
      'points': [
        {
          label: 'Point',
          info: 'Draw point',
          img: 'point.png',
          toolstate: 'point'
        }, {
          label: 'Centroid',
          info: 'Create a point at the center of a set of points',
          img: 'point.png',
          toolstate: 'point-centroid'
        }
      ],
      'lines': [
        {
          label: 'Line',
          info: 'Create a line from two points',
          img: 'line.png',
          toolstate: 'line:A'
        }, {
          label: 'Parallel',
          info: 'Create a line parallel to another one passing throught a point',
          img: 'line.png',
          toolstate: 'line-parallel:line'
        }, {
          label: 'Perpendicular',
          info: 'Create a line cprpendicular to another one passing throught a point',
          img: 'line.png',
          toolstate: 'line-perpendicular:line'
        }
      ],
      'circles': [
        {
          label: 'Circle',
          info: 'Create a circle by the center and a point on the circumference',
          img: 'circle.png'
        }, {
          label: 'Orthocenter',
          info: 'Create a circle from three points',
          img: 'circle.png'
        }
      ],
      'arcs': [
        {
          label: 'Arc',
          info: 'Create an Arc from circle',
          img: 'arc.png'
        }
      ],
      'polygons': [
        {
          label: 'Polygon',
          info: 'Create a polygon from a set of points',
          img: 'poly.png'
        }
      ]
    }
  };
  return $(function() {
    var canvas, render;
    canvas = $('#geomcanvas')[0];
    canvas.width = $(document).width();
    canvas.height = $(document).height();
    $('body').on('selectstart', false);
    $('body').mousemove(function(e) {
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.pageX;
      mouse.y = e.pageY;
      mouse.button = e.which;
      if (mouse.button === 3 && toolHandlers._nearest._dist <= 7 && toolHandlers._nearest.isUndependant()) {
        toolHandlers._nearest.x += mouse.x - mouse.px;
        toolHandlers._nearest.y += mouse.y - mouse.py;
      }
      if (mouse.button === 2) {
        translation.x += mouse.x - mouse.px;
        return translation.y += mouse.y - mouse.py;
      }
    });
    $(window).resize(function() {
      canvas = $('#geomcanvas')[0];
      canvas.width = $(document).width();
      return canvas.height = $(document).height();
    });
    render = function() {
      var g;
      $scope.primitivelist = plane.primitives;
      canvas = $('#geomcanvas')[0];
      g = Graphics.createFromCanvas(canvas);
      g.ctx.clearRect(0, 0, canvas.width, canvas.height);
      g.ctx.translate(translation.x, translation.y);
      plane.render(g);
      g.ctx.translate(-translation.x, -translation.y);
      toolHandlers._nearest = plane.getClosestTo(mouse.x - translation.x, mouse.y - translation.y);
      if (toolHandlers[$scope.toolstate].doHighLight(toolHandlers._nearest)) {
        g.ctx.translate(translation.x, translation.y);
        toolHandlers._nearest.highLight(g);
        g.ctx.translate(-translation.x, -translation.y);
      }
      if ($scope.toolstate !== 'none') {
        g.setColor('#000000');
        g.drawLine(mouse.x - 10, mouse.y, mouse.x + 10, mouse.y);
        return g.drawLine(mouse.x, mouse.y - 10, mouse.x, mouse.y + 10);
      }
    };
    return setInterval(render, 1000 / 25);
  });
});
