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
PPlane = geometrics.GeoPlane
PPoint = geometrics.PPoint
PLine = geometrics.PLine

# Others
$ = require 'jquery'
Two = require 'twojs-browserify'

# Fragmentation
toolHandlers = require './out/application/toolHandler.js'




plane = new PPlane

mouse = {
    x: 0
    y: 0
    button: 0
}
translation = {
    x: 0
    y: 0
}


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
            $scope.toolstate = toolHandlers[$scope.toolstate].handler(toolHandlers._nearest)

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

    $scope.actionCancel = ->
        $scope.toolstate = 'none'

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
                    label: 'Line Intersection'
                    info: 'Create a point at the intersection of two lines'
                    img: 'point.png'
                    toolstate: 'line-intersection:1'
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
                    toolstate: 'line:1'
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
            mouse.x = Math.min(e.pageX, canvas.width - 300)
            mouse.y = e.pageY
            mouse.button = e.which

            if toolHandlers._nearest
                np = toolHandlers._nearest.filter((p) -> p.isUndependant())

                if mouse.button == 3 and np[0]._dist <= 7
                    np[0].x += mouse.x - mouse.px
                    np[0].y += mouse.y - mouse.py

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
            g = Graphics.createFromCanvas canvas, {width: canvas.width, height: canvas.height}

            g.ctx.clearRect(0, 0, canvas.width, canvas.height)

            toolHandlers._nearest = plane.getClosestTo(mouse.x - translation.x, mouse.y - translation.y)
            g.translate(translation.x, translation.y)
            plane.render g
            for primitive in plane.primitives.slice().sort((a, b) -> a.typename.localeCompare(b.typename))
                if toolHandlers[$scope.toolstate].doHighLight(primitive) or primitive.selected
                    primitive.highLight g
            g.translate(-translation.x, -translation.y)


            if $scope.toolstate != 'none'
                g.setColor('#000000')
                g.drawLine(mouse.x - 10, mouse.y, mouse.x + 10, mouse.y)
                g.drawLine(mouse.x, mouse.y - 10, mouse.x, mouse.y + 10)

        setInterval(render, 1000 / 25)















































    #
