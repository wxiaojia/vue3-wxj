import { createRouter, createWebHashHistory } from 'vue-router'

export const asyncRoutes = [
  {
    path: '/index',
    name: 'index',
    meta:{ title:'首页', roles:['admin'] },
    component: () => import( '../views/Home/home/index.vue')
  },
  {
    path: '/getData', // 多数据渲染
    name: 'getData',
    meta:{title:'多数据渲染', roles:['admin']},
    component: () => import( '../views/getManyData/index.vue'),
    children:[  
      {
        path: 'getManyData',
        name: 'fakeList2',
        meta: {title: '多数据渲染', roles:['admin']},
        component: () => import( '../views/getManyData/fakeList2.vue')
      },
      {
        path: 'fakeList',
        name: 'fakeList',
        meta: {title: '多数据渲染-虚拟列表', roles:['admin']},
        component: () => import( '../views/getManyData/fakeList.vue')
      }
    ]
  },
  {
    path: '/aboutCss',
    name: 'aboutCss',
    meta: {title: '关于css的', roles:['admin']},
    component: () => import( '../views/css-resize/index.vue'),
    children:[  
      {
        path: 'cssResize',
        name: 'cssResize',
        meta: {roles: ['admin'], title: '图片过度'},
        component: () => import( '../views/css-resize/keyframes.vue'),
      },
      {
        path: 'transition',
        name: 'transition',
        meta:{title:'拖拽',roles:['admin','approve']},
        component: () => import( '../views/css-resize/transition.vue')
      },
      {
        path: 'bindCss',
        name: 'bindCss',
        meta:{title:'css变量',roles:['admin','approve']},
        component: () => import( '../views/css-resize/bindCss.vue')
      },
      {
        path: 'strangeShapes',
        name: 'strangeShapes',
        meta: {title: '图形', roles: ['admin']},
        component: () => import( '../views/css-resize/strangeShapes.vue')
      },
    ]
  },
  {
    path: '/dmc',
    name: 'dmc',
    meta: {title: 'canvas', roles:['admin']},
    component: () => import( '../views/canvas/index.vue'),
    children:[  
      {
        path: 'dmc',
        name: 'dmc',
        meta: {title: '数据魔方', roles:['admin']},
        component: () => import( '../views/dmc/index.vue'),
      },
      // {
      //   path: 'drag',
      //   name: 'drag',
      //   meta:{title:'拖拽',roles:['admin','approve']},
      //   component: () => import( '../views/canvas/drag/index.vue')
      // },
      {
        path: 'guaguale',
        name: 'guaguale',
        meta:{title:'刮刮乐',roles:['admin','approve']},
        component: () => import( '../views/canvas/guaguale/index.vue')
      },
      {
        path: 'clock',
        name: 'clock',
        meta:{title:'会动的钟',roles:['admin','approve']},
        component: () => import( '../views/canvas/clock/index.vue')
      },
    ]
  },
  {
    path: '/readingProgress',
    name: 'readingProgress',
    meta: {title: '阅读进度', roles:['admin']},
    component: () => import( '../views/readingProgress/index.vue'),
    // children: [
    //   {
    //     path: 'readingProgress',
    //     name: 'readingProgress',
    //     meta: {roles:['admin'], title: 'js控制'},
    //     component: () => import( '../views/readingProgress/index.vue')
    //   },
      // {
      //   path: 'txt',
      //   name: 'readingProgressTxt',
      //   meta: {roles:['admin'], title: ''},
      //   component: () => import( '../views/readingProgress/txt.vue')
      // },
    // ]
  },
  {
    path: '/slot',
    name: 'slot',
    meta:{title:'slot',roles:['admin','approve']},
    component: () => import( '../views/slot/index.vue')
  }, {
    path: '/complate',
    name: 'complate',
    meta:{title:'我的组件',roles:['admin','approve']},
    component: () => import( '../views/complate/index.vue'),
    children:[  
      {
        path: 'countDown',
        name: 'countDown',
        meta: {title: '倒计时', roles:['admin']},
        component: () => import( '../views/complate/countDown.vue'),
      },
      {
        path: 'rate',
        name: 'rate',
        meta:{title:'评分',roles:['admin','approve']},
        component: () => import( '../views/complate/rate.vue')
      },
      {
        path: 'tree',
        name: 'tree',
        meta:{title:'树-菜单',roles:['admin','approve']},
        component: () => import( '../views/complate/myTree.vue')
      },
    ]
  }, 
  {
    path: '/splitFileUpload',
    name: 'splitFileUpload',
    meta:{title:'大文件切片上传',roles:['admin','approve']},
    component: () => import( '../views/splitFileUpload/index.vue')
  },
  {
    path: '/promise',
    name: 'promise',
    meta:{title:'有关promise',roles:['admin','approve']},
    component: () => import( '../views/promise/index.vue'),
    children:  [
      {
        path: 'request',
        name: 'request',
        meta:{title:'多请求控制并发量',roles:['admin','approve']},
        component: () => import( '../views/promise/request.vue')
      },
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
    component: () => import( '../views/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    redirect:'/index',
    meta:{title:'首页'},
    component: () => import( '../layout/index.vue'),
    children:[
      {
        path: '/index',
        name: 'index',
        meta:{ title:'首页' },
        component: () => import( '../views/Home/home/index.vue')
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