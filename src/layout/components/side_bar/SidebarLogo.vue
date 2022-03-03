<!--
* Description: 侧边栏logo,可以缩进折叠
 * @Author: wxiaojia 
 * @Date: 2021-11-24 22:17:54 
 * @Last Modified by:   wxiaojia 
 * @Last Modified time: 2021-11-24 22:17:54 
-->
<template>
    <div class="sidebar-logo-container">
        <!-- :class="[props.isCollapse ? 'collapse': 'notitle']"> -->
        <transition name='sideBarFade'>
            <router-link to='/'  class="sidebar-logo-link">
                <img alt="Vue logo" src="@/assets/logo.png" class="sidebar-logo"/>
                <h1 class="sidebar-title">vue3 后台</h1>
            </router-link>
        </transition>
    </div>
</template>

<script lang='ts' setup>

const props = defineProps({
    isCollapse: Boolean
})

</script>

<style lang='scss' scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #fff;
  text-align: center;
  overflow: hidden;
  margin-bottom: 30px;
  margin-top: 20px;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & .sidebar-logo {
      display: inline-block;
      height: 100%;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #435EBE;
      font-weight: 600;
      line-height: 50px;
      font-size: 24px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 12px;
    }
  }
  &.notitle{
    .sidebar-title{
      display: none;
    }
       & .sidebar-logo {
      height: 60%;
    }
  }
}
</style>