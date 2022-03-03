<template>
<div>
    <div class="read_pro">
        <div class="read_pro_inner" ref='readProInner'></div>
    </div>
    <txt></txt>
</div>
</template>

<script lang='ts' setup>
import { ref, unref, onMounted } from 'vue' 
import txt from './txt.vue'

// const readProInner = ref()

onMounted(() => {
    const { scrollHeight, clientHeight } = document.documentElement

    document.addEventListener('scroll', function(e) {
        const readProInner = document.querySelector('.read_pro_inner') as HTMLElement
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        readProInner.style.width = +(scrollTop/(scrollHeight-clientHeight)).toFixed(2)*100 + '%'
    })
})

</script>

<style lang='scss' scoped>
.read_pro {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: #DDD;
}
.read_pro_inner {
    content: '';
    position: absolute;
    left: 0;
    height: 100%;
    background-color: #0089f2;
}
</style>