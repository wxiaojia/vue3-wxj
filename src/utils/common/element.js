// 匿名自执行函数
// 单例模式
// 1、立即执行
// 2、避免变量执行
(function(window) {
    let jquery = function (nodeSelector) {
        this.nodes = document.querySelectorAll(nodeSelector)
    }

    jquery.prototype = {
        each: function (callback) {
            for (let i = 0; i < this.nodes.length; i++) {
                callback.call(this, this.nodes[i])
            }
        },
        addClassList: function (classes) {
            let className = classes.split(' ')
            className.forEach(value => {
                this.each(function (index, obj) {
                    obj.className.add(value)
                })
            })
        },

    }
})(window)