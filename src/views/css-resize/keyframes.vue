<template>
<div class="g-outer">
    <div class="g-inner"></div>
</div>
<div class="gg-outer">
    <div class="gg-inner">
        <div class="gg-resize"></div>
    </div>
</div>
</template>

<script lang='ts' setup>

</script>

<style lang='scss' scope>
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

.gg-outer {
    position: relative;
    width: 650px;
    height: 340px;
    background-image: url('../../assets/img/xia.png');
    overflow: hidden;
}
.gg-inner {
    position: absolute;
    top: 0;
    left: 0;
    min-width: 0;
    max-width: 650px;
    height: 340px;
    background-image: url('../../assets/img/qiu.png');
}
.gg-resize {
    position: relative;
    resize: horizontal;
    overflow: scroll;
    width: 0;
    height: 340px;
    max-width: 650px;
    min-width: 15px;
    animation: opacityChange 3s infinite alternate linear;
}
@keyframes opacityChange {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
.gg-inner:before {
    content: "↔";
    position: absolute;
    background: rgba(0, 0, 0, 0.5);
    top: 0;
    right: 0;
    height: 100%;
    line-height: 340px;
}
</style>