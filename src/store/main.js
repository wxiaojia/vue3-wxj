import { defineStore } from 'pinia'

export const useMainStore = defineStore({
  id: 'main',
  state: () =>({
    sidebarSetting: false,
  }),
  getters: {
  },

  actions: {
    async SET_SIDEBAR(data){
        // 可以做异步
        // await doAjaxRequest(data);
        this.sidebarSetting = data;
      }
  },
})
