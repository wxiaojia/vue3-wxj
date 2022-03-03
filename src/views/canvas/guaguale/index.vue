<template>
    <!-- 刮刮乐 -->
    <canvas id="canvasGua" width="400" height="100"></canvas>
    <div style='position: absolute;left: 130px;top: 35px;z-index: -1;'>恭喜您获得100w</div>

</template>

<script lang='ts' setup>
import { onMounted } from 'vue';
import createGua from './guaguale.js'

onMounted(() => {
    createGua()
})
</script>