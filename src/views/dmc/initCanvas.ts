import util from './util.js'
import Circle from './class/filter.js'


export default function useInitCanvas(state, canvasContextmenu) {
    // 初始化 画布的大小
    const initCanvasParam = () => {
        const canvasOut = document.getElementById('canvasOut') as HTMLElement
        state.canvasParam.w = canvasOut.clientWidth
        state.canvasParam.h = canvasOut.clientHeight
        state.canvasParam.left = canvasOut.offsetLeft
        state.canvasParam.top = canvasOut.offsetTop

        state.canvas = document.getElementById('canvas')
        state.canvas.width = state.canvasParam.w
        state.canvas.height = state.canvasParam.h

        state.canvasParam.ctx = state.canvas.getContext('2d')

        state.gridArr = []
        state.gridArr = util.changeGridSize(state.gridArr, {w: state.canvasParam.w, h: state.canvasParam.h})
        // initCanvas()

        state.canvas.addEventListener('contextmenu', canvasContextmenu, false)

    }


    // 过滤圈圈，可以拖动（拖一次加一个）
    const initFilterCanvas = () => {
        try {
            let ctx = (document.getElementById('filterCir') as HTMLElement).getContext('2d')
            initFilter(ctx, { x: 35, y: 30}) 
        } catch (err) {

        }
    }

    // 数据过滤圆圈
    const initFilter = (ctx, {x, y}) => {
        let cir = new Circle({x, y})

        ctx.beginPath()
        ctx.fillStyle = '#1a95e9'
        ctx.arc(x, y, cir.radius, 0, 2 * Math.PI)
        ctx.fill()
        ctx.font = cir.font
        ctx.fillStyle = cir.fillStyle
        ctx.textAlgin = cir.textAlgin
        ctx.textBaseInline = cir.textBaseInline
            //   此处没有考虑多行，这是两行的
        ctx.fillText(cir.filterText[0], x - cir.radius / 2, y - cir.radius / 4 * 1)
        ctx.fillText(cir.filterText[1], x - cir.radius / 2, y + cir.radius / 4 * 2)
        ctx.closePath()
    }
    return {
        initCanvasParam,
        initFilterCanvas
    }
}