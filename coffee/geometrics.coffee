

class GeoPlane
    constructor: ->
        @primitives = []

    render: (g) ->
        for primitive in @primitives
            primitive.render g

    addPrimitive: (primitive) ->
        @primitives.push primitive

    getClosestTo: (x, y) ->
        for primitive in @primitives
            primitive._dist = primitive.distance(x, y)

        @primitives.sort (a, b) ->
            return a._dist - b._dist

        return @primitives[0]

class PPoint
    constructor: (@x, @y) ->
        # @twoobj.outer = Two.makeCircle(x, y, 6)
        # @twoobj.outer.noFill()
        # @twoobj.outer.stroke = '#000000'
        # @twoobj.inner = Two.makeCircle(x, y, 4)
        # @twoobj.inner.noStroke()
        # @twoobj.inner.fill = '#000000'

    render: (g) ->
        g.setColor '#000000'
        g.drawCircle @getX, @getY, 7
        g.fillCircle @getX, @getY, 5

    getX: ->
        return (x?() ? x)
    getY: ->
        return (y?() ? y)

    distance: (x, y) ->
        dx = x - @getX()
        dy = y - @getY()
        return Math.sqrt(dx * dx + dy * dy)


    @getCentroid: (ptlist) ->
        sx = ptlist[0].x
        sy = ptlist[0].y

        for i in [1..ptlist.length]
            sx = -> (sx?() ? sx) + (ptlist[i].x?() ? ptlist[i].x)
            sy = -> (sy?() ? sy) + (ptlist[i].y?() ? ptlist[i].y)

        return new PPoint((-> sx / ptlist.length), (-> sy / ptlist.length))


exports.GeoPlane = GeoPlane
exports.PPoint = PPoint
