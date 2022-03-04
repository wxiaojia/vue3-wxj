<template>    
<div class='v-scroll' v-if='!loading' @scroll.passive="lazy">
    <div v-for='i in 100' >
        <img :src="tu1" class="image-item" alt="" lazyload = "true" :data-src="list[i].src">
    </div>
</div>

</template>

<script setup lang='ts'>
import { watch, computed, onMounted, ref, toRaw } from 'vue'
import { getList } from '@/api/http.js'
import tu1 from "../../assets/logo.png";
import { throttle } from 'utils/common/tool'

let container = ref<HTMLElement>(document.getElementById('list'))
const lazyLoad = ref(false)
const loading = ref(true)
const list = ref([])

//  直接渲染  1456.652099609375 ms
const getData = async () => {
    lazyLoad.value = false
    list.value = await getList()
    loading.value = false
}

function loadIfNeeded($img) {
    // 什么情况下：在视图范围内
    const bounding = $img.getBoundingClientRect()
    // console.log(bounding)
    // 去掉隐藏的 提高性能 
    if (
        getComputedStyle($img).display !== 'none'
        && bounding.top <= window.innerHeight
        && bounding.bottom >= 0
    ) {
        // 重点：赋值，去掉class 防止重复
        $img.src = $img.dataset.src
        // console.log('a', $img.classList)
        $img.classList.remove('.image-item')
    }
}
			
// 使用节流
const lazy = throttle(function() {
    const $imgList = document.querySelectorAll('.image-item')
    // if ($imgList.length === 0) {
    //     document.removeEventListener('scroll', lazy)
    //     window.removeEventListener('resize', lazy)
    //     // 移动端，设备在纵横方向发生改变
    //     window.removeEventListener('orientationchange', lazy)
    // }
    // 循环所有需要加载的节点，判断是否需要加载
    $imgList.forEach(loadIfNeeded)
}, 200)
			
onMounted(() => {
     // 监听事件
     getData()
})


</script>

<style scoped>
 .v-scroll {
  height: 100%;
  /* padding-bottom: 500px; */
  overflow: auto;
 }
#container {
      height: 100vh;
      overflow: auto;
    }
    .sunshine {
      display: flex;
      padding: 10px;
    }
    img {
      width: 150px;
      height: 150px;
    }
</style>

<!-- + 懒加载
- 监听onscroll事件，判断可视区域位置：图片的加载是依赖于src路径的，
- 首先可以为所有懒加载的静态资源添加自定义属性字段，用于存储真实的url。
- 比如是图片的话，可以定义data-src属性存储真实的图片地址，src指向loading的图片或占位符。
- 然后当资源进入视口的时候，才将src属性值替换成data-src中存放的真实url。

+ 可以使用元素的getBoundingRect().top来判断当前位置是否在视口内，
+ 也可以使用元素距离文档顶部的距离offsetTop和scrollTop是否小于视口高度来判断： 
img.offsetTop < document.documentElement.scrollTop + document.documentElement.clientHeight
-->

