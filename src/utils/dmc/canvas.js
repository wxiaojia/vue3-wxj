import stringUtil from '../common/string'
// import objectUtil from '../common/object'
// import dateUtil from '../common/date'
// import calculate from '../dmc/calculate'
import analysParam from '../../views/dmc/json/analysParam.json' // 魔方配置参数
// import dataOperate from './dataOperate'

export default {
    /**
     * canvas 画图方法
     */
    drawImg: (ctx, option, callback) => {
        let image = new window.Image()
        image.src = option.src
        let draw = () => {
            if (!isNaN(option.x) && !isNaN(option.y)) {
                if (!isNaN(option.w) && !isNaN(option.h)) {
                    if (!isNaN(option.sx) && !isNaN(option.sy) && !isNaN(option.sw) && !isNaN(option.sh)) {
                        ctx.drawImage(image, option.sx, option.sy, option.sw, option.sh, option.x, option.y, option.w, option.h)
                        return
                    }
                    ctx.drawImage(image, option.x, option.y, option.w, option.h)
                    return
                }
                ctx.drawImage(image, option.x, option.y)
            }
        }
        if (image.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
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
     * canvas 画图方法 用户画布中画canvas
     */
    drawCanvas: (ctx, canvas, option) => {
        // let img = new window.Image()
        // img.src = canvas.toDataURL('image/png')
        // let beginTime = Date.now()
        // img.onload = () => {
        //     console.log(Date.now() - beginTime)
        // if (canvas.src) {
        //     if (canvas.complete) {
        //         if (!isNaN(option.x) && !isNaN(option.y)) {
        //             if (!isNaN(option.w) && !isNaN(option.h)) {
        //                 if (!isNaN(option.sx) && !isNaN(option.sy) && !isNaN(option.sw) && !isNaN(option.sh)) {
        //                     ctx.drawImage(canvas, option.sx, option.sy, option.sw, option.sh, option.x, option.y, option.w, option.h)
        //                     return
        //                 }
        //                 ctx.drawImage(canvas, option.x, option.y, option.w, option.h)
        //                 return
        //             }
        //             ctx.drawImage(canvas, option.x, option.y)
        //         }
        //     } else {
        //         canvas.onload = () => {
        //             if (!isNaN(option.x) && !isNaN(option.y)) {
        //                 if (!isNaN(option.w) && !isNaN(option.h)) {
        //                     if (!isNaN(option.sx) && !isNaN(option.sy) && !isNaN(option.sw) && !isNaN(option.sh)) {
        //                         ctx.drawImage(canvas, option.sx, option.sy, option.sw, option.sh, option.x, option.y, option.w, option.h)
        //                         return
        //                     }
        //                     ctx.drawImage(canvas, option.x, option.y, option.w, option.h)
        //                     return
        //                 }
        //                 ctx.drawImage(canvas, option.x, option.y)
        //             }
        //         }
        //     }
        // } else {
        if (!isNaN(option.x) && !isNaN(option.y)) {
            if (!isNaN(option.w) && !isNaN(option.h)) {
                if (!isNaN(option.sx) && !isNaN(option.sy) && !isNaN(option.sw) && !isNaN(option.sh)) {
                    ctx.drawImage(canvas, option.sx, option.sy, option.sw, option.sh, option.x, option.y, option.w, option.h)
                    return
                }
                ctx.drawImage(canvas, option.x, option.y, option.w, option.h)
                return
            }
            ctx.drawImage(canvas, option.x, option.y)
        }
        // }
        // }
    },
    /**
     * canvas 画圆方法
     */
    drawCircular (ctx, option, type) {
        ctx.beginPath()
        /**
         * 设置弧线的颜色
         * @type {[type]}
         */
        ctx.strokeStyle = option.strokeStyle
        /**
         * 设置背景颜色rgba(141, 141, 141, 1)
         * @type {[type]}
         */
        ctx.fillStyle = option.fillStyle
        /**
         * option.x,    圆心的x轴坐标值
         * option.y,    圆心的y轴坐标值
         * option.r     圆的半径
         */
        let sAngle = option.sAngle || 0
        let eAngle = option.eAngle || 2
        if (type !== undefined) {
            ctx.arc(option.x, option.y[type], option.r, sAngle * Math.PI, eAngle * Math.PI)
        } else {
            ctx.arc(option.x, option.y, option.r, sAngle * Math.PI, eAngle * Math.PI)
        }
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    },
    drawSector (ctx, option) {
        ctx.save()
        ctx.translate(option.x, option.y)
        ctx.beginPath()
        let sAngle = option.sAngle || 0
        let eAngle = option.eAngle || 2
        ctx.arc(0, 0, option.r, sAngle * Math.PI, eAngle * Math.PI)
        ctx.save()
        ctx.rotate(eAngle * Math.PI)
        ctx.moveTo(option.r, 0)
        ctx.lineTo(0, 0)
        ctx.restore()
        ctx.rotate(sAngle * Math.PI)
        ctx.lineTo(option.r, 0)
        ctx.closePath()
        ctx.restore()
        ctx.translate(0, 0)
        ctx.fillStyle = option.fillStyle
        ctx.fill()
    },
    /**
     * 画扇形中心点延伸出去的文字说明
     * @param ctx {context} 画布的 getContext('2d')
     * @param option {Object} 一些参数
     * @param text {String} 要写的文字
     * @param isNewLine {Boolean} 是否换行书写文字
     * @param lineStrNum {number} 换行的文字长度 长于当前文字才换行
     * @param lineTextWidth {number} 文字第一行的宽度
     * @param num {number} 第几个文字
     * @param circular {Object} 画扇形相关的配置参数
     */
    drawSectorText (ctx, option, textOption, text, isNewLine, lineStrNum, lineTextWidth, num, circular) {
        let angleArr = circular.angleArr
        let minAngleLen = circular.minAngleLen
        ctx.save()
        ctx.translate(option.x, option.y)
        let sAngle = option.sAngle || 0
        let eAngle = option.eAngle || 2
        let angle = eAngle - sAngle
        let centerAngle = angle / 2
        let isLeft = true
        ctx.rotate((centerAngle + sAngle) * Math.PI)
        // 判断中心点的位置 是在左边还是右边
        if (centerAngle + sAngle > 0.5 && centerAngle + sAngle < 1.5) {
            isLeft = false
        }
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(option.r + 5, 0)
        let addR = (num + 1) * option.addR
        ctx.lineTo(option.r + addR, 0)
        ctx.closePath()
        ctx.strokeStyle = option.fillStyle
        ctx.stroke()
        ctx.translate(option.r + addR, 0)
        ctx.rotate(-(centerAngle + sAngle) * Math.PI)
        let lineToX = 0
        let angleArrLen = angleArr.length
        let drawLine = (x) => {
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(lineToX, 0)
            ctx.closePath()
            ctx.stroke()
        }
        lineToX = 50
        if (!isLeft) {
            lineToX = -50
        }
        switch (angleArrLen) {
            case 1:
                drawLine()
                ctx.translate(lineToX, 0)
                break
            case 2:
                drawLine()
                ctx.translate(lineToX, 0)
                break
            case 3:
                if (minAngleLen === 2 && option.current !== 'undefined') {
                    let addAngle = option.current * 90
                    ctx.rotate((315 + addAngle) * Math.PI / 180)
                    drawLine()
                    ctx.translate(lineToX, 0)
                    ctx.rotate((45 - addAngle) * Math.PI / 180)
                } else {
                    drawLine()
                    ctx.translate(lineToX, 0)
                }
                break
            case 4:
                if (minAngleLen === 2 && option.current !== 'undefined') {
                    let up = num === 0 ? angleArrLen - 1 : num - 1
                    let next = num === angleArrLen - 1 ? 0 : num + 1
                    if (angleArr[up] < 36 || angleArr[next] < 36) {
                        let addAngle = option.current * 90
                        ctx.rotate((315 + addAngle) * Math.PI / 180)
                        drawLine()
                        ctx.translate(lineToX, 0)
                        ctx.rotate((45 - addAngle) * Math.PI / 180)
                    } else {
                        drawLine()
                        ctx.translate(lineToX, 0)
                    }
                } else if (minAngleLen === 3 && option.current !== 'undefined') {
                    let addAngle = option.current * 90
                    ctx.rotate((270 + addAngle) * Math.PI / 180)
                    drawLine()
                    ctx.translate(lineToX, 0)
                    ctx.rotate((90 - addAngle) * Math.PI / 180)
                } else {
                    drawLine()
                    ctx.translate(lineToX, 0)
                }
                break
            case 5:
                let up = num === 0 ? angleArrLen - 1 : num - 1
                let up1 = up === 0 ? angleArrLen - 1 : up - 1
                let next = num === angleArrLen - 1 ? 0 : num + 1
                let next1 = next === angleArrLen - 1 ? 0 : next + 1
                if (minAngleLen === 2 && option.current !== 'undefined') {
                    if (angleArr[up] < 36 || angleArr[next] < 36) {
                        let addAngle = option.current * 90
                        ctx.rotate((315 + addAngle) * Math.PI / 180)
                        drawLine()
                        ctx.translate(lineToX, 0)
                        ctx.rotate((45 - addAngle) * Math.PI / 180)
                    } else {
                        drawLine()
                        ctx.translate(lineToX, 0)
                    }
                } else if (minAngleLen === 3 && option.current !== 'undefined') {
                    if ((angleArr[up] < 36 && angleArr[up1] < 36) ||
                    (angleArr[up] < 36 && angleArr[next] < 36) ||
                    (angleArr[next] < 36 && angleArr[next1] < 36)) {
                        let addAngle = option.current * 90
                        ctx.rotate((270 + addAngle) * Math.PI / 180)
                        drawLine()
                        ctx.translate(lineToX, 0)
                        ctx.rotate((90 - addAngle) * Math.PI / 180)
                    } else if ((angleArr[up] > 36 && angleArr[next] < 36) ||
                        (angleArr[up] < 36 && angleArr[next] > 36)) {
                        let current = 0
                        if (angleArr[up] < 36 && angleArr[next] > 36) {
                            current = 1
                        }
                        let addAngle = current * 90
                        ctx.rotate((315 + addAngle) * Math.PI / 180)
                        drawLine()
                        ctx.translate(lineToX, 0)
                        ctx.rotate((45 - addAngle) * Math.PI / 180)
                    } else if (angleArr[up] > 36 && angleArr[next] > 36) {
                        drawLine()
                        ctx.translate(lineToX, 0)
                    } else {
                        drawLine()
                        ctx.translate(lineToX, 0)
                    }
                } else if (minAngleLen === 4 && option.current !== 'undefined') {
                    let addAngle
                    if (option.current === 1 || option.current === 2) {
                        addAngle = (option.current - 1) * 90
                        ctx.rotate((315 + addAngle) * Math.PI / 180)
                        lineToX = 40
                        if (!isLeft) {
                            lineToX = -40
                        }
                        drawLine()
                        ctx.translate(lineToX, 0)
                        ctx.rotate((45 - addAngle) * Math.PI / 180)
                    } else {
                        addAngle = option.current * 60
                        ctx.rotate((270 + addAngle) * Math.PI / 180)
                        lineToX = 80
                        if (!isLeft) {
                            lineToX = -80
                        }
                        drawLine()
                        ctx.translate(lineToX, 0)
                        ctx.rotate((90 - addAngle) * Math.PI / 180)
                    }
                } else {
                    drawLine()
                    ctx.translate(lineToX, 0)
                }
                break
        }
        textOption.textAlign = isLeft ? 'left' : 'right'
        if (isNewLine !== undefined && isNewLine) {
            let len = stringUtil.subStrLength(text)
            let h = parseFloat(textOption.font) + 2
            if (len > lineStrNum) {
                let num = Math.ceil(len / lineStrNum)
                textOption.textAlign = 'left'
                for (let i = 0; i < num; i++) {
                    if (i > 0) {
                        this.fillText(ctx, textOption, stringUtil.subStrLength(text, i * lineStrNum + 1, (i + 1) * lineStrNum), isLeft ? 5 : -5 - lineTextWidth, h * i)
                    } else {
                        this.fillText(ctx, textOption, stringUtil.subStrLength(text, i * lineStrNum, (i + 1) * lineStrNum), isLeft ? 5 : -5 - lineTextWidth, h * i)
                    }
                }
            } else {
                this.fillText(ctx, textOption, text, isLeft ? 5 : -5, 0)
            }
        } else {
            this.fillText(ctx, textOption, text, isLeft ? 5 : -5, 0)
        }
        ctx.restore()
    },
    /**
     * 数据资产画扇形中心点延伸出去的文字说明三行
     */
    drawDataSectorText (ctx, option, textOption, text, height) {
        ctx.save()
        ctx.translate(option.x, option.y)
        let sAngle = option.sAngle || 0
        let eAngle = option.eAngle || 2
        let centerAngle = (eAngle - sAngle) / 2
        let isLeft = true
        ctx.rotate((centerAngle + sAngle) * Math.PI)
        // 判断中心点的位置 是在左边还是右边
        if (centerAngle + sAngle > 0.5 && centerAngle + sAngle < 1.5) {
            isLeft = false
        }
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(option.r + 5, 0)
        ctx.lineTo(option.r + 15, 0)
        ctx.closePath()
        ctx.strokeStyle = option.fillStyle
        ctx.stroke()
        ctx.translate(option.r + 15, 0)
        ctx.rotate(-(centerAngle + sAngle) * Math.PI)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        let lineToX = 0
        if (isLeft) {
            lineToX = 40
        } else {
            lineToX = -40
        }
        ctx.lineTo(lineToX, 0)
        ctx.closePath()
        ctx.stroke()
        textOption.textAlign = isLeft ? 'left' : 'right'
        this.fillText(ctx, textOption, text[0], lineToX + (isLeft ? 5 : -5), -height * 3 / 4)
        this.fillText(ctx, textOption, text[1], lineToX + (isLeft ? 5 : -5), 0)
        this.fillText(ctx, textOption, text[2], lineToX + (isLeft ? 5 : -5), height * 3 / 4)
        ctx.restore()
    },
    /**
     * 画圆角矩形
     * @type {[type]}
     */
    drawRoundedRect: (ctx, temp) => {
        let roundedRect = (ctx, x, y, w, h, radius) => {
            if (w > 0) {
                ctx.moveTo(x + radius, y)
            } else {
                ctx.moveTo(x - radius, y)
            }
            ctx.arcTo(x + w, y, x + w, y + h, radius)
            ctx.arcTo(x + w, y + h, x, y + h, radius)
            ctx.arcTo(x, y + h, x, y, radius)
            if (w > 0) {
                ctx.arcTo(x, y, x + radius, y, radius)
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
    getFont (option, zoom) {
        let font = ''
        if (!isNaN(option.fontSize) && option.fontSize !== '') {
            font += option.fontSize * zoom + 'px'
        } else {
            font += '12px'
        }
        if (option.fontWeight !== '') {
            font += ' ' + option.fontWeight
        }
        if (option.fontFamily !== '') {
            font += ' ' + option.fontFamily
        } else {
            font += ' Microsoft YaHei'
        }
        return font
    },
    /**
     * canvas 写文字方法
     */
    fillText: (ctx, option, text, x, y) => {
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
     * canvas 画线
     */
    drawLine: (ctx, option) => {
        /**
         * 设置填充颜色
         * @type {String}
         */
        ctx.strokeStyle = option.fillStyle
        ctx.lineWidth = option.lineWidth ? option.lineWidth : 1.5
        ctx.beginPath()
        /**
         * 将画笔移到x0,y0处
         */
        ctx.moveTo(option.x0, option.y0)
        /**
         * 从x0,y0到x1,y1画一条线
         */
        ctx.lineTo(option.x1, option.y1)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    },
    /**
     * canvas 画横向带箭头的线
     */
    drawArrowLine: (ctx, option) => {
        /**
         * 设置填充颜色
         * @type {String}
         */
        ctx.strokeStyle = option.fillStyle
        ctx.lineWidth = option.lineWidth
        ctx.fillStyle = option.fillStyle
        ctx.beginPath()
        /**
         * 将画笔移到x0,y0处
         */
        ctx.moveTo(option.x0, option.y0)
        /**
         * 从x0,y0到x1,y1画一条线
         */
        ctx.lineTo(option.x1 - 1, option.y1)
        ctx.closePath()
        ctx.stroke()
        ctx.beginPath()
        /**
         * 从x1,y1画两5像素的条线形成箭头
         */
        ctx.lineTo(option.x1 - option.r, option.y1 + option.r * 2 / 3)
        ctx.lineTo(option.x1 - 1, option.y1)
        ctx.lineTo(option.x1 - option.r, option.y1 - option.r * 2 / 3)
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
    },
    /**
     * canvas 画任意角度带箭头的线
     */
    drawArrowLine1: (ctx, option) => {
        ctx.strokeStyle = option.fillStyle
        ctx.lineWidth = option.lineWidth
        var angle = Math.abs(Math.atan((option.x1 - option.x0) / (option.y1 - option.y0))) // 倾斜角余角
        var length = option.len // 箭头斜线长度
        var degree = Math.PI / 4 // 箭头倾斜角
        var theta = 0
        var altha = 0
        var a1 = 0
        var b1 = 0
        var a2 = 0
        var b2 = 0
        if (angle >= degree && angle <= Math.PI / 2 - degree) {
            theta = angle - degree
            altha = Math.PI / 2 - 2 * degree - theta
            if (option.x1 >= option.x0) {
                a1 = option.x1 - length * Math.sin(theta)
                a2 = option.x1 - length * Math.cos(altha)
            } else {
                a1 = option.x1 + length * Math.sin(theta)
                a2 = option.x1 + length * Math.cos(altha)
            }
            if (option.y1 >= option.y0) {
                b1 = option.y1 - length * Math.cos(theta)
                b2 = option.y1 - length * Math.sin(altha)
            } else {
                b1 = option.y1 + length * Math.cos(theta)
                b2 = option.y1 + length * Math.sin(altha)
            }
        } else {
            theta = angle - degree
            altha = theta + 2 * degree - Math.PI / 2
            if (option.x1 >= option.x0 && option.y1 >= option.y0) {
                a1 = option.x1 - length * Math.sin(theta)
                b1 = option.y1 - length * Math.cos(theta)
                a2 = option.x1 - length * Math.cos(altha)
                b2 = option.y1 + length * Math.sin(altha)
            } else if (option.x1 >= option.x0 && option.y1 < option.y0) {
                a1 = option.x1 - length * Math.sin(theta)
                b1 = option.y1 + length * Math.cos(theta)
                a2 = option.x1 - length * Math.cos(altha)
                b2 = option.y1 - length * Math.sin(altha)
            } else if (option.x1 < option.x0 && option.y1 < option.y0) {
                a1 = option.x1 + length * Math.sin(theta)
                b1 = option.y1 + length * Math.cos(theta)
                a2 = option.x1 + length * Math.cos(altha)
                b2 = option.y1 - length * Math.sin(altha)
            } else {
                a1 = option.x1 + length * Math.sin(theta)
                b1 = option.y1 - length * Math.cos(theta)
                a2 = option.x1 + length * Math.cos(altha)
                b2 = option.y1 + length * Math.sin(altha)
            }
        }
        ctx.beginPath()
        ctx.moveTo(option.x0, option.y0)
        ctx.lineTo(option.x1, option.y1)
        ctx.lineTo(a1, b1)
        ctx.stroke()
        ctx.moveTo(option.x1, option.y1)
        ctx.lineTo(a2, b2)
        ctx.stroke()
    },
    /**
     * 暂时无用 还没完善逻辑
     * @param option.xScale 水平缩放
     * @param option.xRotate 水平倾斜
     * @param option.yScale 垂直倾斜
     * @param option.yRotate 垂直缩放
     * @param option.translateX 水平移动
     * @param option.translateY 垂直移动
     */
    transform (ctx, option) {
        ctx.transform(option.xScale, option.xRotate, option.yRotate, option.yScale, option.translateX, option.translateY)
    },
    /**
     * 创建canvas
     * @param {Object} option
     */
    createCanvas (option) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        if (!isNaN(option.w) && !isNaN(option.h)) {
            canvas.width = option.w
            canvas.height = option.h
            ctx.rect(0, 0, option.w, option.w)
        }
        if (option.isTransparent) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0)'
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
     * 创建资源canvas
     * @param {Object} option 配置参数
     */
    createDataSourceCanvas (option) {
        let dataSource = analysParam.module.dataSource // 资源配置属性
        const triangle = analysParam.module.triangle[option.paramType] // 资源右侧多边形
        let fontParam = analysParam.fontParam // 文字配属性
        let canvasObj = this.createCanvas({
            w: dataSource.w,
            h: dataSource.h[option.paramType],
            isTransparent: true
        })
        let ctx = canvasObj.ctx
        ctx.fillStyle = dataSource.fillStyle[option.type - 1]
        ctx.fillRect(0, dataSource.closeCircular.r, dataSource.w - dataSource.arrowW, dataSource.h[option.paramType] - dataSource.closeCircular.r)
        ctx.beginPath()
        ctx.moveTo(triangle.moveTo[0], triangle.moveTo[1])
        ctx.lineTo(triangle.lineTo[0][0], triangle.lineTo[0][1])
        ctx.lineTo(triangle.lineTo[1][0], triangle.lineTo[1][1])
        ctx.lineTo(triangle.lineTo[2][0], triangle.lineTo[2][1])
        ctx.lineTo(triangle.lineTo[3][0], triangle.lineTo[3][1])
        ctx.closePath()
        ctx.fill()
        if (option.isLine) {
            // 画开始拖放的圆
            this.drawCircular(ctx, dataSource.lineCircular, option.paramType)
        }
        // 画关闭的x 画线来画
        ctx.closePath()
        ctx.strokeStyle = dataSource.closeCircular.strokeStyle
        this.drawCircular(ctx, dataSource.closeCircular)
        ctx.beginPath()
        ctx.moveTo(dataSource.closeLine[0].moveTo[0], dataSource.closeLine[0].moveTo[1])
        ctx.lineTo(dataSource.closeLine[0].lineTo[0], dataSource.closeLine[0].lineTo[1])
        ctx.moveTo(dataSource.closeLine[1].moveTo[0], dataSource.closeLine[1].moveTo[1])
        ctx.lineTo(dataSource.closeLine[1].lineTo[0], dataSource.closeLine[1].lineTo[1])
        ctx.closePath()
        ctx.strokeStyle = dataSource.closeLine[0].strokeStyle
        ctx.stroke()
        // 别名标识
        this.fillText(ctx, fontParam.tableAlias, option.alias, fontParam.tableAlias.x, fontParam.tableAlias.y[option.paramType])
        // 别名当前的号码
        this.fillText(ctx, fontParam.tableAliasNumber, option.num, fontParam.tableAliasNumber.x, fontParam.tableAliasNumber.y[option.paramType])
        // 截取后的显示名称
        if (option.paramType === 0) {
            option.showName = stringUtil.subStrLength(option.name, 0, 13)
            this.fillText(ctx, fontParam.title, option.showName, fontParam.title.x, fontParam.title.y)
        } else if (option.paramType === 1) {
            this.fillText(ctx, fontParam.title, stringUtil.subStrLength(option.name, 0, 13), fontParam.title.x, fontParam.title.ys[0])
            this.fillText(ctx, fontParam.title, stringUtil.subStrLength(option.name, 13, 25), fontParam.title.x, fontParam.title.ys[1])
        } else if (option.paramType === 2) {
            this.fillText(ctx, fontParam.title, stringUtil.subStrLength(option.name, 0, 13), fontParam.title.x, fontParam.title.ys[0])
            this.fillText(ctx, fontParam.title, stringUtil.subStrLength(option.name, 13, 25), fontParam.title.x, fontParam.title.ys[1])
            this.fillText(ctx, fontParam.title, stringUtil.subStrLength(option.name, 25, 37), fontParam.title.x, fontParam.title.ys[2])
        } else if (option.paramType === 3) {
            this.fillText(ctx, fontParam.title, stringUtil.subStrLength(option.name, 0, 13), fontParam.title.x, fontParam.title.ys[0])
            this.fillText(ctx, fontParam.title, stringUtil.subStrLength(option.name, 13, 25), fontParam.title.x, fontParam.title.ys[1])
            this.fillText(ctx, fontParam.title, stringUtil.subStrLength(option.name, 25, 35) + '...', fontParam.title.x, fontParam.title.ys[2])
        }
        // 写 记录总数
        this.fillText(ctx, fontParam.countNumber, option.countStr, fontParam.countNumber.x + 20, fontParam.countNumber.ys[option.paramType])
        return canvasObj.canvas
    },
    /**
     * 创建关系canvas
     * @param {Object} option 相关条件
     * @param {Object} start 开始的坐标
     */
    createRelationCanvas (self, option = {
        lineCoordinate: []
    }) {
        // 计算画布的宽度和高度
        let fontParam = analysParam.fontParam // 文字配属性
        let imgObj = objectUtil.deepCopy(analysParam.relation[option.rType])
        let canvasObj = this.createCanvas({
            w: option.scope[2] + option.marginR,
            h: option.scope[3],
            // fillStyle: 'greed'
            isTransparent: true
        })
        let ctx = canvasObj.ctx
        for (let data of option.lineCoordinate) {
            this.drawLine(ctx, data)
        }
        imgObj.x = option.lineCoordinate[3].x1
        imgObj.y = option.lineCoordinate[3].y0 - imgObj.h / 2
        this.drawImg(ctx, imgObj)
        // 绘制画布时删除回显关联关系条件时的时间差数组
        let flag = option.echo.condition.some(val => {
            return val.relationOpt === '<=' || val.relationOpt === '>='
        })
        if (flag) {
            let length = option.mapping.length
            if (length > 2) {
                option.mapping = option.mapping.slice(0, length - 2)
            }
        }
        const len = option.mapping.length > 2 ? 2 : option.mapping.length
        for (let i = 0; i < len; i++) {
            let nameLen = stringUtil.subStrLength(option.mapping[i])
            let name = option.mapping[i]
            if (nameLen > 16) {
                let nameArrs = option.mapping[i].split(' ')
                name = stringUtil.subStrLength(nameArrs[0], 8) + '...' + nameArrs[1] + stringUtil.subStrLength(nameArrs[2], 10) + '...'
            }
            this.fillText(ctx, fontParam.conditions, name, imgObj.x + imgObj.w / 2, imgObj.y - 5 - i * 16)
        }
        return canvasObj.canvas
    },
    /**
     * 资源相加canvas
     * @param {Object} option 相关参数
     * @param {Object} start 开始的坐标
     */
    createResourceAddCanvas (self, option = {
        lineCoordinate: []
    }) {
        // 计算画布的宽度和高度
        let imgObj = objectUtil.deepCopy(analysParam.resourceAdd)
        let canvasObj = this.createCanvas({
            w: option.scope[2],
            h: option.scope[3],
            isTransparent: true
        })
        let ctx = canvasObj.ctx
        for (let data of option.lineCoordinate) {
            this.drawLine(ctx, data)
        }
        imgObj.x = option.lineCoordinate[3].x1
        imgObj.y = option.lineCoordinate[3].y0 - imgObj.h / 2
        this.drawImg(ctx, imgObj)
        return canvasObj.canvas
    },
    /**
     * 创建结果集canvas
     * @param {Object} option 结果集及其线和文字说明的的配置参数
     */
    createResultSetCanvas (option) {
        let canvasObj = this.createCanvas({
            w: option.scope[2],
            h: option.scope[3],
            isTransparent: true
        })
        let ctx = canvasObj.ctx
        let module = analysParam.module
        let fontParam = analysParam.fontParam
        let fillStyle
        if (option.runStatus) {
            fillStyle = module.resultSet.fillStyles[parseInt(option.runStatus / 10)]
        } else {
            fillStyle = module.resultSet.fillStyles[1]
        }
        this.drawRoundedRect(ctx, {
            x: 0,
            y: module.resultSet.y,
            w: module.resultSet.gw,
            h: module.resultSet.gh,
            radius: module.resultSet.radius,
            strokeStyle: module.resultSet.strokeStyle,
            fillStyle: fillStyle
        })
        if (option.isLine) {
            // 画圆
            this.drawCircular(ctx, {
                x: module.resultSet.lineCircular.x,
                y: module.resultSet.lineCircular.y,
                r: module.resultSet.lineCircular.r,
                strokeStyle: module.resultSet.lineCircular.strokeStyle,
                fillStyle: module.resultSet.lineCircular.fillStyle
            })
        }
        // 画关闭的x的圆形
        this.drawCircular(ctx, {
            x: module.resultSet.closeCircular.x,
            y: module.resultSet.closeCircular.y,
            r: module.resultSet.closeCircular.r,
            strokeStyle: module.resultSet.closeCircular.strokeStyle,
            fillStyle: module.resultSet.closeCircular.fillStyle
        })
        // 画关闭的x 画线来画
        ctx.beginPath()
        ctx.moveTo(module.resultSet.closeLine[0].moveTo[0], module.resultSet.closeLine[0].moveTo[1])
        ctx.lineTo(module.resultSet.closeLine[0].lineTo[0], module.resultSet.closeLine[0].lineTo[1])
        ctx.moveTo(module.resultSet.closeLine[1].moveTo[0], module.resultSet.closeLine[1].moveTo[1])
        ctx.lineTo(module.resultSet.closeLine[1].lineTo[0], module.resultSet.closeLine[1].lineTo[1])
        ctx.closePath()
        ctx.strokeStyle = module.resultSet.closeLine[0].strokeStyle
        ctx.stroke()
        // 别名标识
        this.fillText(ctx, module.resultSet.tableAlias, 'R', module.resultSet.tableAlias.x, module.resultSet.tableAlias.y)
        // 别名当前的号码
        this.fillText(ctx, module.resultSet.tableAliasNumber, option.num, module.resultSet.tableAliasNumber.x, module.resultSet.tableAliasNumber.y)
        this.fillText(ctx, fontParam.countDown, option.showName, module.resultSet.textX, module.resultSet.marginT - 10)
        if (option.runStatus) {
            if (option.runStatus === '20') {
                // 判断结果集状态 如果是运行中显示剩余时间
                this.fillText(ctx, fontParam.countDown, dateUtil.secondToDate(option.runDate), module.resultSet.gw / 2, module.resultSet.dateY)
            }
            // 显示结果数量
            if (option.runStatus === '50') {
                if (option.count < 1000000) {
                    this.fillText(ctx, fontParam.countDown, stringUtil.numberToString(option.count, ','), module.resultSet.textX, module.resultSet.countY)
                } else {
                    this.fillText(ctx, fontParam.countDown, stringUtil.numberToString(1000000, ',') + '+', module.resultSet.textX, module.resultSet.countY)
                }
            }
            // 显示状态文字
            let satutsName = dataOperate.getRunStatusName(option.runStatus)
            this.fillText(ctx, fontParam.runStatus, satutsName, fontParam.runStatus.x, module.resultSet.y + fontParam.runStatus.y)
        }
        // let img = new window.Image()
        // img.src = canvasObj.canvas.toDataURL('image/png')
        // return img
        return canvasObj.canvas
    },
    /**
     * 画过滤条件canvas (数据过滤、分组统计、全表统计、数据去空、数据去重、新增字段) option.conditionType 分别为0 1 2 3 4 5
     * @param {Object} option 条件配置参数
     */
    createConditionCanvas (option) {
        let condition
        if (option.type === 7) {
            condition = analysParam.module.condition[0]
        } else {
            condition = analysParam.module.condition[option.echo.type]
        }
        let w = option.scope[2]
        let h = option.scope[3]
        if (option.lineCoordinate && option.lineCoordinate.length > 0) {
            w += 40
            if (option.lineCoordinate.length > 1 && option.type === 7) {
                w += 100
            }
        }
        let canvasObj = this.createCanvas({
            w: w,
            h: h,
            // fillStyle: 'greed'
            isTransparent: true
        })
        let ctx = canvasObj.ctx
        let lineLength = 0
        if (option.lineCoordinate && option.lineCoordinate.length > 0) {
            for (let data of option.lineCoordinate) {
                this.drawLine(ctx, data)
            }
            lineLength = 40
        }
        if (option.type === 7) {
            let x = condition.w + lineLength + 10
            let y = condition.h / 2
            switch (option.echo.type) {
                case 1:
                    this.fillText(ctx, condition.dataFilterFontParam[0], condition.dataFilterFontParam[0].text, x, y - 15)
                    this.fillText(ctx, condition.dataFilterFontParam[1], condition.dataFilterFontParam[1].text, x, y + 15)
                    break
                case 2:
                    this.fillText(ctx, condition.dataFilterFontParam[0], condition.dataFilterFontParam[0].text, x, y - 15)
                    break
                case 3:
                    this.fillText(ctx, condition.dataFilterFontParam[1], condition.dataFilterFontParam[1].text, x, y - 15)
                    break
            }
        }
        ctx.beginPath()
        ctx.font = condition.font
        ctx.fillStyle = '#1a95e9'
        ctx.arc(lineLength + condition.x, condition.y, condition.r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = condition.fontParam.fillStyle
        ctx.textAlign = condition.fontParam.textAlign
        ctx.textBaseline = condition.fontParam.textBaseline
        let text = condition.fontParam.text
        if (text.length === 2) {
            ctx.fillText(text[0], lineLength + condition.x, condition.y - 7.5)
            ctx.fillText(text[1], lineLength + condition.x, condition.y + 7.5)
        } else {
            ctx.fillText(text[0], lineLength + condition.x, condition.y)
        }
        ctx.closePath()
        if ((option.type === 7 && option.echo.column.length === 0 && option.echo.condition.length === 0) || (option.type === 8 && option.echo.column.length === 0)) {
            // 画关闭的x的圆圈
            this.drawCircular(ctx, {
                x: lineLength + condition.closeCircular.x,
                y: condition.closeCircular.y,
                r: condition.closeCircular.r,
                strokeStyle: condition.closeCircular.strokeStyle,
                fillStyle: condition.closeCircular.fillStyle
            })
            // 画关闭的x
            ctx.beginPath()
            ctx.moveTo(lineLength + condition.closeLine[0].moveTo[0], condition.closeLine[0].moveTo[1])
            ctx.lineTo(lineLength + condition.closeLine[0].lineTo[0], condition.closeLine[0].lineTo[1])
            ctx.moveTo(lineLength + condition.closeLine[1].moveTo[0], condition.closeLine[1].moveTo[1])
            ctx.lineTo(lineLength + condition.closeLine[1].lineTo[0], condition.closeLine[1].lineTo[1])
            ctx.closePath()
            ctx.strokeStyle = condition.closeLine[0].strokeStyle
            ctx.stroke()
        }
        // let img = new window.Image()
        // img.src = canvasObj.canvas.toDataURL('image/png')
        // return img
        return canvasObj.canvas
    },
    /**
     * 获取新的canvas
     * @param {Number} type 新canvas的类型 1 关联关系的结果集 2 数据过滤、数据统计
     * @param {Object} obj 要生成canvas的相关对象
     * @return {Object} 新的canvas和对应的范围坐标
     */
    getNewCanvas (self, type, obj) {
        if (type === 1) {
            let start = {
                x: Math.min(obj.lDataRelation.scope[0], obj.rDataRelation.scope[0]),
                y: Math.min(obj.lDataRelation.scope[1], obj.rDataRelation.scope[1])
            }
            let x = Math.min(obj.lDataRelation.scope[0], obj.rDataRelation.scope[0])
            let y = Math.min(obj.lDataRelation.scope[1], obj.rDataRelation.scope[1])
            let w = Math.max(obj.lDataRelation.scope[0] + obj.lDataRelation.scope[2], obj.rDataRelation.scope[0] + obj.rDataRelation.scope[2]) - x
            let h = Math.max(obj.lDataRelation.scope[1] + obj.lDataRelation.scope[3], obj.rDataRelation.scope[1] + obj.rDataRelation.scope[3]) - y
            let relationImg
            // 资源相加
            if (obj.relation.type === 9) {
                relationImg = analysParam.resourceAdd
            } else {
                // 关联关系
                relationImg = analysParam.relation[obj.relation.rType]
                let hAdd = obj.relation.marginT + relationImg.h / 2 - h / 2
                if (hAdd > 0) {
                    h += hAdd
                }
            }
            w += 120 + relationImg.w + analysParam.module.resultSet.w
            let canvasObj = this.createCanvas({
                w: w,
                h: h,
                // fillStyle: 'blue'
                isTransparent: true
            })
            if (obj.lModule.type === 4) {
                this.drawCanvas(canvasObj.ctx, obj.lDataRelation.canvas, {
                    sx: 0,
                    sy: 0,
                    sw: obj.lDataRelation.scope[2],
                    sh: obj.lDataRelation.scope[3],
                    x: obj.lDataRelation.scope[0] - start.x,
                    y: obj.lDataRelation.scope[1] - start.y,
                    w: obj.lDataRelation.scope[2],
                    h: obj.lDataRelation.scope[3]
                })
            } else {
                this.drawCanvas(canvasObj.ctx, obj.lDataRelation.canvas, {
                    sx: 0,
                    sy: 0,
                    sw: obj.lModule.scope[2],
                    sh: obj.lModule.scope[3],
                    x: obj.lModule.scope[0],
                    y: obj.lModule.scope[1],
                    w: obj.lModule.scope[2],
                    h: obj.lModule.scope[3]
                })
            }
            if (obj.rModule.type === 4) {
                this.drawCanvas(canvasObj.ctx, obj.rDataRelation.canvas, {
                    sx: 0,
                    sy: 0,
                    sw: obj.rDataRelation.scope[2],
                    sh: obj.rDataRelation.scope[3],
                    x: obj.rDataRelation.scope[0] - start.x,
                    y: obj.rDataRelation.scope[1] - start.y,
                    w: obj.rDataRelation.scope[2],
                    h: obj.rDataRelation.scope[3]
                })
            } else {
                this.drawCanvas(canvasObj.ctx, obj.rDataRelation.canvas, {
                    sx: 0,
                    sy: 0,
                    sw: obj.rModule.scope[2],
                    sh: obj.rModule.scope[3],
                    x: obj.rModule.scope[0],
                    y: obj.rModule.scope[1],
                    w: obj.rModule.scope[2],
                    h: obj.rModule.scope[3]
                })
            }
            if (obj.relation.type === 9) {
                this.drawCanvas(canvasObj.ctx, this.createResourceAddCanvas(self, obj.relation), {
                    sx: 0,
                    sy: 0,
                    sw: obj.relation.scope[2],
                    sh: obj.relation.scope[3],
                    x: obj.relation.scope[0],
                    y: obj.relation.scope[1],
                    w: obj.relation.scope[2],
                    h: obj.relation.scope[3]
                })
            } else {
                this.drawCanvas(canvasObj.ctx, this.createRelationCanvas(self, obj.relation), {
                    sx: 0,
                    sy: 0,
                    sw: obj.relation.scope[2] + obj.relation.marginR,
                    sh: obj.relation.scope[3],
                    x: obj.relation.scope[0],
                    y: obj.relation.scope[1],
                    w: obj.relation.scope[2] + obj.relation.marginR,
                    h: obj.relation.scope[3]
                })
            }
            this.drawCanvas(canvasObj.ctx, this.createResultSetCanvas(obj.resultSet), {
                sx: 0,
                sy: 0,
                sw: obj.resultSet.scope[2],
                sh: obj.resultSet.scope[3],
                x: obj.resultSet.scope[0],
                y: obj.resultSet.scope[1],
                w: obj.resultSet.scope[2],
                h: obj.resultSet.scope[3]
            })
            return {
                canvas: canvasObj.canvas,
                scope: [x, y, w, h]
            }
        } else {
            let canvasObj = this.createCanvas({
                w: obj.w,
                h: obj.h,
                // fillStyle: 'red'
                isTransparent: true
            })
            if (obj.beginModule.type === 4) {
                this.drawCanvas(canvasObj.ctx, obj.beginDataRelation.canvas, {
                    sx: 0,
                    sy: 0,
                    sw: obj.beginDataRelation.scope[2],
                    sh: obj.beginDataRelation.scope[3],
                    x: 0,
                    y: 0,
                    w: obj.beginDataRelation.scope[2],
                    h: obj.beginDataRelation.scope[3]
                })
            } else {
                this.drawCanvas(canvasObj.ctx, obj.beginDataRelation.canvas, {
                    sx: 0,
                    sy: 0,
                    sw: obj.beginDataRelation.scope[2],
                    sh: obj.beginDataRelation.scope[3],
                    x: obj.beginModule.scope[0],
                    y: obj.beginModule.scope[1],
                    w: obj.beginDataRelation.scope[2],
                    h: obj.beginDataRelation.scope[3]
                })
            }
            this.drawCanvas(canvasObj.ctx, obj.condition.canvas, {
                sx: 0,
                sy: 0,
                sw: obj.condition.scope[2],
                sh: obj.condition.scope[3],
                x: obj.condition.scope[0],
                y: obj.condition.scope[1],
                w: obj.condition.scope[2],
                h: obj.condition.scope[3]
            })
            this.drawCanvas(canvasObj.ctx, this.createResultSetCanvas(obj.resultSet), {
                sx: 0,
                sy: 0,
                sw: obj.resultSet.scope[2],
                sh: obj.resultSet.scope[3],
                x: obj.resultSet.scope[0],
                y: obj.resultSet.scope[1],
                w: obj.resultSet.scope[2],
                h: obj.resultSet.scope[3]
            })
            return {
                canvas: canvasObj.canvas
            }
        }
    },
    /**
     * 根据关联关系重新绘制对应的canvas
     * @param {Object} dataRelation DataRelation对象
     */
    initDataRelationCanvas (self, dataRelation) {
        let keys = Object.keys(dataRelation)
        let keyArr = []
        if (keys.length > 0) {
            keys.forEach(val => {
                if (dataRelation[val].relation.length > 1) {
                    dataRelation[val].relation = dataOperate.relationSort(dataRelation[val].relation)
                }
                dataRelation[val].canvas = this.createCanvas({
                    w: dataRelation[val].scope[2],
                    h: dataRelation[val].scope[3],
                    isTransparent: true
                }).canvas
                dataRelation[val].relation.forEach(val => {
                    keyArr.push(val.id)
                })
            })
        }
        return {
            dataRelation: dataRelation,
            keys: keyArr
        }
    },
    /**
     * 重新生成对应的canvas
     * @param {Object} self 页面vue对象
     * @param {Array} changeIdArr 要重新生成canvas的id
     * @param {Array} runStatusArr 结果集运行中的状态数组 这个和changeIdArr只会同时存在一种
     */
    rebuildCanvas (self, changeIdArr = [], runStatusArr = [], isRebuildRs = false) {
        let _this = this
        if (changeIdArr.length === 0 && runStatusArr.length === 0) {
            return self.dataRelation
        }
        let idArr = Object.keys(self.dataRelation)
        if (idArr.length === 0) {
            return
        }
        // 修改结果集运行状态相关信息
        if (runStatusArr.length > 0) {
            let arr = Object.keys(self.dataRelation)
            for (let i = 0; i < runStatusArr.length; i++) {
                let temp = runStatusArr[i]
                for (let j = 0; j < arr.length; j++) {
                    let module = self.resource.get(arr[j])
                    if (temp.stepId === dataOperate.getStepId(self.stepIdMapping, module.stepId)) {
                        changeIdArr.push(module.id)
                        const runDate = Math.ceil((temp.serverTime - temp.runStartTime) / 1000)
                        if (module.runStatus !== temp.runStatus) {
                            module.runStatus = temp.runStatus
                            if (temp.runStatus === '20') {
                                module.runDate = runDate
                            }
                            if (module.runStatus === '50') {
                                self.countMapping[dataOperate.getResourceId(self.rIdMapping, module.rId)] = temp.resultDataTotal
                                module.count = temp.resultDataTotal
                                module.countStr = self.$util.string.numberToString(module.count, ',')
                                if (module.type === 4 && module.isCopyResultSet && module.copyResultSetId && module.copyResultSetId.length > 0) {
                                    for (let id of module.copyResultSetId) {
                                        let item = self.resource.get(id)
                                        if (item) {
                                            item.count = module.count
                                            item.countStr = module.countStr
                                            changeIdArr.push(id)
                                        }
                                    }
                                }
                            }
                        } else {
                            if (module.runStatus === '20') {
                                if (module.runDate + 1 < runDate) {
                                    module.runDate = runDate
                                } else {
                                    module.runDate += 1
                                }
                            } else if (module.runStatus === '50') {
                                self.countMapping[dataOperate.getResourceId(self.rIdMapping, module.rId)] = temp.resultDataTotal
                                module.count = temp.resultDataTotal
                                module.countStr = self.$util.string.numberToString(module.count, ',')
                                if (module.type === 4 && module.isCopyResultSet && module.copyResultSetId && module.copyResultSetId.length > 0) {
                                    for (let id of module.copyResultSetId) {
                                        let item = self.resource.get(id)
                                        if (item) {
                                            item.count = module.count
                                            item.countStr = module.countStr
                                            changeIdArr.push(id)
                                        }
                                    }
                                }
                            }
                        }
                        break
                    } else {
                        let relation = self.dataRelation[arr[j]].relation
                        if (relation.length > 0) {
                            let isFind = false
                            for (let k = 0; k < relation.length; k++) {
                                isFind = false
                                let item = relation[k]
                                module = self.resource.get(item.id)
                                if (module.type === 4 && item.id !== arr[j] && temp.stepId === dataOperate.getStepId(self.stepIdMapping, module.stepId)) {
                                    changeIdArr.push(module.id)
                                    isFind = true
                                    if (module.runStatus !== temp.runStatus) {
                                        module.runStatus = temp.runStatus
                                        if (temp.runStatus === '20') {
                                            module.runDate = 1
                                        }
                                        if (module.runStatus === '50') {
                                            self.countMapping[dataOperate.getResourceId(self.rIdMapping, module.rId)] = temp.resultDataTotal
                                            module.count = temp.resultDataTotal
                                            module.countStr = self.$util.string.numberToString(module.count, ',')
                                            if (module.type === 4 && module.isCopyResultSet && module.copyResultSetId && module.copyResultSetId.length > 0) {
                                                for (let id of module.copyResultSetId) {
                                                    let item = self.resource.get(id)
                                                    if (item) {
                                                        item.count = module.count
                                                        item.countStr = module.countStr
                                                        changeIdArr.push(id)
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        if (module.runStatus === '20') {
                                            module.runDate += 1
                                        } else if (module.runStatus === '50') {
                                            self.countMapping[dataOperate.getResourceId(self.rIdMapping, module.rId)] = temp.resultDataTotal
                                            module.count = temp.resultDataTotal
                                            module.countStr = self.$util.string.numberToString(module.count, ',')
                                            if (module.type === 4 && module.isCopyResultSet && module.copyResultSetId && module.copyResultSetId.length > 0) {
                                                for (let id of module.copyResultSetId) {
                                                    let item = self.resource.get(id)
                                                    if (item) {
                                                        item.count = module.count
                                                        item.countStr = module.countStr
                                                        changeIdArr.push(id)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    break
                                }
                            }
                            if (isFind) {
                                break
                            }
                        }
                    }
                }
            }
            self.$store.commit('analys.changeResource', self.resource)
            self.$store.commit('analys.changeCountMapping', self.countMapping)
            this.rebuildCanvas(self, changeIdArr, [])
        } else {
            let arr = []
            for (let i = 0; i < changeIdArr.length; i++) {
                const val = changeIdArr[i]
                let dataRelation = self.dataRelation[val]
                let module = self.resource.get(val)
                let ctx
                if (dataRelation) {
                    // dataRelation.canvas = this.createCanvas({
                    //     w: dataRelation.scope[2],
                    //     h: dataRelation.scope[3],
                    //     isTransparent: true
                    // }).canvas
                    ctx = dataRelation.canvas.getContext('2d')
                } else {
                    dataRelation = self.dataRelation[self.getDataRelationId(val)]
                    // dataRelation.canvas = this.createCanvas({
                    //     w: dataRelation.scope[2],
                    //     h: dataRelation.scope[3],
                    //     isTransparent: true
                    // }).canvas
                    ctx = dataRelation.canvas.getContext('2d')
                }
                // ctx.fillStyle = 'rgba(255, 255, 255, 0)'
                ctx.clearRect(module.scope[0], module.scope[1], module.scope[2], module.scope[3])
                let canvas
                let impactArr
                switch (module.type) {
                    case 1:
                    case 2:
                    case 3:
                        canvas = this.createDataSourceCanvas(module)
                        break
                    case 4:
                        canvas = this.createResultSetCanvas(module)
                        if (!isRebuildRs) {
                            arr.push(val)
                        }
                        break
                    case 5:
                        canvas = this.createRelationCanvas(self, module)
                        // console.log('moduleId : ' + module.id)
                        // console.log(module)
                        // 判断关联关系重新画会影响哪些组件
                        impactArr = _this.relationImpactResource([dataRelation.scope[0] + module.scope[0], dataRelation.scope[1] + module.scope[1], module.scope[2], module.scope[3]], module.id, self)
                        if (arr.length > 0) {
                            if (arr.indexOf(module.id) !== -1) {
                                arr.splice(arr.indexOf(module.id), 1)
                            }
                            for (let i = 0; i < impactArr.length; i++) {
                                if (impactArr[i] !== module.id && arr.indexOf(impactArr[i]) === -1) {
                                    arr.push(impactArr[i])
                                }
                            }
                        } else {
                            arr = impactArr
                        }
                        break
                    case 6:
                        break
                    case 7:
                    case 8:
                        canvas = this.createConditionCanvas(module)
                        break
                    case 9:
                        canvas = this.createResourceAddCanvas(self, module)
                        // 判断关联关系重新画会影响哪些组件
                        impactArr = _this.relationImpactResource([dataRelation.scope[0] + module.scope[0], dataRelation.scope[1] + module.scope[1], module.scope[2], module.scope[3]], module.id, self)
                        if (arr.length > 0) {
                            if (arr.indexOf(module.id) !== -1) {
                                arr.splice(arr.indexOf(module.id), 1)
                            }
                            for (let i = 0; i < impactArr.length; i++) {
                                if (impactArr[i] !== module.id && arr.indexOf(impactArr[i]) === -1) {
                                    arr.push(impactArr[i])
                                }
                            }
                        } else {
                            arr = impactArr
                        }
                        // console.log('arr : ' + arr.join('、'))
                        break
                }
                if (module.type === 4 && !self.dataRelation[module.id]) {
                    let lineStart = calculate.lineStart(module)
                    this.drawLine(ctx, {
                        x0: lineStart.x,
                        y0: lineStart.y,
                        x1: lineStart.x - analysParam.module.resultSet.marginR,
                        y1: lineStart.y
                    })
                }
                this.drawCanvas(ctx, canvas, {
                    sx: 0,
                    sy: 0,
                    sw: module.scope[2],
                    sh: module.scope[3],
                    x: module.scope[0],
                    y: module.scope[1],
                    w: module.scope[2],
                    h: module.scope[3]
                })
            }
            if (arr.length > 0) {
                arr = self.$util.array.unique(arr)
                let newArr = []
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].replace(/\d/g, '') === 'r') {
                        newArr.push(arr.splice(i, 1)[0])
                        i--
                    }
                }
                if (newArr.length > 0) {
                    newArr.sort((a, b) => {
                        const aNum = parseInt(a.replace(/\D/g, ''))
                        const bNum = parseInt(b.replace(/\D/g, ''))
                        return aNum <= bNum
                    })
                    newArr = newArr.concat(arr)
                    if (!isRebuildRs) {
                        this.rebuildCanvas(self, newArr, [], false)
                    }
                } else {
                    newArr = arr
                    this.rebuildCanvas(self, newArr, [], true)
                }
            }
        }
    },
    relationImpactResource (scope, id, self) {
        let keys = Object.keys(self.dataRelation)
        let arr = []
        keys.forEach(val => {
            const dataRelation = self.dataRelation[val]
            let relation = dataRelation.relation
            relation.forEach(rVal => {
                if (rVal.id !== id) {
                    let relationModule = self.resource.get(rVal.id)
                    if (relationModule.type === 5 || relationModule.type === 9) {
                        if (self.$util.formula.graphicsIntersection(scope, [dataRelation.scope[0] + relationModule.scope[0], dataRelation.scope[1] + relationModule.scope[1], relationModule.scope[2], relationModule.scope[3]])) {
                            let isJudge = false
                            for (let j = 0; j < relationModule.lineCoordinate.length; j++) {
                                let line = {
                                    x0: dataRelation.scope[0] + relationModule.scope[0] + relationModule.lineCoordinate[j].x0,
                                    y0: dataRelation.scope[1] + relationModule.scope[1] + relationModule.lineCoordinate[j].y0,
                                    x1: dataRelation.scope[0] + relationModule.scope[0] + relationModule.lineCoordinate[j].x1,
                                    y1: dataRelation.scope[1] + relationModule.scope[1] + relationModule.lineCoordinate[j].y1
                                }
                                if (self.$util.formula.isLineIntersectRectangle(line, {
                                    leftTopX: scope[0],
                                    leftTopY: scope[1],
                                    rightBottomX: scope[0] + scope[2],
                                    rightBottomY: scope[1] + scope[3]
                                })) {
                                    arr.push(rVal.id)
                                    isJudge = true
                                    break
                                }
                            }
                            if (relationModule.type === 5) {
                                if (!isJudge && self.$util.formula.graphicsIntersection(scope, [ dataRelation.scope[0] + relationModule.scope[0] + relationModule.lineCoordinate[3].x1,
                                    dataRelation.scope[1] + relationModule.scope[1] + relationModule.lineCoordinate[3].y0 - analysParam.relation[relationModule.rType].h / 2,
                                    analysParam.relation[relationModule.rType].w,
                                    analysParam.relation[relationModule.rType].h])) {
                                    arr.push(rVal.id)
                                }
                            } else {
                                if (!isJudge && self.$util.formula.graphicsIntersection(scope, [ dataRelation.scope[0] + relationModule.scope[0] + relationModule.lineCoordinate[3].x1,
                                    dataRelation.scope[1] + relationModule.scope[1] + relationModule.lineCoordinate[3].y0 - analysParam.resourceAdd.h / 2,
                                    analysParam.resourceAdd.w,
                                    analysParam.resourceAdd.h])) {
                                    arr.push(rVal.id)
                                }
                            }
                        }
                    } else if (self.$util.formula.graphicsIntersection(scope, [dataRelation.scope[0] + relationModule.scope[0], dataRelation.scope[1] + relationModule.scope[1], relationModule.scope[2], relationModule.scope[3]])) {
                        arr.push(rVal.id)
                    }
                }
            })
        })
        return arr
    },
    /**
     * 判断当前关联关系重新画会对哪些组件照常影响
     * @param {Array} scope 关联关系的范围
     * @param {String} id 关联关系所在的dataRelation的id
     * @param {Object} self center.vue的this对象
     * @returns {Array} 影响的组件id
     */
    isIntersect (scope, id, self) {
        let keys = Object.keys(self.dataRelation)
        let arr = []
        keys.forEach(val => {
            if (id !== val) {
                const dataRelation = self.dataRelation[val]
                let relation = dataRelation.relation
                relation.forEach(rVal => {
                    let relationModule = self.resource.get(rVal.id)
                    if (relationModule.type === 5 || relationModule.type === 9) {
                        if (self.$util.formula.graphicsIntersection(scope, [dataRelation.scope[0] + relationModule.scope[0], dataRelation.scope[1] + relationModule.scope[1], relationModule.scope[2], relationModule.scope[3]])) {
                            let isJudge = false
                            for (let j = 0; j < relationModule.lineCoordinate.length; j++) {
                                let line = {
                                    x0: dataRelation.scope[0] + relationModule.scope[0] + relationModule.lineCoordinate[j].x0,
                                    y0: dataRelation.scope[1] + relationModule.scope[1] + relationModule.lineCoordinate[j].y0,
                                    x1: dataRelation.scope[0] + relationModule.scope[0] + relationModule.lineCoordinate[j].x1,
                                    y1: dataRelation.scope[1] + relationModule.scope[1] + relationModule.lineCoordinate[j].y1
                                }
                                if (self.$util.formula.isLineIntersectRectangle(line, {
                                    leftTopX: scope[0],
                                    leftTopY: scope[1],
                                    rightBottomX: scope[0] + scope[2],
                                    rightBottomY: scope[1] + scope[3]
                                })) {
                                    arr.push(rVal.id)
                                    isJudge = true
                                    break
                                }
                            }
                            if (!isJudge && self.$util.formula.graphicsIntersection(scope, [ dataRelation.scope[0] + relationModule.scope[0] + relationModule.lineCoordinate[3].x1,
                                dataRelation.scope[1] + relationModule.scope[1] + relationModule.lineCoordinate[3].y0 - analysParam.relation[relationModule.rType].h / 2,
                                analysParam.relation[relationModule.rType].w,
                                analysParam.relation[relationModule.rType].h])) {
                                arr.push(rVal.id)
                            }
                        }
                    } else if (self.$util.formula.graphicsIntersection(scope, [dataRelation.scope[0] + relationModule.scope[0], dataRelation.scope[1] + relationModule.scope[1], relationModule.scope[2], relationModule.scope[3]])) {
                        arr.push(rVal.id)
                    }
                })
            }
        })
        return arr
    }
}
