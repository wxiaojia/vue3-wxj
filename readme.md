### vue3 + webpack5 + vite + pinia + ts

#### 功能介绍

+ utils
  + common
    - deepClone       深拷贝
    - mouse.js        鼠标追踪位置
    - useStorage      将数据存储到localStorage中(可用于获取，也可以用于设置)
    - useFavicon      在loading状态下，去修改浏览器的小标签favicon
    - notify          浏览器带图带事件的桌面通知(使用app.vue 切换模式的时候)
    - getQueryString  获取url的params
    - realativeToAbs  相对地址转化为绝对地址
    - range           基于Array.from的序列生成器
    - formatMoney     基于toLocaleString千分位
    - delay           延迟执行
    - prevent         禁止选择和复制
    - download        文件下载iframe， 与 a 标签下载有什么区别？
+ layout              整体布局（布局正在完善。。。）
+ components
  + Rate              评分
  + countDown         倒计时
  + Toast             仿苹果右上提醒侧边栏（未测试）
  + Tree              树（views/dmc中有实现）
+ views
  + canvas            
    - clock           会走的钟
    - drag            
    - guaguale        刮刮乐
  + dmc               数据魔方（正在完善。。。）
  + complate          封装的组件的实现
  + getManyData       列表加载（多种方式,包括懒加载，只展示可视范围数据）
  + css-resize        css相关的
    - transition      vue动画
    - bindCss         在 CSS 中使用 JavaScript 中的变量。
    - keyframes       图片过渡（mask resize）
    - strangeShapes   css描述各种形状（想做的功能：点击的时候，展示html和css代码）
  + drag              拖拽demo(基础)
  + darkMode          暗黑模式(tailwind.config.js)


#### Vue3 中移除了 $on，$off等方法，所以 EventBus 不再使用，相应的替换方案就是 mitt.js（尚未使用）
