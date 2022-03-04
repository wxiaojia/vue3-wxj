const dmc = {
    path: '/dmc',
    name: 'dmc',
    meta: {title: 'canvas', roles:['admin']},
    component: () => import('@/views/canvas/index.vue'),
    children:[  
      {
        path: 'dmc',
        name: 'dmc',
        meta: {title: '数据魔方', roles:['admin']},
        component: () => import('@/views/dmc/index.vue'),
      },
      // {
      //   path: 'drag',
      //   name: 'drag',
      //   meta:{title:'拖拽',roles:['admin','approve']},
      //   component: () => import('@/views/canvas/drag/index.vue')
      // }, 
      {
        path: 'guaguale',
        name: 'guaguale',
        meta:{title:'刮刮乐',roles:['admin','approve']},
        component: () => import('@/views/canvas/guaguale/index.vue')
      },
      {
        path: 'clock',
        name: 'clock',
        meta:{title:'会动的钟',roles:['admin','approve']},
        component: () => import('@/views/canvas/clock/index.vue')
      },
    ]
  }

export default dmc