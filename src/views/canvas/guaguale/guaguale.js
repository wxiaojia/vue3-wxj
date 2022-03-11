import { ref } from 'vue'


export default function createGua () {
    const leftSide = 300
    const canvas = document.getElementById('canvasGua')
    const ctx = canvas.getContext('2d')

    // 填充的颜色
    ctx.fillStyle = 'darkgray'
    // 填充矩形 fillRect(起始X,起始Y,终点X,终点Y)
    ctx.fillRect(0, 0, 400, 100)
    ctx.fillStyle = '#fff'
    // 绘制填充文字
    ctx.fillText('刮刮卡', 180, 50)

    // var span = document.getElementById("span")
    // var arr = ["100元", '谢谢惠顾', '200元', '谢谢惠顾', '谢谢惠顾', '谢谢惠顾', '500万', '谢谢惠顾']
    // var num = Math.floor(Math.random() * (arr.length - 1))
    // var text = arr[num]
    // span.innerHTML = text

    let isDraw = ref(false)
    canvas.onmousedown = function () {
        isDraw.value = true
    }
    canvas.onmousemove = function (e) {
        if (!isDraw.value) return
        // 计算鼠标在canvas里的位置
        const x = e.pageX - canvas.offsetLeft - leftSide
        const y = e.pageY - canvas.offsetTop
        // 设置globalCompositeOperation，图形合成globalCompositeOperation 属性使用‘destination-out’，用来抹除重叠的部分
        ctx.globalCompositeOperation = 'destination-out'
        // 画圆
        ctx.arc(x, y, 10, 0, 2 * Math.PI)
        // 填充圆形
        ctx.fill()
    }
    canvas.onmouseup = function () {
        isDraw.value = false
    }
}