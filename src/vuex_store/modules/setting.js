

import {constantRoutes,asyncRoutes} from '@/router/router.js'

const state = {
    sidebarSetting: false,  
}

const getters = {
    get_sidebarSetting: state => state.sidebarSetting
}

const actions = {
}

const mutations = {
    SET_SIDEBAR: (state, sidebarSetting) => {
        state.sidebarSetting = sidebarSetting
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}