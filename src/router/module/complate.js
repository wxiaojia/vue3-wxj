const complate = {
    path: '/complate',
    name: 'complate',
    meta:{title:'我的组件',roles:['admin','approve']},
    component: () => import('@/views/complate/index.vue'),
    children:[  
      {
        path: 'countDown',
        name: 'countDown',
        meta: {title: '倒计时', roles:['admin']},
        component: () => import('@/views/complate/countDown.vue'),
      },
      {
        path: 'rate',
        name: 'rate',
        meta:{title:'评分',roles:['admin','approve']},
        component: () => import('@/views/complate/rate.vue')
      },
      {
        path: 'tree',
        name: 'tree',
        meta:{title:'树-菜单',roles:['admin','approve']},
        component: () => import('@/views/complate/myTree.vue')
      },
    ]
  }

export default complate