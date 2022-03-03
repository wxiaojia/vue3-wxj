<template>
    <div class='app-main'>
        <router-view />
    </div>
</template>

<script lang='ts'>
export default {
  name: 'views'
}
</script>
<script lang='ts' setup>
  
</script>

<style scoped>
.app-main {
    width: 100%;
    overflow: auto;
    height: calc(100% - 60px);
    background-color: #f1f6fe;
  }
</style>
