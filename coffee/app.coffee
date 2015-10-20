
angular = require 'angular'
$ = require 'jquery'

# --------------- jquery init ---------------
$ ->
    $('body').on 'selectstart', false
    return

# -------------------------------------------

geoRender = angular.module 'geoRender', []

geoRender.controller 'mainController', ($scope) ->
    $scope.groups = [
        {
            id: 'points'
            img: 'point.png'
        }
        {
            id: 'lines'
            img: 'line.png'
        }
    ]

    $scope.setMenu = (group) ->
        $scope.menu.current = $scope.menu.list[group]



    $scope.menu = {
        shown: true

        current: []

        list:
            'points': [
                {
                    label: 'Point'
                    info: 'Draw point'
                    img: 'point.png'
                }
                {
                    label: 'Centroid'
                    info: 'The centroid of a set of points'
                    img: 'point.png'
                }
            ]
            'lines': [
                {
                    label: 'Line'
                    info: 'Draw a line from two points'
                    img: 'line.png'
                }
            ]
    }
