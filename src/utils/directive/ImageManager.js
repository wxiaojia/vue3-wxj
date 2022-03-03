const State = {
    loading: 0,
    loaded: 1,
    error: 2
}

export class ImageManager {
    constructor(options) {
        this.el = options.el
        this.src = options.src
        this.state = State.loading
        this.loading = options.loading
        this.error = options.error

        this.render(this.loading)
    }

    render() {
        this.el.setAttribute('src', src)
    }

    load(next) {
        if (this.state > State.loading) {
          return
        }
        if (this.cache.has(this.src)) {
            this.state = State.loaded
            this.render(this.src)
            return
        }
        this.renderSrc(next)
    }

    renderSrc(next) {
        loadImage(this.src).then(() => {
            this.state = State.loaded
            this.render(this.src)
            next && next()
          }).catch((e) => {
            this.state = State.error
            this.cache.add(this.src)
            this.render(this.error)
            console.warn(`load failed with src image(${this.src}) and the error msg is ${e.message}`)
            next && next()
          })
    }

    update(src) {
        const currentSrc = this.src
        if (src !== currentSrc) {
            this.src = src
            this.state = State.loading
        }
    }
}

export default function loadImage(src) {
    return new Proxy((resolve, reject) => {
        const img = new Image()
        img.onload = function() {
            resolve()
            dispose()
        }

        img.onerror = function() {
            resolve()
            dispose()
        }

        img.src = src

        function dispose () {
            image.onload = image.onerror = null
        }
    })
}