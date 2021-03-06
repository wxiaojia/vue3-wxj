# 奇形怪状的按钮

# 常规的矩形与圆角按钮
border-radius

# 平行四边形
transform
注意：使用了 transform 之后，标签内的文字也会同样的变形，
所以，我们通常使用元素的伪元素去实现造型，这样可以做到不影响按钮内的文字。
如果不想使用伪元素，除了 transform: skewX()，平行四边形使用渐变也是可以实现的。

# 梯形， perspective(40px) rotateX(10deg);
梯形比平行四边形稍微复杂一点，它多借助了 perspective，其实是利用了一定的 3D 变换。原理就是一个矩形，绕着 X 轴旋转，像是这样：

# 切角
最常见的方法主要是借助渐变 linear-gradient 实现

# 箭头
接下来是箭头按钮，仔细观察上面的切角按钮，当两边的角被切掉的足够多的时候，就变成了一个箭头的形状。

如果是前后都箭头的呢？
一样的，它也是两个渐变的叠加，渐变的颜色是透明 --> 颜色A --> 颜色B --> 透明。当然，同样在这里也可以使用 clip-path：
这里给出 clip-path 的解法：

# 圆角不规则矩形
其实，它就是由圆角矩形 + 圆角平行四边形组成：

# 外圆角按钮
这个按钮形状，常见于 Tab 页上，类似于 Chrome 的分页
对这个按钮形状拆解一下，这里其实是 3 块的叠加：左右两个弧形加中间 上方圆角的矩形
弧形：渐变 -- 径向渐变


# 总结
渐变（线性渐变 linear-gradient、径向渐变 radial-gradient、多重渐变）
遮罩 mask
裁剪 clip-path
变形 transform