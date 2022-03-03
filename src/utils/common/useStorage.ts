
import { split } from 'lodash'
import { ref, watchEffect } from 'vue'

export enum StorageType{
    local,
    session,
    cookie
}

export function useLocalStorage(name: any, value = []) {
    let data = ref(JSON.parse(localStorage.getItem(name)) ?? value)
    watchEffect(() => {
        localStorage.setItem(name, JSON.stringify(data.value))
    })
    return data
}

function getCookieKey () {
  const cookieStr = document.cookie.split(';')
  let paramsObj:any = {};
  // 将 params 存到对象中
  cookieStr.forEach(param => {
    if (/=/.test(param)) { // 处理有 value 的参数
      let [key, val] = param.split('='); // 分割 key 和 value
      if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else { // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else { // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  })
  return paramsObj
}



export function getStorage(key: string, type: StorageType = StorageType.local): any {
  if (type === StorageType.local) {
    return localStorage.getItem(key)
  } else if (type === StorageType.session) {
    return sessionStorage.getItem(key)
  } else {
    if (document.cookie.indexOf(key)) {
      const obj = getCookieKey()
      return obj.key
    }
    return 
  }
}

export function setStorage(key: string, value: any, type: StorageType = StorageType.local,): any {
  if (type === StorageType.local) {
    return localStorage.setItem(key, value)
  } else if (type === StorageType.session) {
    return sessionStorage.setItem(key, value)
  } else {
    document.cookie = document.cookie ? `${document.cookie};${key}=${value}` : `${key}=${value}`
    return 
  }
}


// use:
// let todos = useLocalStorage('todos', [])
// let todos = useSessionStorage('todos', [])


// 对于token超时思路：设置缓存key时，将value包装成一个对象，对象中有相应的时效时段，
// 当下一次想获取缓存值时，判断有无超时，不超时就获取value，超时就删除这个缓存
