const getData = {
    path: '/getData', // 多数据渲染
    name: 'getData',
    meta:{title:'多数据渲染', roles:['admin']},
    component: () => import('@/views/getManyData/index.vue'),
    children:[  
        {
            path: 'getManyData',
            name: 'fakeList2',
            meta: {title: '多数据渲染', roles:['admin']},
            component: () => import('@/views/getManyData/fakeList2.vue')
        },
        {
            path: 'fakeList',
            name: 'fakeList',
            meta: {title: '多数据渲染-虚拟列表', roles:['admin']},
            component: () => import('@/views/getManyData/fakeList.vue')
        },
        {
            path: 'lazyload',
            name: 'lazyload',
            meta: {title: '多数据渲染-直接渲染之图片懒加载', roles:['admin']},
            component: () => import('@/views/getManyData/lazyload.vue')
        },
        {
            path: 'observer',
            name: 'observer',
            meta: {title: 'IntersectionObserver', roles:['admin']},
            component: () => import('@/views/getManyData/IntersectionObserver.vue')
        },
        
    ]
}

export default getData