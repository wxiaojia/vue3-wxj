
<template>
    <div>
      <button @click="add">点我数字新增且随机颜色</button>
      <h1> {{ count }}</h1>
    </div>
  </template>
  
  <script setup lang='ts'>
  import { ref } from "vue";
  let count = ref(1)
  let color = ref('red')
  
  function add() {
    count.value++
    color.value = Math.random()>0.5? "blue":"red"
  }
  </script>
  
  <style scoped>
  h1 {
    color:v-bind(color);
  }
  </style>>