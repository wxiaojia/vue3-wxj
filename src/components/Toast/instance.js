import { createApp } from 'vue';
import Toasts from './toasts.vue'
import Bus from './toastsBus.js'

// 这里我们需要定义一个数组来存放当前存活的 toasts
let instances = []
let seed = 1

const toasts = (options) => {
    // 创建容器
    const id = `toasts_${seed++}`
    const root = document.createElement('div')
    root.setAttribute('data-id', id)
    document.body.append(root)

    // 创建toast实例
    let ToastsConstructor = createApp(Toasts, options)
    // 挂载父亲元素
    let instance = ToastsConstructor.mount(root)
    // 给实例加入唯一标识符
    instance.id = id    // (id哪来的)
    // 显示实例
    instance.visible = true

    // 重制高度
    let verticalOffset = 0
    // 遍历获取当前已存活的 toasts 高度及其间隙 累加
    instances.forEach(item => {
        verticalOffset += item.$el.offsetHeight + 16
    })
    // 累加本身需要的间隙
    verticalOffset += 16
    // 赋值当前实例y轴方向便宜长度
    instance.toastPosition.y = verticalOffset

    // 监听toasts传来的关闭事件(每一个实例都有这么哟个监听的)
    Bus.$on('closed', (id) => {
        // 因为这里会监听到所有的 ‘closed’ 事件, 所以要匹配 id 确保
        if (instance.id == id) {
             // 调用删除逻辑
             removeInstance(instance)
             // 在 <body> 上删除dom元素
             document.body.removeChild(root)
             // 销毁实例
             ToastsConstructor.unmount();
        }
    })

    instances.push(instance)
    
    // 抛出实例本身给vue
    return instance
}

export default toasts;


// 删除逻辑
const removeInstance = (instance) => {
    // 从instances中删除，修改后面的instance的y位置

    if (!instance) return
    let len = instances.length
    // 找出当前需要销毁的下标
    const index = instances.findIndex(item => {
        return item.id === instance.id
    })
    // 从数组中删除
    instances.splice(index, 1)

     // 如果当前数组中还存在存活 Toasts, 需要遍历将下面的Toasts上移, 重新计算位移
     if (len <= 1) return
     // 获取被删除实例的高度
     const h = instance.height
     // 遍历被删除实例以后下标的 Toasts
     for (let i = index; i < len - 1; i++) {
         // 公式: 存活的实例将本身的 y 轴偏移量减去被删除高度及其间隙高度
         instances[i].toastPosition.y = parseInt(instances[i].toastPosition.y - h - 16)
     }


}
