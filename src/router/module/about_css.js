const aboutCss = {
    path: '/aboutCss',
    name: 'aboutCss',
    meta: {title: '关于css的', roles:['admin']},
    component: () => import( '@/views/css-resize/index.vue'),
    children:[  
      {
        path: 'cssResize',
        name: 'cssResize',
        meta: {roles: ['admin'], title: '图片过度'},
        component: () => import( '@/views/css-resize/keyframes.vue'),
      },
      {
        path: 'transition',
        name: 'transition',
        meta:{title:'拖拽',roles:['admin','approve']},
        component: () => import( '@/views/css-resize/transition.vue')
      },
      {
        path: 'bindCss',
        name: 'bindCss',
        meta:{title:'css变量',roles:['admin','approve']},
        component: () => import( '@/views/css-resize/bindCss.vue')
      },
      {
        path: 'strangeShapes',
        name: 'strangeShapes',
        meta: {title: '图形', roles: ['admin']},
        component: () => import( '@/views/css-resize/strangeShapes.vue')
      },
    ]
  }

  export default aboutCss