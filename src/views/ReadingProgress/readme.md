# 阅读进度

# 方法一：js实现
文档总高度: document.documentElement.scrollHeight
窗口可视高度: document.documentElment.clientHeight
滚动距离: document.documentElement.scrollTop || document.body.scrollTop

scrollTop 就是已经读过被卷起来的文档部分,scrollHeight 是文档的总长度，clientHeight 是浏览器显示区域的高度

readProInner.style.width = +(scrollTop / (scrollHeight- clientHeight)).toFixed(2)*100 + '%'
大家可能会有疑惑，为什么分母是 scrollHeight- clientHeight 而不是 scrollHeight?

当滚动条滚动到底部时，浏览器此时仍显示一屏内容，此时滚动条无法再滚动，scrollTop 无法再增加，因此 scrollTop 的最大值是 scrollHeight- clientHeight ，如果使用 scrollHeight 做分母，阅读进度最终无法达到 100%。
```javascript
document.addEventListener('scroll', function(e) {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    readProInner.style.width = +(scrollTop/(scrollHeight-clientHeight)).toFixed(2)*100 + '%'
})
```
使用 js 实现需要监听 scroll 事件，而且滚动时有可能是频繁的 scroll 事件触发，有可能会造成一定的性能浪费，所以我们来一起学习 css 实现方案

# 方法二：css实现
预备知识：
Linear-gradient: 线性渐变，第一个参数为渐变方向，后面是颜色比例变化。
比如设置 linear-gradient(to right top, #0089f2 50%, #DDD 50%)

矩形：对角线左下为蓝，右上为灰
如果我们用一块白块遮住蓝块，只留一条缝在顶部，那当前显示出来蓝色块的底边不就是阅读进度吗？


```css
/* 首先使用 `linear-gradient` 实现蓝色背景块，并且要空出最后一屏 */
body{	
    background: linear-gradient(to right top, #0089f2 50%, #DDD 50%);
    /* 通过 calc 函数配合 100vh 就可以从总长中删除一屏的高度 */
    /* 100vh 浏览器视口的高度 */
    background-size: 100% calc(100% - 100vh + 10px);
    background-repeat: no-repeat;
}
/* 设置盖住蓝块的白块
阅读进度条的高度为 3px ，因此设置白块的高度为 100% \- 3px，可以另外加一个 div 元素来设置白块，但小包推荐使用为元素 :before/:after ，伪元素不在文档流之中，方便渲染和控制 */
body:before{
    content:'';
    /* fixed定位 */
    position: fixed;
    /* 同时设置 top 和 bottom 可以拉伸 height */
    /* 设置高度为 100% - 3px */
    top: 3px;
    bottom: 0;
    width: 100%;
    /* 降低层级，白块显示在文字之下 */
    z-index: -1;
    background: white;
}
```
此方法失败！！！不知道为啥，不能固定在顶部

