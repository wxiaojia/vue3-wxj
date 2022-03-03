

import {constantRoutes,asyncRoutes} from '@/router/router.js'

// 过滤角色
function filterAsyncRouter(routes, name) {  
    var data = routes.filter(route => {
        return route.meta?.roles && name.some(v => route.meta.roles.includes(v))
    })
    return data
}

const state = {
    routes: [],      // 动态路由
}

const getters = {
    get_routes: state => state.routes
}

const actions = {
    GENERATEROUTES({ commit, state }, roles) {   // 通过角色来过滤路由
        return new Promise((resolve, reject) => {
            var _routes;
            let home = constantRoutes.filter(v => v.path == '/home')[0]
            // let home = constantRoutes
            home.children = []      // 清除子路由
            if (roles.includes('administrator')) {  // 是否为管理员
                home.children = asyncRoutes
            } else {
                let filterRouter = filterAsyncRouter(asyncRoutes, roles)
                home.children = filterRouter
            }

            _routes = [home] || []
            commit('SET_ROUTES', _routes)
            resolve(_routes)
        })
    }
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.routes = routes
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}