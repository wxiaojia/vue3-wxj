# 功能介绍

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
+ layout              整体布局
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
  + dmc               数据魔方
  + complate          封装的组件的实现
  + getManyData       列表加载（多种方式,包括懒加载，只展示可视范围数据）
  + css-resize        css相关的
    - transition      vue动画
    - bindCss         在 CSS 中使用 JavaScript 中的变量。
    - keyframes       图片过渡（mask resize）
    - strangeShapes   css描述各种形状（想做的功能：点击的时候，展示html和css代码）
  + drag              拖拽demo(基础)
  + darkMode          暗黑模式(tailwind.config.js)

# Jest单元测试
vue-jest 和 @vue/test-utils 是测试 Vue 组件必备的库，然后安装 babel 相关的库，最后安装 Jest 适配 TypeScript 的库。
npm install -D jest@26 vue-jest@next @vue/test-utils@next 
npm install -D babel-jest@26 @babel/core @babel/preset-env 
npm install -D ts-jest@26 @babel/preset-typescript @types/jest


# .babelrc vs .babel.config.js
Babel 有两种并行的配置文件格式，可以一起使用，也可以分开使用。

项目范围的配置
babel.config.js 文件，具有不同的拓展名（json、js、html）
babel.config.js 是按照 commonjs 导出对象，可以写js的逻辑。

相对文件的配置
.babelrc 文件，具有不同的拓展名

总结：baberc 的加载规则是按目录加载的，是只针对自己的代码。config的配置针对了第三方的组件和自己的代码内容。babel.config.js 是一个项目级别的配置，一般有了babel.config.js 就不会在去执行.babelrc的设置。

# Vue3 中移除了 $on，$off等方法，所以 EventBus 不再使用，相应的替换方案就是 mitt.js

# 待完成功能：
文件上传下载
左侧菜单栏收缩，右侧适应
中英文转化
echart
百度地图
生产环境打包用webpack5
封装一个scroll加载数据的，然后比较下懒加载
写一个 右键菜单 ？打包到npm？
人脸识别
贪吃蛇

问题未解决：
jsonweb
大文件上传的暂停和续传