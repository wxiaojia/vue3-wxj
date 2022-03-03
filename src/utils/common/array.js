export default {
    /**
     * 数组求和
     */
    sum (arr) {
        let count = 0
        if (arr instanceof Array) {
            for (let i = 0; i < arr.length; i++) {
                if (typeof arr[i] === 'string' || typeof arr[i] === 'number') {
                    count += parseFloat(arr[i])
                }
            }
        }
        return count
    },
    addItem (arr, number) {
        if (arr instanceof Array) {
            for (let i = 0; i < number; i++) {
                arr.push([])
            }
            return arr
        }
        return arr
    },
    /**
     * 数组每项的值为空则用_now对应的值替换
     */
    replaceItem (_old, _now) {
        if (_old instanceof Array && _now instanceof Array) {
            for (let i = 0; i < _old.length; i++) {
                if (this.$util.string.isEmpty(_old[i]) && _now.length > i) {
                    _old[i] = _now[i]
                }
            }
        }
        return _old
    },
    /**
     * @func
     * @desc 对象数组过滤
     * @param {Array} srcArray - 来源数组
     * @param {Array} tarArray - 目标数组
     * @param {String} srcProperty - 来源数组每个元素的属性，该属性是唯一的
     * @param {String} tarProperty - 目标数组每个元素的属性，该属性是唯一的
     * @return {Array} 返回过滤后的数组
     */
    arrDedupe (srcArray, tarArray, srcProperty, tarProperty) {
        if (!(srcArray instanceof Array) || !(tarArray instanceof Array)) {
            return
        }
        let tmpArr = []
        for (let i of srcArray) {
            let isExit = false
            for (let j of tarArray) {
                if (i[srcProperty] === j[tarProperty]) {
                    isExit = true
                }
            }
            if (!isExit) {
                tmpArr.push(i)
            }
        }
        return tmpArr
    },
    /**
     * 数组去重复
     * @param arr {type=Array} 要去重复的数组
     */
    unique (arr) {
        let result = []
        let hash = {}
        for (let i = 0, elem; (elem = arr[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem)
                hash[elem] = true
            }
        }
        return result
    },
    /**
     * 判断数组值是否重复
     * @param {Array} arr 要判断值是否重复的数组
     * @param {String} name 数组的值如果都是对象则传递需要判断的属性名称
     */
    repeat (arr, name = '') {
        if (arr.length === 0) {
            return false
        }
        let isRepeat = false
        let result = {}
        if (name === '') {
            arr.forEach((val) => {
                if (result.hasOwnProperty(val)) {
                    isRepeat = true
                    return
                }
                result[val] = true
            })
        } else {
            arr.forEach((val) => {
                if (result.hasOwnProperty(val[name])) {
                    isRepeat = true
                    return
                }
                result[val[name]] = true
            })
        }
        return isRepeat
    },
    /**
     * 给数组添加数组中不存在的值
     * @param {Array}} arr 待添加值的数组
     * @param {String} val 待添加的值
     */
    addNew (arr, val) {
        if (arr.indexOf(val) === -1) {
            arr.push(val)
        }
        return arr
    },
    /**
     * 模型坐标排序
     * @param {Array} arr 要排序的数组
    */
    moduleScopeSort (arr = []) {
        if (arr.length <= 1) {
            return arr
        }
        return arr.sort((a, b) => {
            if (a[0] === b[0]) {
                return a[1] >= b[1]
            }
            return a[0] >= b[0]
        })
    },
    /**
     * 对象数组通过属性排序
     * @param {Array} arr 要排序的数组
     * @param {Function} condition 判断排序的条件函数
     * @param {String} order 升序还是降序
     */
    sortByField (arr, condition1, condition2, order = 'asc') {
        arr.sort((a, b) => {
            if (order === 'asc') {
                if (condition1(a) === condition1(b)) {
                    return condition2(a) - condition2(b)
                }
                return condition1(a) - condition1(b)
            } else {
                if (condition1(b) === condition1(a)) {
                    return condition2(b) - condition2(a)
                }
                return condition1(b) - condition1(a)
            }
        })
        return arr
    },
    /**
     * 修改
     * @param {Array} grid 画布栅格化数组 500*500
     * @param {Object} now 改变后的画布宽度高度对象
     * @param {Object} old 改变前的画布宽度高度对象
     * @return {Array} 扩展后的画布栅格化数组
     */
    changeGridSize (grid = [], now = {w: 0, y: 0}, old = {w: 0, y: 0}) {
        let nowXL = Math.ceil(now.w / 500)
        let nowYL = Math.ceil(now.h / 500)
        let nowL = nowXL * nowYL        // 总共有多少格
        if (grid.length === 0) {
            for (let i = 0; i < nowL; i++) {
                grid.push([])           // 每一个放一个数组，放资源？？重复怎么办？
            }
        }
        if (nowL === grid.length) {
            return grid
        }
        // 新旧对比
        let oldXL = Math.ceil(old.w / 500)
        let oldYL = Math.ceil(old.h / 500)
        // 宽高变大了，往对应的地方添加[]
        if (nowXL > oldXL && nowYL > oldYL) {
            for (let i = 0; i < oldYL; i++) {
                grid.splice(oldXL * (i + 1) + i, 0, [])
            }
            for (let i = 0; i < nowXL; i++) {
                grid.push([])
            }
        } else if (nowXL > oldXL) {
            // 高变大
            for (let i = 0; i < oldYL; i++) {
                grid.splice(oldXL * (i + 1) + i, 0, [])
            }
        } else {
            // 宽变大
            for (let i = 0; i < nowXL; i++) {
                grid.push([])
            }
        }
        return grid
    }
}
