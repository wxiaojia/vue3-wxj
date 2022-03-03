import type { Directive, App } from 'vue'

interface Value {
    font?: string,
    textColor?: string,
    text?: string
}

const waterMarkId = 'waterMark'
const canvasId = 'can'

const drawWatermark = (el: HTMLElement, value: Value) => {
    const {
        font = '16px Microsoft JhengHei',
        textColor = 'rgba(180, 180, 180, 0.3)',
        text = 'wxj干巴爹',
      } = value

    // 创建一个canvas画布
    const canvas = document.getElementById('canvasId') as HTMLCanvasElement

    // canvas 已经存在就不在乎创建
    const can = canvas || document.createElement('canvas')
    can.id = canvasId
    el.appendChild(can)

    // 设置框高
    can.width = 400
    can.height = 200
    can.style.display = 'none'
    // 用在赋值的内容后时，使null和undefined类型可以赋值给其他类型并通过编译，表示该变量值可空，后面就不会报错
    const ctx = can.getContext('2d')!

      // 设置画布的样式
    ctx.rotate((-20 * Math.PI) / 180)
    ctx.font = font
    ctx.fillStyle = textColor
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, can.width / 3, can.height / 2)

    // 水印容量
    const waterMarkDiv = document.createElement('div')
    waterMarkDiv.id = waterMarkId

     // 设置容器的属性样式
    // 将刚刚生成的canvas内容转成图片，并赋值给容器的 background-image 样式
    const styleStr = `
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        pointer-events: none;
        background-image: url(${can.toDataURL('image/png')})
    `
    waterMarkDiv.setAttribute('style', styleStr)

    // 将水印容器放到目标元素下
    el.appendChild(waterMarkDiv)

    return styleStr

}

const watermarkDirective: Directive = {
  mounted(el, { value }) {
    // 接收styleStr，后面可以用来对比
    el.waterMarkStylestr = drawWatermark(el, value)

    el.observer = new MutationObserver(() => {
      const instance = document.getElementById(waterMarkId)
      const style = instance?.getAttribute('style')

      const { waterMarkStylestr } = el
      // 样式更改 ｜ 删除节点
      if ((instance && style != waterMarkStylestr) || !instance) {
        if(instance) {
          // div还在，说明只是修改style
          instance.setAttribute('style', waterMarkStylestr)
        } else {
          drawWatermark(el, value)
        }
      }
    })

    // 启动监控
    el.observer.observe(document.body, {
      childList: true,
      attributes: true,
      subtree: true,
    })
  },
  unmounted(el) {
    console.log('水印', el, el.observer)
     // 指定元素销毁时，记得停止监控
    el.observer.disconect()
    el.observer = null
  }
}

export default watermarkDirective