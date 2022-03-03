
import {userInfo,logout} from '@/api/http.js'


const state = {
    roles: []
}

const getters = {
    roles:state =>state.roles
}

const actions = {
    userinfo({commit}){
        return new Promise((resolve,reject)=>{
            userInfo().then(res=>{
                console.log(res);
                let {data} = res.data;
                commit('SETROLES',data.roles)
                resolve(data);
            }).catch(error=>{
                reject(error)
            })
        })
    },
     // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
        logout().then(() => {
            commit('SETROLES', [])
            resolve()
        }).catch(error => {
            reject(error)
        })
        })
    }
}

const mutations = {
    SETROLES:(state,d)=>{
        state.roles = d;
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}