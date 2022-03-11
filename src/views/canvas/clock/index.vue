<template>
	<!-- 时钟 -->
    <canvas class='canvasClock' id='canvasClock' width="300" height="300">
        您的浏览器不支持canvas，请升级您的浏览器
    </canvas>
</template>

<script setup lang='ts'>
import createClock from './clock.js'
import { onMounted } from 'vue';

onMounted(() => {
    window.requestAnimationFrame(createClock);
})

</script>