import Toast from './toasts.vue'
import toast from './instance.js'


export default (app) => {
    // 注册组件
    app.component(Toast.name, Toast)
     // 注册全局变量, 后续只需调用 $Toast({}) 即可
    app.config.globalProperties.$Toast = toast
}