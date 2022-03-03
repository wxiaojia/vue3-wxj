# 使用 resize 实现强大的图片拖拽切换预览功能
首先，要实现这样一个效果如果不要求可以拖拽，其实有非常多的办法。
将两张图片叠加在一起
改变上层图片的宽度，或者使用 mask， 改变 mask 的透明度区间变化

# 第一种

```css
.g-outer {
    width: 650px;
    height: 340px;
    background-image: url(image1.png);
    overflow: hidden;
}
.g-inner {
    height: 340px;
    background: url(image2.png);
    animation: widthchange 3s infinite alternate linear;
}
@keyframes widthchange {
    0% {
        width: 650px;
    }
    100% {
        width: 0px;
    }
}
```

# 第二种，使用mask
```css
.g-outer {
    height: 300px;
    width: 500px;
    background-image: url('../../assets/img/xia.png');
    background-repeat: no-repeat;
}
.g-inner {
    height: 300px;
    background: url('../../assets/img/qiu.png');
    mask: linear-gradient(90deg, #fff 0%, #fff 50%, transparent 50%, transparent 100%);
    mask-size: 200% 100%;
    animation: maskChange 2s infinite alternate linear;
}
@keyframes maskChange {
    0% {
        mask-position: -100% 0;
    }
    100% {
        mask-position: 0 0;
    }
}
```

## mask 讲解：
```css
mask: url(mask.png);                       /* 使用位图来做遮罩 */
mask: url(masks.svg#star);                 /* 使用 SVG 图形中的形状来做遮罩 */
mask: linear-gradient(#000, transparent)                      /* 使用渐变来做遮罩 */

linear-gradient(90deg, #fff 0%, #fff 50%, transparent 50%, transparent 100%);

```

0deg, red, yellow (下红上黄)
90deg, red, yellow (左红右黄)
180deg, red, yellow (上红下黄)
-90deg, red, yellow (右红左黄)
多个值的话逐渐变


# 第三种，用resize
resize：该属性允许你控制一个元素的大小
/* Keyword values */
  resize: none;
  resize: both;
  resize: horizontal;
  resize: vertical;
  resize: block;
  resize: inline;

简单总结一些小技巧：
resize 的生效，需要配合 overflow: scroll。当然，准确的说法是，overflow 不是 visible，或者可以直接作用于替换元素譬如图像、<video> 及 <iframe>、<textarea> 等
我们可以通过 resize 的 horizontal、vertical、both 来设置横向拖动、纵向拖动、横向纵向皆可拖动
可以配合容器的 max-width、min-width、max-height、min-height 限制可拖拽改变的一个范围
