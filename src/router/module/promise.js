const promise =  {
    path: '/promise',
    name: 'promise',
    meta:{title:'有关promise',roles:['admin','approve']},
    component: () => import('@/views/promise/index.vue'),
    children:  [
      {
        path: 'request',
        name: 'request',
        meta:{title:'多请求控制并发量',roles:['admin','approve']},
        component: () => import('@/views/promise/request.vue')
      },
    ]
  }

  export default promise