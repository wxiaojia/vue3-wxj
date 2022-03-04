import { createRouter, createWebHashHistory } from 'vue-router'

import getData from './module/getData.js'
import aboutCss from './module/about_css.js'
import dmc from './module/dmc.js'
import complate from './module/complate.js'
import promise from './module/promise.js'

export const asyncRoutes = [
  {
    path: '/index',
    name: 'index',
    meta:{ title:'首页', roles:['admin'] },
    component: () => import('@/views/Home/home/index.vue')
  },
  getData,
  aboutCss,
  dmc,
  complate,
  promise,
  {
    path: '/readingProgress',
    name: 'readingProgress',
    meta: {title: '阅读进度', roles:['admin']},
    component: () => import('@/views/readingProgress/index.vue'),
  },
  {
    path: '/slot',
    name: 'slot',
    meta:{title:'slot',roles:['admin','approve']},
    component: () => import('@/views/slot/index.vue')
  }, 
  {
    path: '/splitFileUpload',
    name: 'splitFileUpload',
    meta:{title:'大文件切片上传',roles:['admin','approve']},
    component: () => import('@/views/splitFileUpload/index.vue')
  },
  {
    path: '/animation',
    name: 'animation',
    meta:{title:'动画的',roles:['admin','approve']},
    component: () => import('@/views/animation/index.vue'),
    children: [
      {
        path: 'table',
        name: 'table',
        meta:{title:'表格滚动',roles:['admin','approve']},
        component: () => import('@/views/animation/table.vue'),
      }
    ]
  },
];


export const constantRoutes = [  //常规配置
  {
    path: '/',
    redirect:'/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect:'/index',
    meta:{title:'首页'},
    component: () => import('@/layout/index.vue'),
    children:[
      {
        path: '/index',
        name: 'index',
        meta:{ title:'首页' },
        component: () => import('@/views/Home/home/index.vue')
      }, 
      ...asyncRoutes
    ]
  },
] 


const router = createRouter({
    history:  createWebHashHistory(),
    routes: constantRoutes
})


export default router;