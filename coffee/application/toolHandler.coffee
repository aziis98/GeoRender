{PPlane, PPoint, PLine} = require './out/geometrics.js'

onPoints = (p) -> p.typename is 'PPoint' and p._dist <= 7

module.exports =
    'none':
        doHighLight: (primitive) ->
            return (primitive._dist <= 7 and primitive.typename is 'PPoint') or
                    (primitive._dist <= 2 and primitive.typename is 'PLine')

    'point':
        handler: (nearests) ->
            plane.addPrimitive new PPoint(mouse.x - translation.x, mouse.y - translation.y)
            return 'none'
        doHighLight: (p) -> false
        complete: ->
            return 'none'

    'point-centroid':
        handler: (nearests) ->
            npts = nearests.filter (p) -> p.typename is 'PPoint'
            if npts[0]._dist <= 7
                toolHandlers._centroidbuff.push npts[0]
            return 'point-centroid'
        doHighLight: onPoints
        complete: ->
            plane.addPrimitive PPoint.getCentroid toolHandlers._centroidbuff
            toolHandlers._centroidbuff = []
            return 'none'

    'line:1':
        handler: (nearests) ->
            npts = nearests.filter (p) -> p.typename is 'PPoint'
            if npts[0]._dist <= 7
                toolHandlers._linebuff = npts[0]
                return 'line:2'
            return 'line:1'
        doHighLight: onPoints

    'line:2':
        handler: (nearests) ->
            npts = nearests.filter (p) -> p.typename is 'PPoint'
            if npts[0]._dist <= 7
                plane.addPrimitive new PLine(toolHandlers._linebuff, npts[0])
                return 'none'
            return 'line:2'
        doHighLight: onPoints

    'line-perpendicular:line':
        handler: (nearests) ->
            npts = nearests.filter (p) -> p.typename is 'PLine'
            if npts[0]._dist <= 2
                toolHandlers._linebuff = npts[0]
                return 'line-perpendicular:point'
            return 'line-perpendicular:line'
        doHighLight: (p) -> p.typename is 'PLine' and p._dist <= 2

    'line-perpendicular:point':
        handler: (nearests) ->
            npts = nearests.filter (p) -> p.typename is 'PPoint'
            if npts[0]._dist <= 7
                plane.addPrimitive PLine.getPerpendicular(toolHandlers._linebuff, npts[0])
                return 'none'
            return 'line-perpendicular:point'
        doHighLight: onPoints

    'line-intersection:1':
        handler: (nearests) ->
            npts = nearests.filter (p) -> p.typename is 'PLine'
            if npts[0]._dist <= 2
                toolHandlers._linebuff = npts[0]
                return 'line-intersection:2'
            return 'line-intersection:1'
        doHighLight: (p) -> p.typename is 'PLine' and p._dist <= 2

    'line-intersection:2':
        handler: (nearests) ->
            npts = nearests.filter (p) -> p.typename is 'PLine'
            if npts[0]._dist <= 2
                plane.addPrimitive PLine.getIntersection(toolHandlers._linebuff, npts[0])
                return 'none'
            return 'line-intersection:2'
        doHighLight: (p) -> p.typename is 'PLine' and p._dist <= 2

    # Buffer Variables
    _centroidbuff: []
































#
