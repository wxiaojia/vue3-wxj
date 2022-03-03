import dataType from '../../views/dmc/json/dataType.json'

export default {
    /**
     *  判断中英文字符串长度 并截取对应长度的字符串
     * @param  {[type]} str    [字符串]
     * @param  {[type]} length [要截取的长度,如果不填写则不截图 默认返回字符串长度]
     * @return {[type]}        [字符串长度或截取后的字符串]
     */
    subStrLength (str, startLen, endLen) {
        if (str === undefined || str === null || !str) {
            return 0
        }
        let byteLen = 0
        let subStr = ''
        let len = str.length
        if (typeof startLen === 'number') {
            if (typeof endLen === 'number') {
                for (let i = 0; i < len; i++) {
                    byteLen += str.charCodeAt(i) > 255 ? 2 : 1
                    if (byteLen >= endLen) {
                        return subStr
                    }
                    if (byteLen >= startLen) {
                        subStr += str.charAt(i)
                    }
                }
            } else {
                for (let i = 0; i < len; i++) {
                    byteLen += str.charCodeAt(i) > 255 ? 2 : 1
                    if (byteLen >= startLen) {
                        return subStr
                    }
                    subStr += str.charAt(i)
                }
            }
            return subStr
        }
        for (var i = 0; i < len; i++) {
            byteLen += str.charCodeAt(i) > 255 ? 2 : 1
        }
        return byteLen
    },
    /**
     * 字符串第一个字母转大写
     */
    firstLetterToUpperCase (str) {
        if (typeof str !== 'string') {
            return str
        }
        return str.toString()[0].toUpperCase() + str.toString().slice(1)
    },
    /**
     * 数字转添加间隔符的字符串  如1234567 转换后就是1,234,567
     * @param  {[type]} num       [description]
     * @param  {[type]} separator [description]
     * @return {[type]}           [description]
     */
    numberToString: (num, separator) => {
        if (num === undefined || isNaN(num)) {
            return ''
        }
        let str = num + ''
        str = str.split('').reverse().join('')
        if (str.length > 3) {
            let newStr = ''
            for (let i = 0; i < parseInt(str.length / 3) + 1; i++) {
                newStr += str.substring(i * 3, str.length < (i + 1) * 3 ? str.length : (i + 1) * 3) + separator
            }
            if (str.length % 3 === 0) {
                newStr = newStr.substring(0, newStr.length - 1)
            }
            return newStr.substring(0, newStr.length - 1).split('').reverse().join('')
        }
        return num
    },
    // 判断字符串是否为空
    isEmpty (str) {
        if (str === null || str === undefined) {
            return true
        }
        if (str instanceof Array) {
            return str.length === 0
        }
        if (typeof str === 'number') {
            str = str + ''
        }
        if (typeof str === 'object') {
            return Object.keys(str).length > 0
        }
        if (str !== undefined && str !== null && str !== '' && str.trim() !== '') {
            return false
        }
        return true
    },
    /**
     * 数字 小于10则在前面补一个0
     * @author bruce.yang
     * @param num {type=number} 要补零的数字
     */
    numberAddZero (num) {
    	if (this.isEmpty(num)) {
    		return '00'
    	}
    	if (num < 10) {
    		return '0' + num
    	}
    	return num
    },
    getUUID () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0
            var v = c === 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        }).replace(/-/g, '')
    },
    /**
     * 判断是否是function
     */
    isFunction (fun) {
        if (fun && typeof fun === 'function') {
            return true
        }
    },
    /**
     * 获取字符串对应的字节长度
     * @param {String} str 字符串
     */
    getStrCodeLen (str = '') {
        const len = str.length
        let byteLen = 0
        for (let i = 0; i < len; i++) {
            byteLen += str.charCodeAt(i) > 255 ? 2 : 1
        }
        return byteLen
    },
    /**
     * 判断字符串对应的数据类型
     * @param {String} str
     */
    getDataType (str) {
        if (!str) {
            return ''
        }
        str = str.toLocaleLowerCase()
        if (dataType.string.indexOf(str) !== -1) {
            return 'string'
        } else if (dataType.number.indexOf(str) !== -1) {
            return 'number'
        } else if (dataType.date.indexOf(str) !== -1) {
            return 'date'
        } else if (dataType.boolean.indexOf(str) !== -1) {
            return 'boolean'
        }
        return ''
    }
}
