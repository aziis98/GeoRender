# Electron
remote = require 'remote'
Menu = remote.require 'menu'
MenuItem = remote.require 'menu-item'
ipc = require 'ipc'

# Angular
angular = require 'angular'
ngAnimate = require 'angular-animate'

# Geometrics
Graphics = require './out/graphics.js'
geometrics = require './out/geometrics.js'
GeoPlane = geometrics.GeoPlane
PPoint = geometrics.PPoint

# Others
$ = require 'jquery'
Two = require 'twojs-browserify'





plane = new GeoPlane

mouse = {
    x: 0
    y: 0
    button: 0
}
translation = {
    x: 0
    y: 0
}

toolHandlers =
    'none':
        doHighLight: (primitive) -> primitive instanceof PPoint and primitive._dist <= 7
    'point':
        handler: ->
            plane.addPrimitive new PPoint(mouse.x - translation.x, mouse.y - translation.y)
            return 'none'
        doHighLight: (primitive) -> false
        complete: ->
            return 'none'
    'point-centroid':
        handler: ->
            if toolHandlers._nearest._dist <= 7
                toolHandlers._centroidbuff.push toolHandlers._nearest
            return 'point-centroid'
        doHighLight: (primitive) -> primitive instanceof PPoint and primitive._dist <= 7
        complete: ->
            plane.addPrimitive PPoint.getCentroid toolHandlers._centroidbuff
            toolHandlers._centroidbuff = []
            return 'none'

    # Buffer Variables
    _centroidbuff: []


geoRender = angular.module 'geoRender', [ ngAnimate ]
geoRender.controller 'mainController', ($scope) ->

    template = [
        {
            label: 'File'
            submenu: [
                {
                    label: 'New Canvas'
                    click: ->
                        plane.primitives = []
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


    $scope.bodyClick = ->
        if $scope.toolstate != 'none' and mouse.x > 150 and mouse.y < $(document).height() - 25
            $scope.toolstate = toolHandlers[$scope.toolstate].handler()

    $scope.setMenu = (group) ->
        if $scope.menu.currentGroup == group
            $scope.menu.currentGroup = 'none'
            $scope.menu.current = []
        else
            $scope.menu.currentGroup = group
            $scope.menu.current = $scope.menu.list[group]

    $scope.setInfo = (infotext) ->
        $scope.informator = infotext

    $scope.setTool = (stateid) ->
        $scope.toolstate = stateid

    $scope.actionComplete = ->
        $scope.toolstate = toolHandlers[$scope.toolstate].complete()

    $scope.primitivelist = []
    $scope.informator = ''
    $scope.showcomplete = false
    $scope.toolstate = 'none'

    $scope.menu = {
        currentGroup: 'none'

        current: []

        list:
            'points': [
                {
                    label: 'Point'
                    info: 'Draw point'
                    img: 'point.png'
                    toolstate: 'point'
                }
                {
                    label: 'Centroid'
                    info: 'Create a point at the center of a set of points'
                    img: 'point.png'
                    toolstate: 'point-centroid'
                }
            ]
            'lines': [
                {
                    label: 'Line'
                    info: 'Create a line from two points'
                    img: 'line.png'
                    toolstate: 'line:A'
                }
                {
                    label: 'Parallel'
                    info: 'Create a line parallel to another one passing throught a point'
                    img: 'line.png'
                    toolstate: 'line-parallel:line'
                }
                {
                    label: 'Perpendicular'
                    info: 'Create a line cprpendicular to another one passing throught a point'
                    img: 'line.png'
                    toolstate: 'line-perpendicular:line'
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

    $ ->
        canvas = $('#geomcanvas')[0]
        canvas.width = $(document).width()
        canvas.height = $(document).height()

        $('body').on 'selectstart', false

        $('body').mousemove (e) ->
            mouse.px = mouse.x
            mouse.py = mouse.y
            mouse.x = e.pageX
            mouse.y = e.pageY
            mouse.button = e.which

            if mouse.button == 3 and toolHandlers._nearest._dist <= 7 and toolHandlers._nearest.isUndependant()
                toolHandlers._nearest.x += mouse.x - mouse.px
                toolHandlers._nearest.y += mouse.y - mouse.py

            if mouse.button == 2
                translation.x += mouse.x - mouse.px
                translation.y += mouse.y - mouse.py


        $(window).resize ->
            canvas = $('#geomcanvas')[0]
            canvas.width = $(document).width()
            canvas.height = $(document).height()

        render = ->
            $scope.primitivelist = plane.primitives

            canvas = $('#geomcanvas')[0]
            g = Graphics.createFromCanvas canvas

            g.ctx.clearRect(0, 0, canvas.width, canvas.height)

            g.ctx.translate(translation.x, translation.y)
            plane.render(g)
            g.ctx.translate(-translation.x, -translation.y)

            toolHandlers._nearest = plane.getClosestTo(mouse.x - translation.x, mouse.y - translation.y)
            if toolHandlers[$scope.toolstate].doHighLight(toolHandlers._nearest)
                g.ctx.translate(translation.x, translation.y)
                toolHandlers._nearest.highLight(g)
                g.ctx.translate(-translation.x, -translation.y)

            if $scope.toolstate != 'none'
                g.setColor('#000000')
                g.drawLine(mouse.x - 10, mouse.y, mouse.x + 10, mouse.y)
                g.drawLine(mouse.x, mouse.y - 10, mouse.x, mouse.y + 10)

        setInterval(render, 1000 / 25)















































    #
