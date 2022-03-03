<!--
 * @Author: wxiaojia 
 * @Date: 2021-12-29 22:35:11 
 * @Last Modified by:   wxiaojia 
 * @Last Modified time: 2021-12-29 22:35:11 
 -->

<template>
    <div class='app-wrapper' :class="classObj" v-watermark="
        { 
        text: 'wxj的vue3-admin',
        textColor: 'rgba(180, 180, 180, 0.3)' 
        }">
      <!-- <el-container> -->
        <!-- <div
            class="drawer-bg"
            @click="handleClickOutside"
            /> -->
            <!-- 左侧导航 -->
            <Sidebar class="sidebar-container"></Sidebar>
            <!-- 右侧 -->
            <div class="main-container" style=''>
                <!-- <el-container> -->
                    <!-- 右侧头部 -->
                    <el-header>
                      <Header />
                    </el-header>
                    <!-- 右侧主体 -->
                    <Main />
                    <!-- 右侧工具栏 -->
                    <div></div>
                <!-- </el-container> -->
            </div>
          <!-- </el-container> -->
    </div>
</template>

<script lang='ts' setup>
import { Sidebar, Header, Main } from './components/index.ts'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const classObj = ref({})

const router = useRouter()
const goBack = () => {
    router.push('/login');
}

</script>


<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
    width: calc(100% - 300px);
    margin-left: 300px;    
    height: 100%;
    overflow: hidden;
    position: relative;
    background: #fff;
}

.sidebar-container {
    transition: width 0.28s;
    width: 300px !important;
    height: 100%;
    position: fixed;
    font-size: 0px;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow-y: scroll;
    padding: 0;
    background-color: #ffffff !important;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  transition: width 0.28s;
}

</style>