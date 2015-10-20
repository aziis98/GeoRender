var $, angular, geoRender;

angular = require('angular');

$ = require('jquery');

$(function() {
  $('body').on('selectstart', false);
});

geoRender = angular.module('geoRender', []);

geoRender.controller('mainController', function($scope) {
  $scope.groups = [
    {
      id: 'points',
      img: 'point.png'
    }, {
      id: 'lines',
      img: 'line.png'
    }
  ];
  $scope.setMenu = function(group) {
    return $scope.menu.current = $scope.menu.list[group];
  };
  return $scope.menu = {
    shown: true,
    current: [],
    list: {
      'points': [
        {
          label: 'Point',
          info: 'Draw point',
          img: 'point.png'
        }, {
          label: 'Centroid',
          info: 'The centroid of a set of points',
          img: 'point.png'
        }
      ],
      'lines': [
        {
          label: 'Line',
          info: 'Draw a line from two points',
          img: 'line.png'
        }
      ]
    }
  };
});
