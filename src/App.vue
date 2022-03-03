<template>
<div id='app'>
  <!-- <div class="about text-gray-700 dark:text-gray-300 dark:bg-gray-900 w-full h-full">
    <button @click="lightMode" class="border-2 p-1 m-1">普通模式</button>
    <button @click="darkMode" class="border-2 p-1 m-1">暗黑模式</button>
     -->
    <!-- 自定义指令test: -->
    <!-- <img class="avatar" v-lazy="'item.pic'"> -->

<!-- </div> -->
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <!-- <Child msg="hello" @child-click="childCtx" /> -->

  <!-- <router-link to='left'>left</router-link> -->
  <!-- <router-link to='home'>home</router-link>  -->
  <router-view></router-view>
</div>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import notify from 'utils/common/notify.js'
// import './permission'

// import Child from './views/default/Child.vue'


const childCtx = (ctx) => {
  console.log(ctx);
}

const darkMode = () => {
  const clsList = document.documentElement.classList;
  if(!clsList.contains('dark-mode')) {
    document.documentElement.classList.add('dark-mode');
  }

  notify("黑暗提醒", {
      icon: "https://sf1-ttcdn-tos.pstatp.com/img/user-avatar/f1a9f122e925aeef5e4534ff7f706729~300x300.image",
      body: "恭喜你，掘金签到一等奖",
      tag: "prize"
  }, {
      onclick(ev) {
          console.log(ev);
          ev.target.close();
          window.focus();
      }
  })

}
const lightMode = () => {
  document.documentElement.classList.remove('dark-mode')
}
</script>

<style lang='scss'>
@import 'assets/common.scss';

  
</style>