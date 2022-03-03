import { createApp } from 'vue'
import App from './App.vue'

import './index.scss'
import './index.css'

// 注册自己写的组件
// import MyContainer from 'components/MyElement/container'
import './permission'

import './styles/index.scss'
import lazyPlugin from 'directive/Lazy.js'
import watermarkDirective from 'directive/mutationObserver/index'

import router from '@/router/router.js'

import installElementPlus from './plugins/element'
//路由拦截
import store from '@/store/index.ts'

const app = createApp(App)

installElementPlus(app)

app.use(router)
    .use(store)
    .use(lazyPlugin)
    .directive('watermark', watermarkDirective)
    .mount('#app')

// require('./permission.js')
// import { ElAlert } from 'element-plus';

// const components = [
//     ElAlert
// ]

// const plugins = [
//     ElInfiniteScroll
// ]

// components.forEach(component => {
//     app.component(component.name, component)
// })
  
// plugins.forEach(plugin => {
//     app.use(plugin)
// }) 

// // 如果 webpack 开启了热更新（也就是热替代），那么，第一个参数是接受的发生更新的文件，第二个是当文件更新后触发的回调函数
// if(module.hot) {
//     module.hot.accept('./assets/js/log.js', (arr) => {
//         console.log('aaaa')
//     })
// }

