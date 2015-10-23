class Graphics
    constructor: (@ctx, @viewport) ->
        @transform = {
            x: 0
            y: 0
            rotation: 0
            scale: 1
        }

    translate: (dx, dy) ->
        @transform.x += dx
        @transform.y += dy
        @ctx.translate(dx, dy)

    setColor: (color) ->
        @ctx.fillStyle = color
        @ctx.strokeStyle = color

    setLineWidth: (linewidth) ->
        @ctx.lineWidth = linewidth

    setFont: (fontdef) ->
        @ctx.font = fontdef


    drawArc: (x, y, r, sAngle, eAngle) ->
        @ctx.beginPath()
        @ctx.arc(x, y, r, sAngle, eAngle, true)
        @ctx.stroke()

    fillArc: (x, y, r, sAngle, eAngle) ->
        @ctx.beginPath()
        @ctx.arc(x, y, r, sAngle, eAngle, true)
        @ctx.fill()

    drawCircle: (x, y, r) ->
        @drawArc(x, y, r, 0, 2 * Math.PI)

    fillCircle: (x, y, r) ->
        @fillArc(x, y, r, 0, 2 * Math.PI)

    drawRect: (x, y, width, height) ->
        @ctx.strokeRect(x, y, width, height)

    fillRect: (x, y, width, height) ->
        @ctx.fillRect(x, y, width, height)

    drawText: (x, y, text) ->
        @ctx.fillText(text, x, y)

    drawLine: (x1, y1, x2, y2) ->
        @ctx.beginPath()
        @ctx.moveTo(x1, y1)
        @ctx.lineTo(x2, y2)
        @ctx.stroke()

    drawPoly: (ptlist) ->
        @ctx.beginPath()
        @ctx.moveTo(ptlist[0].x, ptlist[0].y)
        for pt in ptlist
            @ctx.lineTo(pt.x, pt.y)
        @ctx.closePath()
        @ctx.stroke()

    fillPoly: (ptlist) ->
        @ctx.beginPath()
        @ctx.moveTo(ptlist[0].x, ptlist[0].y)
        for pt in ptlist
            @ctx.lineTo(pt.x, pt.y)
        @ctx.closePath()
        @ctx.fill()

exports.createFromCanvas = (canvas, viewport) ->
        return new Graphics(canvas.getContext('2d'), viewport)





















#
