import { defineStore } from 'pinia'
import {userInfo,logout} from '@/api/http.js'

export let useUserStore = defineStore({
  id: 'user',
  state: () =>({
      roles: []
  }),
  getters: {},

  actions: {
    async userinfo(){
        return new Promise((resolve,reject)=>{
            userInfo().then(res=>{
                console.log(res);
                let {data} = res.data;
                this.roles = data.roles
            }).catch(error=>{
                reject(error)
            })
        })
    },
     // user logout
    async logout() {
        return new Promise((resolve, reject) => {
        logout().then(() => {
            this.roles = []
            resolve()
        }).catch(error => {
            reject(error)
        })
        })
    },
    updateRoles(roles) {
      this.roles = roles
    }
  },

   // 开启数据缓存
   persist: {
    enabled: true,
    strategies: [
        {
         key: 'roles',
         paths: ['roles'],      // 持久化字段
          storage: localStorage,    // 存在哪里，默认是再session中
        }
      ]
  }
})
