

class GeoPlane
    constructor: ->
        @primitives = []

    render: (g) ->
        for primitive in @primitives
            primitive.render g
        return

    addPrimitive: (primitive) ->
        @primitives.push primitive

    getClosestTo: (x, y) ->
        bf = @primitives.slice()

        for primitive in bf
            primitive._dist = primitive.distance(x, y)

        bf.sort (a, b) ->
            return a._dist - b._dist

        return bf[0]

class PPoint
    constructor: (@x, @y) ->
        @typename = 'PPoint'

    render: (g) ->
        g.setColor '#000000'
        g.drawCircle @getX(), @getY(), 5
        g.fillCircle @getX(), @getY(), 3

    highLight: (g) ->
        g.setColor '#ff4000'
        g.drawCircle @getX(), @getY(), 7

    getX: ->
        return (@x?() ? @x)
    getY: ->
        return (@y?() ? @y)
    isUndependant: ->
        return typeof @x isnt 'function'

    distance: (x, y) ->
        dx = x - @getX()
        dy = y - @getY()
        return Math.sqrt(dx * dx + dy * dy)


    @getCentroid: (ptlist) ->
        return new PPoint(
            (->
                rx = 0
                for pt in ptlist
                    rx += pt.getX()
                return rx / ptlist.length
            ),
            (->
                ry = 0
                for pt in ptlist
                    ry += pt.getY()
                return ry / ptlist.length
            )
        )


exports.GeoPlane = GeoPlane
exports.PPoint = PPoint
























#
