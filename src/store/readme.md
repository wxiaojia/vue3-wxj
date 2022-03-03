# Pinia.js 有如下特点：
完整的 typescript 的支持；
足够轻量，压缩后的体积只有1.6kb;
去除 mutations，只有 state，getters，actions（这是我最喜欢的一个特点）；
actions 支持同步和异步；
没有模块嵌套，只有 store 的概念，store 之间可以自由使用，更好的代码分割；
无需手动添加 store，store 一旦创建便会自动添加；

# state 也可以使用解构，但使用解构会使其失去响应式，这时候可以用 pinia 的 storeToRefs。

import { storeToRefs } from 'pinia'
const { name } = storeToRefs(userStore)

# 异步action 
action 可以像写一个简单的函数一样支持 async/await 的语法，让你愉快的应付异步处理的场景。
```javascript
export const useUserStore = defineStore({
  id: 'user',
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd)
      return data
    }
  }
})
```

# action间的互相调用
```javascript
 export const useUserStore = defineStore({
  id: 'user',
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd)
      this.setData(data) // 调用另一个 action 的方法
      return data
    },
    setData(data) {
      console.log(data)
    }
  }
})
```

# 调用其他action
```javascript
import { useAppStore } from './app'
export const useUserStore = defineStore({
  id: 'user',
  actions: {
    async login(account, pwd) {
      const { data } = await api.login(account, pwd)
      const appStore = useAppStore()
      appStore.setData(data) // 调用 app store 里的 action 方法
      return data
    }
  }
})
```

# 持久化， pinia-plugin-persist 
这个好，可以存本项目中的roles, 这个可以规定事件内删除吗？

```javascript
 // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
    {
      key: 'my_user',
        paths: ['roles'],      // 持久化字段
      storage: localStorage,  // 存储位置，默认是sessionStorage
    }
  ]
    }
  ```