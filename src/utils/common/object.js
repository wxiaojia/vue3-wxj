export default {
    // 对象拷贝
    deepCopy (p, d) {
        let c
        if (p instanceof Array) {
            c = d || []
        } else {
            c = d || {}
        }
        for (let i in p) {
            if (i !== 'canvas' && typeof p[i] === 'object' && p[i] !== null) {
                c[i] = (p[i].constructor === Array) ? [] : {}
                this.deepCopy(p[i], c[i])
            } else {
                c[i] = p[i]
            }
        }
        return c
    },
    /**
     *  es6 Map
     *  json对象转Map对象
     */
    jsonToMap (obj) {
        let newMap = new Map()
        for (let k of Object.keys(obj)) {
            newMap.set(k, obj[k])
        }
        return newMap
    },
    /**
     * es6 Map转json对象
     * @param {Map} map
     */
    mapToJson (map) {
        let obj = {}
        for (let [key, value] of map) {
            obj[key] = value
        }
        return obj
    },
    compare (propertyName) {
        return (object1, object2) => {
            let value1 = parseFloat(object1[propertyName])
            let value2 = parseFloat(object2[propertyName])
            if (value2 < value1) {
                return 1
            } else if (value2 > value1) {
                return -1
            } else {
                return 0
            }
        }
    },
    compareByDesc (propertyName) {
        return (object1, object2) => {
            let value1 = parseFloat(object1[propertyName])
            let value2 = parseFloat(object2[propertyName])
            if (value2 < value1) {
                return -1
            } else if (value2 > value1) {
                return 1
            } else {
                return 0
            }
        }
    },
    merge (target) {
        for (let i = 1, j = arguments.length; i < j; i++) {
            let source = arguments[i] || {}
            for (let prop in source) {
                if (source.hasOwnProperty(prop)) {
                    let value = source[prop]
                    if (value !== undefined) {
                        target[prop] = value
                    }
                }
            }
        }
        return target
    }
}
