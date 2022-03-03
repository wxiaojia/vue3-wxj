# 仿苹果系统侧边消息提示

# Toasts
| -- index.js         // 注册组件, 定义全局变量以便调用
| -- instance.js      // 手动实例创建前后的逻辑
| -- toasts.vue       // 消息提示 HTMl 部分
| -- toastsBus.js     // 解决 vue3 去除 $on和$emit 的解决方案

# 样式
左 toast-icon  中 toast-content (中上 toast-head 中下 toast-body ) 右 toasr-close

# instance 
# 手动挂载实例 !!!
将组件手动挂载至页面（Q:为什么要这样，不是直接像组件一样写上就可以了吗？？？？A:不是像使用组件那种引入，是在js中引入的）

每创建一个 toasts 将会排列到上一个 toasts 的下方(这里的间隙为16px). 想要做到这种效果我们需要知道 已存在 的toasts 的高度.
需要将已创建的实例存起来，排列起来
(Q：instance.toastPosition.y = verticalOffset ？赋值之后是怎么展示出来的？？？？？
A: vue页面啦，绑定到容器中)

# 加入主动关闭及定时关闭功能
定时关闭: 在 toast 创建时给一个自动关闭时间, 当计时器结束后自动关闭.
主动关闭: 点击关闭按钮关闭 toast.
在这个基础上我们可以加上一些人性化的操作, 例如鼠标移入某个 toast 时停止它的自动关闭(其他 toast 不受影响), 当鼠标移开时重新启用它的自动关闭.

（Q：这个计时是使用时间差还是用setTimeout???  A: 是的)

instance.js 中 toast 关闭时的逻辑：
将此 toast 从存活数组中删除, 并且遍历数组将从此条开始后面的 toast 位置向上位移.
从 <body> 中删除Dom元素.
调用 unmount() 销毁实例.

# 在项目中安装
```javascript
// 安装toasts
import toasts from '.components/toasts'

app.use(toasts).mount('#app')
```

# 使用
```vue
<template>
    <button @click="clickHandle">发送</button>
    <button @click="closeHandle">主动关闭</button>
</template>

<script>
import { getCurrentInstance } from 'vue'
export default {
  setup(){
    const instance = getCurrentInstance()
    let toast
    
    function clickHandle(){
      // 这里调用 vue3 的全局变量时比较羞耻, 不知道各位大佬有没有其他好办法
      toast = instance.appContext.config.globalProperties.$Toast({
        type: 'info',
        title: '这是一句标题',
        message: '本文就是梳理mount函数的主要逻辑，旨在理清基本的处理流程（Vue 3.1.1版本）。',
        autoClose: 10000,
        confirmText: '已阅读',
        confirmHandle: () => {
           alert('阅读完成!')
        },
        leaveHandle: () => {
           alert('Toasts 离开了')
        }
      })
    }
    
    // 主动关闭
    fucntion closeHandle(){
        if(toast)
            toast.close();
    }
    
    return {
      clickHandle,
      closeHandle
    }
  }
}
</script>
```

# 参数说明
属性	说明	类型	可选值	默认值
title	提示框标题(可以为空)	string	-	-
message	消息主体(可以写入html)	string	-	-
closeIcon	是否显示关闭按钮	Boolean	true/false	true
customIcon	自定义icon图标(type必须设置为custom)	string	-	-
customIconBackground	自定义图标背景颜色(type必须设置为custom)	string	-	-
customImg	自定义图片路径(type必须设置为img)	string	-	-
autoClose	自动关闭时长(值小于等于0可以取消自动关闭)	number	-	4500
confirmText	按钮文字	string	-	-
confirmHandle	按钮触发事件	function	-	-
type	提示框类型	string	success/warning/info/error/custom/img	-
leaveHandle	Toasts离开后的回调	function	-	-

# 事件
事件	说明	参数	返回值	试例
close()	主动关闭toast	-	-	let toast = instance.appContext.config.globalProperties.$Toast({...});
toast.close();	


# 还没测试过呢

