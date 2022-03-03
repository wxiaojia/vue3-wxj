
const DEFAULT_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'


export class Lazy {
  constructor(options) {
    this.managerQueue = []          // 懒加载数组？？？
    this.initIntersectionObserver() // 监听是否到达可视区域？？
    this.cache = new Set()
    
    this.loading = options?.loading || DEFAULT_URL
    this.error = options?.error || DEFAULT_URL
  }

  add(el, binding) {
    const src = binding.value

    const manager = new ImageManager({
      el,
      src,
      loading: this.loading,
      error: this.error,
      cache: this.cache
    })
    
    this.managerQueue.push(manager)
    
    this.observer.observe(el)
  }

  initIntersectionObserver() {
    // IntersectionObserverAPI 自动"观察"元素是否可见
    new IntersectionObserver(entries => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const manager = this.managerQueue.find((manager) => {
            return manager.el === entry.target
          })
          if (manager) {
            if (manager.state === State.loaded) {
              this.removeManager(manager)
              return
            }
            manager.load()
          }
        }
      })
    }, {
      rootMargin: '0px',
      threshold: 0
    })
  }

  removeManager() {
    const index = this.managerQueue.indexOf(manager)
    if (index > -1) {
      this.managerQueue.splice(index, 1)
    }
    if (this.observer) {
      this.observer.unobserve(manager.el)
    }
  }

  remove(el) {
    const manager = this.managerQueue.find((manager) => {
      return manager.el === el
    })
    if (manager) {
      this.removeManager(manager)
    }
  }
  update(el, binding) {
    const src = binding.value

    const manager = this.managerQueue.find((manager) => {
      return manager.el === el
    })
    if (manager) {
      manager.update(src)
    }
  }

}

const lazyPlugin = {
    install (app, options) {
      const lazy = new Lazy(options)

      app.directive('lazy', {
        mounted: lazy.add.bind(lazy),
        remove: lazy.remove.bind(lazy),
        update: lazy.update.bind(lazy)
      })
    }
  }
  
  export default lazyPlugin