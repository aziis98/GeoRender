var $, Graphics, Menu, MenuItem, PLine, PPlane, PPoint, Two, angular, geoRender, geometrics, ipc, mouse, ngAnimate, remote, toolHandlers, translation;

remote = require('remote');

Menu = remote.require('menu');

MenuItem = remote.require('menu-item');

ipc = require('ipc');

angular = require('angular');

ngAnimate = require('angular-animate');

Graphics = require('./out/graphics.js');

geometrics = require('./out/geometrics.js');

PPlane = geometrics.PPlane;

PPoint = geometrics.PPoint;

PLine = geometrics.PLine;

$ = require('jquery');

Two = require('twojs-browserify');

toolHandlers = require('./out/application/toolHandler.js');

mouse = {
  x: 0,
  y: 0,
  button: 0
};

translation = {
  x: 0,
  y: 0
};

geoRender = angular.module('geoRender', [ngAnimate]);

geoRender.controller('mainCtrl', [
  '$rootScope', function($scope) {
    console.log('Loading Main...');
    $scope.plane = new PPlane;
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
        return $scope.toolstate = toolHandlers[$scope.toolstate].handler(toolHandlers._nearest);
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
    $scope.actionCancel = function() {
      return $scope.toolstate = 'none';
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
            label: 'Line Intersection',
            info: 'Create a point at the intersection of two lines',
            img: 'point.png',
            toolstate: 'line-intersection:1'
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
            toolstate: 'line:1'
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
        var np;
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        mouse.x = Math.min(e.pageX, canvas.width - 300);
        mouse.y = e.pageY;
        mouse.button = e.which;
        if (toolHandlers._nearest) {
          np = toolHandlers._nearest.filter(function(p) {
            return p.isUndependant();
          });
          if (mouse.button === 3 && np[0]._dist <= 7) {
            np[0].x += mouse.x - mouse.px;
            np[0].y += mouse.y - mouse.py;
          }
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
        var g, i, len, primitive, ref;
        $scope.primitivelist = $scope.plane.primitives;
        canvas = $('#geomcanvas')[0];
        g = Graphics.createFromCanvas(canvas, {
          width: canvas.width,
          height: canvas.height
        });
        g.ctx.clearRect(0, 0, canvas.width, canvas.height);
        toolHandlers._nearest = $scope.plane.getClosestTo(mouse.x - translation.x, mouse.y - translation.y);
        g.translate(translation.x, translation.y);
        $scope.plane.render(g);
        ref = $scope.plane.primitives.slice().sort(function(a, b) {
          return a.typename.localeCompare(b.typename);
        });
        for (i = 0, len = ref.length; i < len; i++) {
          primitive = ref[i];
          if (toolHandlers[$scope.toolstate].doHighLight(primitive) || primitive.selected) {
            primitive.highLight(g);
          }
        }
        g.translate(-translation.x, -translation.y);
        if ($scope.toolstate !== 'none') {
          g.setColor('#000000');
          g.drawLine(mouse.x - 10, mouse.y, mouse.x + 10, mouse.y);
          return g.drawLine(mouse.x, mouse.y - 10, mouse.x, mouse.y + 10);
        }
      };
      return setInterval(render, 1000 / 25);
    });
  }
]);
