
remote = require 'remote'
angular = require 'angular'
$ = require 'jquery'
Two = require 'twojs-browserify'

Menu = remote.require 'menu'
MenuItem = remote.require 'menu-item'

# --------------- jquery init ---------------
$ ->
    $('body').on 'selectstart', false

# -------------------------------------------

ngAnimate = require 'angular-animate'

geoRender = angular.module 'geoRender', [ ngAnimate ]

geoRender.controller 'mainController', ($scope) ->

    template = [
        {
            label: 'File'
            submenu: [
                {
                    label: 'New Canvas'
                    click: ->
                        console.log 'Created new canvas'
                }
            ]
        }
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload'
                    accelerator: 'CmdOrCtrl+R'
                    click: (item, focusedWindow) ->
                        if (focusedWindow)
                            focusedWindow.reload()
                }
                {
                    label: 'Toggle Full Screen'
                    accelerator: ( ->
                        if (process.platform == 'darwin')
                            return 'Ctrl+Command+F'
                        else
                            return 'F11'
                            )()
                    click: (item, focusedWindow) ->
                        if (focusedWindow)
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: ( ->
                        if (process.platform == 'darwin')
                            return 'Alt+Command+I'
                        else
                            return 'Ctrl+Shift+I'
                            )()
                    click: (item, focusedWindow) ->
                        if (focusedWindow)
                            focusedWindow.toggleDevTools()
                }
            ]
        }
    ]

    Menu.setApplicationMenu Menu.buildFromTemplate template

    $scope.groups = [
        {
            id: 'points'
            img: 'point.png'
        }
        {
            id: 'lines'
            img: 'line.png'
        }
        {
            id: 'circles'
            img: 'circle.png'
        }
        {
            id: 'arcs'
            img: 'arc.png'
        }
        {
            id: 'polygons'
            img: 'poly.png'
        }
    ]

    $scope.setMenu = (group) ->
        if $scope.menu.currentGroup == group
            $scope.menu.currentGroup = 'none'
            $scope.menu.current = []
        else
            $scope.menu.currentGroup = group
            $scope.menu.current = $scope.menu.list[group]

    $scope.setInfo = (infotext) ->
        $scope.informator = infotext


    $scope.informator = ''

    $scope.menu = {
        currentGroup: 'none'

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
                    info: 'Create a point at the center of a set of points'
                    img: 'point.png'
                }
            ]
            'lines': [
                {
                    label: 'Line'
                    info: 'Create a line from two points'
                    img: 'line.png'
                }
                {
                    label: 'Parallel'
                    info: 'Create a line parallel to another one passing throught a point'
                    img: 'line.png'
                }
                {
                    label: 'Perpendicular'
                    info: 'Create a line cprpendicular to another one passing throught a point'
                    img: 'line.png'
                }
            ]
            'circles': [
                {
                    label: 'Circle'
                    info: 'Create a circle by the center and a point on the circumference'
                    img: 'circle.png'
                }
                {
                    label: 'Orthocenter'
                    info: 'Create a circle from three points'
                    img: 'circle.png'
                }
            ]
            'arcs': [
                {
                    label: 'Arc'
                    info: 'Create an Arc from circle'
                    img: 'arc.png'
                }
            ]
            'polygons': [
                {
                    label: 'Polygon'
                    info: 'Create a polygon from a set of points'
                    img: 'poly.png'
                }
            ]
    }























    #
