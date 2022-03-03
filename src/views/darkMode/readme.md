# 安装依赖
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

# tailwind 配置初始化
npx tailwindcss init -p

初始化后，会自动在目录下创建两个文件， tailwind.config.js 和postcss.config.js

+ 为了能够使用 tailwindcss ，我们还需要引入他的一些工具包。我们通过在src目录下创建一个 index.css 来引入它的工具包。

+ src/index.scss
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
+ main.ts中引入index.scss

至此我们的 vite + vue3 + tailwindcss 的工程已经初始化好了，接下来就是需要配置 tailwindcss 的暗黑模式了。
一共需要两个步骤，第一步是选择使用的模式，第二步是为了能方便写适配暗黑模式的代码，例如dark:{class}。

# 第一步
打开 tailwind.config.js 文件，我们来修改最外层的 darkMode属性，它有两个选项 media 和class：
media是通过媒体监测实时监测用户操作系统上是否启用了暗模式。
class更偏向于手动，例如在站点提供选项或按钮来切换light和dark模式。
在这里我们使用 class模式 来实现我们的暗黑模式。

darkMode: "class"

# 第二步
在 tailwindcss 中如果需要支持暗黑模式，还需要在 variants 中增加配置，例如以下我们让背景色和文字颜色支持了暗黑模式。
继续编写 tailwind.config.js， 增加 variants，这一步主要是增加了一些能让你快速书写暗黑模式的class代码，
例如，dark:text-gray-300 ，意思就是在暗黑模式下，让文字呈现灰度为 300 的颜色。
关于这个数值，可以看我上一篇文章《从Nuxt文档里发现色彩的配搭诀窍》，这是 tailwindcss 的一套主题色值，数值越小，代表颜色越来越浅，越接近白色，色值越大代表颜色越深，越接近白色。
因此我们需要在暗黑模式下选择一个颜色较浅的色彩值。
暗黑模式下一共有以下几个属性可以配置成快速书写的方式， backgroundColor, borderColor, gradientColorStops, placeholderColor 和 textColor。
那为什么要配置这一步呢？其实主要和代码量有关，配置多个属性势必会引入更多的css类，如果你的暗黑模式无使用到所有的类，那么只需要适量引入。
```javascript
// tailwind.config.js
module.exports = {
  ...
  variants: {
    extend: {
      textOpacity: ['dark'],
      backgroundColor: ['dark'],
    }
  }
  ...
}
```

然后再增加一个支持暗黑模式的插件tailwindcss-dark-mode

```javascript
const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const selectorParser = require('postcss-selector-parser')


module.exports = {
  // purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    colors,
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
    },
  },
  plugins: [
    require('tailwindcss-dark-mode')()
  ],
}
```