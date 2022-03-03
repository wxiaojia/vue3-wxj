import analysParam from './json/analysParam.json'

export default {
    drawImg (ctx, option, callback) {
        let image = new window.Image()
        image.src = option.src
        const { x, y, w, h, sx, sy, sw, sh } = option
        let draw = () => {
            if(!isNaN(x) && !isNaN(y)) {
                if (!isNaN(w) && !isNaN(h)) {
                    if (!isNaN(sx) && !isNaN(sy) && !isNaN(sw) && !isNaN(sh)) {
                        ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h)
                        // 为什么这要return ,下面的不用？
                        return 
                    }
                    ctx.drawImage(image, x, y, w, h)
                    return
                }
                ctx.drawImage(image, x, y)
            }
        }
        // 如果图片已经存在与浏览器，直接调用回调函数
        if (image.complete) {
            draw()
            if (callback && typeof callback === 'function') {
                callback()
            }
            return
        }
        image.onload = () => {
            draw()
            if (callback && typeof callback === 'function') {
                callback()
            }
        }
    },
    /**
     * 
     * @param {*} option 
     * @returns 
     * 说明：
     * rect 矩形
     * fillStyle 填充颜色
     */
    createCanvas (option) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        if (!isNaN(option.w) && !isNaN(option.h)) {
            canvas.width = option.w
            canvas.height = option.h
            ctx.rect(0, 0, option.w, option.h)
        }
        if (option.isTransparent) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0)'        // 白色
        } else {
            ctx.fillStyle = option.fillStyle
        }
        ctx.fill()
        return {
            canvas: canvas,
            ctx: ctx
        }
    },
    /**
     * 画圆
     * strokeStyle 设置弧的颜色
     * fillStyle 设置背景颜色
     */
    drawCircular(ctx, option, type) {
        ctx.beginPath()
        ctx.strokeStyle = option.strokeStyle
        ctx.fillStyle = option.fillStyle
        let sAngle = option.sAngle || 0,
            eAndle = option.eAngle || 2
        if (type != undefined) {
            ctx.arc(option.x, option.y[type], option.r, sAngle * Math.PI, eAndle * Math.PI)
        } else {
            ctx.arc(option.x, option.y, option.r, sAngle * Math.PI, eAndle * Math.PI)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    },
    /**
     * 圆角矩形
     * arcTo, 在画布上创建介于两个切线之间的弧(起点x, 起点y,终点x, 终点y, 半径)，
     * 右上角：x是一样的，主要是高度差距
     * @param {} ctx 
     * @param {*} temp 
     */
    drawRoundedRect(ctx, temp) {
        let roundedRect = (ctx, x, y, w, h, radius) => {
            if (w > 0) {
                ctx.moveTo(x + radius, y)
            } else {
                ctx.moveTo(x - radius, y)
            }
            ctx.arcTo(x + w, y, x + w, y + h, radius)   // 右上
            ctx.arcTo(x + w, y + h, x, y + h, radius)   // 左上
            ctx.arcTo(x, y + h, x, y, radius)
            if (w > 0) {
                ctx.arcTo(x, y, x+ radius, y, radius)
            } else {
                ctx.arcTo(x, y, x - radius, y, radius)
            }
        }
        ctx.beginPath()
        roundedRect(ctx, temp.x, temp.y, temp.w, temp.h, temp.radius)
        ctx.strokeStyle = temp.strokeStyle
        ctx.fillStyle = temp.fillStyle
        ctx.stroke()
        ctx.fill()
    },
    /**
     * 关闭里面的 x
     * @param {g} ctx 
     * @param {*} x 
     */
    closeX(ctx, closeLine) {
        ctx.beginPath()
        ctx.moveTo(closeLine[0].moveTo[0], closeLine[0].moveTo[1])
        ctx.lineTo(closeLine[0].lineTo[0], closeLine[0].lineTo[1])
        ctx.moveTo(closeLine[1].moveTo[0], closeLine[1].moveTo[1])
        ctx.lineTo(closeLine[1].lineTo[0], closeLine[1].lineTo[1])
        ctx.closePath()
        ctx.strokeStyle = closeLine[0].strokeStyle
        ctx.stroke()
    },
    /**
     * 写文字
     * 以x为基线textAlign： 
     * start/left 右侧 end/right 左侧，结尾在基线  center 以基线为中间
     * 以y为基线textBaseline：
     * Top/hanging 在线下，middle中间， bottom/alphabetic上面
     */
    fillText(ctx, option, text, x, y) {
        ctx.font = option.font
        ctx.fillStyle = option.fillStyle
        if (option.textAlign) {
            ctx.textAlign = option.textAlign
        } else {
            ctx.textAlign = 'start'
        }
        if (option.textBaseline) {
            ctx.textBaseline = option.textBaseline
        } else {
            ctx.textBaseline = 'top'
        }
        ctx.fillText(text, x, y)
    },
    /**
     * 画条件
     * @param {} option 
     * @returns 
     */
    createConditionCanvas (option) {
        const condition = analysParam.module.condition[0]
        const {
            dataFilterFontParam,
            w, h, font, x, y, r, 
            fontParam, closeCircular,
            closeLine
        } = condition
        let canvasObj = this.createCanvas({
            w: option.scope[2],
            h: option.scope[3],
            isTransparent: true
        })
        let ctx = canvasObj.ctx

        let lineLength = 0
        let xl = w + lineLength + 10, yl = h / 2
        this.fillText(ctx, dataFilterFontParam[0], dataFilterFontParam[0].text, xl, yl - 15)
        this.fillText(ctx, dataFilterFontParam[1], dataFilterFontParam[1].text, xl, yl + 15)

        ctx.beginPath()
        ctx.font = font
        ctx.fillStyle = '#1a95e9'
        ctx.arc(lineLength + x, y, r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = fontParam.fillStyle
        ctx.textAlign = fontParam.textAlign
        ctx.textBaseline = fontParam.textBaseline
        let text = condition.fontParam.text
        ctx.fillText(text[0], lineLength + x, y)
        ctx.closePath()

        // 画关闭的圆
        ctx.strokeStyle = closeCircular.strokeStyle
        this.drawCircular(ctx, closeCircular)

        // X 画线
        this.closeX(ctx, closeLine)
        return canvasObj.canvas
    },
    /**
     * 
     * @param {*} option 
     * 说明：
     * moveTo() 方法把路径移动到画布中的指定点，不创建线条。
     * 使用 stroke() 方法在画布上绘制确切的路径。
     * lineTo() 方法添加一个新点，然后创建从该点到画布中最后指定点的线条（该方法并不会创建线条）。
     */
    createDataSourceCanvas (option) {
        const { paramType = 3, type } = option
        let {dataSource: {
                w,h, fillStyle, closeCircular, arrowW,
                lineCircular, strokeStyle, closeLine
            },  
        } = analysParam.module  // 资源配置属性
        const triangle = analysParam.module.triangle[paramType]     // 资源右侧多边形
        let {
            fontParam: {
                tableAlias, tableAliasNumber, title, countNumber
            },
        } = analysParam            // 文字配属性
        let canvasObj = this.createCanvas({
            w: w,
            h: h[paramType],
            isTransparent: true
        })
        let ctx = canvasObj.ctx
        ctx.fillStyle = fillStyle[type - 1]      // 颜色

        // 左侧矩形：因为右上角有个 x,所以开始点的y要在半个圆下，宽要多处半个圆，高
        ctx.fillRect(0, closeCircular.r, w - arrowW, h[paramType] - closeCircular.r)

        // 右侧多边形： moveto x的下面一点, 
        ctx.beginPath()
        ctx.moveTo(triangle.moveTo[0], triangle.moveTo[1])      
        ctx.lineTo(triangle.lineTo[0][0], triangle.lineTo[0][1])
        ctx.lineTo(triangle.lineTo[1][0], triangle.lineTo[1][1])
        ctx.lineTo(triangle.lineTo[2][0], triangle.lineTo[2][1])
        ctx.lineTo(triangle.lineTo[3][0], triangle.lineTo[3][1])
        ctx.closePath()
        ctx.fill()

        // 多边形里可以拖放的圆
        if(option.isLine) {
            this.drawCircular(ctx, lineCircular, paramType)
        }
        ctx.closePath()

        // 画关闭的圆
        ctx.strokeStyle = closeCircular.strokeStyle
        this.drawCircular(ctx, closeCircular)

        // X 画线
        this.closeX(ctx, closeLine)

        // 别名标识
        this.fillText(ctx, tableAlias, option.alias, tableAlias.x, tableAlias.y[paramType])
        // 别名旁的数字
        this.fillText(ctx, tableAliasNumber, option.num, tableAliasNumber.x, tableAliasNumber.y[paramType])
        // 显示名称（此处只先考虑只有一行）
        option.showName = option.name
        this.fillText(ctx, title, option.showName, title.x, title.y)
        // 记录总数
        this.fillText(ctx, countNumber, option.countStr, 
            countNumber.x + 20,
            countNumber.ys[paramType])

        return canvasObj.canvas
    },
    // 创建结果集对象
    createResultSet () {

    },
    /**
     * 结果集,如果是正在运行时，可能要一秒一秒渲染？
     * @param {} option 
     */
    createResultSetCanvas (option) {
        let canvasObj = this.createCanvas({
            w: option.scope[2],
            h: option.scope[3],
            isTransparent: true
        })
        let ctx = canvasObj.ctx
        let {module, fontParam} = analysParam
        let { resultSet: {
            fillStyles, y, gw, gh, radius, strokeStyle, lineCircular, closeCircular,
            closeLine, tableAlias, dateY, tableAliasNumber, textX, marginT
        }, resultSet } = module
        let {
            countDown, 
            runStatus
        } = fontParam
        let fillStyle = fillStyles[1]
        console.log('颜色', fillStyle)
        this.drawRoundedRect(ctx, {
            x: 0,
            y,
            w: gw,
            h: gh,
            radius,
            strokeStyle,
            fillStyle
        })
        // if(option.isLine) {
            this.drawCircular(ctx, lineCircular)
        // }
        this.drawCircular(ctx, closeCircular)

        // X 画线
        this.closeX(ctx, closeLine)        

        // 别名标识
        this.fillText(ctx, tableAlias, 'R', tableAlias.x, tableAlias.y)
        // 别名旁的数字
        this.fillText(ctx, tableAliasNumber, option.num, tableAliasNumber.x, tableAliasNumber.y)
        // 显示名称（此处只先考虑只有一行）
        this.fillText(ctx, countDown, option.showName, textX, marginT - 10)
        // 
        if (option.runStatus) {
            // 计时
            if (option.runStatus === '20') {
                this.fillText(ctx, countDown, '10 秒', gw / 2, dateY)
            }
            // 状态文字
            this.fillText(ctx, runStatus, '正常结束', runStatus.x, y + runStatus.y)
        }

        return canvasObj.canvas
    },
    
    /**
     * 开始画
     * drawImage参数：
     * img	规定要使用的图像、画布或视频。
        sx	可选。开始剪切的 x 坐标位置。
        sy	可选。开始剪切的 y 坐标位置。
        sw	可选。被剪切图像的宽度。
        sh	可选。被剪切图像的高度。
        x	在画布上放置图像的 x 坐标位置。
        y	在画布上放置图像的 y 坐标位置。
        w	可选。要使用的图像的宽度。（伸展或缩小图像）
        h	可选。要使用的图像的高度。（伸展或缩小图像)
     */
    drawCanvas (ctx, canvas, option) {
        ctx.drawImage(canvas, option.sx, option.sy, option.sw, option.sh, option.x, option.y, option.w, option.h)
    },
    drawLine (ctx, option) {
        ctx.strokeStyle = option.fillStyle
        ctx.lineWidth = option.lineWidth || 1.5
        ctx.beginPath()
        ctx.moveTo(option.x0, option.y0)
        ctx.lineTo(option.x1, option.y1)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    }
}