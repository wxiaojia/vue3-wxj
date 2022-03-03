/*
 * @Author: wxiaojia 
 * @Date: 2021-11-24 22:52:05 
 * @Last Modified by: wxiaojia
 * @Last Modified time: 2022-03-03 16:46:59
 */


import { createStore } from 'vuex'

import user from './modules/user.js'
import permission from './modules/permission.js'
import setting from './modules/setting.js'


const store = createStore({
    modules: {
        permission,
        user,
        setting
    }
})

export default store;