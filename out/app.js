var $, GeoPlane, Graphics, Menu, MenuItem, PPoint, Two, angular, geoRender, geometrics, ipc, ngAnimate, plane, remote, render;

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

geoRender = angular.module('geoRender', [ngAnimate]);

geoRender.controller('mainController', function($scope) {
  var template;
  template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Canvas',
          click: function() {}
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
  $scope.informator = '';
  return $scope.menu = {
    currentGroup: 'none',
    current: [],
    list: {
      'points': [
        {
          label: 'Point',
          info: 'Draw point',
          img: 'point.png'
        }, {
          label: 'Centroid',
          info: 'Create a point at the center of a set of points',
          img: 'point.png'
        }
      ],
      'lines': [
        {
          label: 'Line',
          info: 'Create a line from two points',
          img: 'line.png'
        }, {
          label: 'Parallel',
          info: 'Create a line parallel to another one passing throught a point',
          img: 'line.png'
        }, {
          label: 'Perpendicular',
          info: 'Create a line cprpendicular to another one passing throught a point',
          img: 'line.png'
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
});

$(function() {
  return $('body').on('selectstart', false);
});

render = function() {
  var g;
  g = Graphics.createFromCanvas('geomcanvas');
  return plane.render(g);
};

setInterval(render, 1000 / 25);
