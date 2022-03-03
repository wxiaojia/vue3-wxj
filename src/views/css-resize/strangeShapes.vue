<!--
    功能新增：点击的时候，展示html及css代码
-->
<template>
<div>
    矩形与圆角按钮
    <div class='btn rect'>rect</div>
    <div class='btn circle'>circle</div>
    平行四边形
    <div class='btn parallelogram'>Parallelogram</div>
    梯形
    <div class='btn trapezoid'>Trapezoid</div>
    切角
    <div class='btn notching'>切角</div>
    箭头函数
    <div class='btn arrow'>arrow</div>
    <div class='btn arrow_clip'>arrow</div>
    <div class='btn arrow_arrow'>arrow</div>
    内切圆角
    <div class='btn inner_circle'>inner_circle</div>
    <div class='btn inner_circle_four'>4个内切圆角</div>
    圆角不规则
    <div class="btn skew">Skew</div>
    外圆角，类似于chrome的标签页
    <div class="outside-circle">outside-circle</div>
</div>
</template>
<script lang='ts' setup>
</script>

<style lang='scss' scoped>
.btn {
    margin: 8px auto;
    flex-shrink: 0;
    width: 160px;
    height: 64px;
}
.rect {
    background: #f6ed8d;
}
.circle {
    border-radius: 64px;
    background: #7de3c8;
}
.parallelogram {
    position: relative;
    width: 160px;
    height: 64px;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: #03f463;
        transform: skewX(15deg);
    }
    /* background: linear-gradient(45deg, transparent 22%, #04e6fb 22%, #9006fb 78%, transparent 0); */
}
.trapezoid {
    position: relative;
    width: 160px;
    height: 64px;

    &::after {
          content:"";
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          transform: perspective(40px) rotateX(10deg);
          transform-origin: bottom;
          background: #ff9800;
    }
}
.notching {
    background: 
        linear-gradient(135deg, transparent 10px, #ff1493 0) top left,
        linear-gradient(-135deg, transparent 10px, #ff1493 0) top right,
        linear-gradient(-45deg, transparent 10px, #ff1493 0) bottom right,
        linear-gradient(45deg, transparent 10px, #ff1493 0) bottom left;
    background-size: 50% 50%;
    background-repeat: no-repeat;
}
.arrow {
    background: linear-gradient(
                -135deg,
                transparent 22px,
                #04e6fb 22px,
                #65ff9a 100%
            )
            top right,
        linear-gradient(
                -45deg,
                transparent 22px,
                #04e6fb 22px,
                #65ff9a 100%
            )
            bottom right;
    background-size: 100% 50%;
    background-repeat: no-repeat;
}
.arrow_arrow {
    background: linear-gradient(
                45deg,
                transparent 22px,
                #04e6fb 0,
                #65ff9a 100%
            )
            top left,
        linear-gradient(
                135deg,
                transparent 22px,
                #04e6fb 0,
                #65ff9a 100%
            )
            bottom left,
        linear-gradient(
                -135deg,
                transparent 22px,
                #04e6fb 22px,
                #65ff9a 100%
            )
            top right,
        linear-gradient(
                -45deg,
                transparent 22px,
                #04e6fb 22px,
                #65ff9a 100%
            )
            bottom right;
    background-size: 50% 50%;
    background-repeat: no-repeat;
}
.arrow_clip{
    background: linear-gradient(45deg, #04e6fb, #65ff9a);
    clip-path: polygon(
        0 0,
        30px 50%,
        0 100%,
        calc(100% - 30px) 100%,
        100% 50%,
        calc(100% - 30px) 0
    );
    /* clip-path 坐标轴（x,y）连接起来 */
}
.inner_circle {
    background-image: radial-gradient(circle at 100% 100%, transparent 0, transparent 12px, #2179f5 12px);
}
.inner_circle_four {
    background-size: 70% 70%;
    background-image: radial-gradient(
            circle at 100% 100%,
            transparent 0,
            transparent 12px,
            #2179f5 13px
        ),
        radial-gradient(
            circle at 0 0,
            transparent 0,
            transparent 12px,
            #2179f5 13px
        ),
        radial-gradient(
            circle at 100% 0,
            transparent 0,
            transparent 12px,
            #2179f5 13px
        ),
        radial-gradient(
            circle at 0 100%,
            transparent 0,
            transparent 12px,
            #2179f5 13px
        );
    background-repeat: no-repeat;
    background-position: right bottom, left top, right top, left bottom;
}
.skew {
    position: relative;
    width: 120px;

    &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 10px;
        background: orange;
        transform: skewX(15deg);
    }
    &::before {
        content: "";
        position: absolute;
        top: 0;
        right: -13px;
        width: 100px;
        height: 64px;
        border-radius: 10px;
        background: orange;
    }
}
.outside-circle {
    position: relative;
    background: #e91e63;
    border-radius: 10px 10px 0 0;

    &::before {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        left: -20px;
        bottom: 0;
        background: #000;
        background:radial-gradient(circle at 0 0, transparent 20px, #e91e63 21px);
    }
    &::after {
        content: "";
        position: absolute;
        width: 20px;
        height: 20px;
        right: -20px;
        bottom: 0;
        background: #000;
        background:radial-gradient(circle at 100% 0, transparent 20px, #e91e63 21px);
    }
}
</style>