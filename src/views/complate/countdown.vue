<template>
    <p>自定义展示文字</p>
    <CountDown v-slot="{timeObj}"  :time='10000'>
        {{timeObj.d}}天{{timeObj.hh}}小时{{timeObj.mm}}分钟{{timeObj.ss}}秒
    </CountDown>

    <p>传入秒数，可以添加 isMilliSecond 参数设置，time 单位是ms还是s， 传end是具体的截止时间</p>
    <CountDown :time='20000'>
    </CountDown>
</template>

<script lang='ts' setup>
import CountDown from 'components/countDown/index.vue';


</script>