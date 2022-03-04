<template>   
    <div class='parent'>
        <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    <h1>不可见</h1>
    <h4>不可见</h4>
    </div>
</template>

<script setup lang='ts'>
import { watch, onMounted, ref } from 'vue'

let options = {
    root: document.querySelector('.parent'), // 根元素，null为视口
    threshold: 1.0 //重叠率 0.0-1.0  重叠率达到要求后触发事件 
}
let callBack = (entries, observer) => {
    entries.forEach(entry => {
        entry.target.innerText = entry.isIntersecting ? '测试': '不可见';
    })
}

onMounted(() => {
    let observer  = new IntersectionObserver(callBack, options);

    let observedList = document.querySelectorAll('h1');
    observedList.forEach(element => {
        observer.observe(element)
    });
})


</script>

