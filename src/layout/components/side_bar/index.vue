<template>
    <el-aside width="200px;">
      <!-- 左侧导航 -->
      <el-menu 
        :collapse="sideSetting"
        :default-active="$route.path" exact
        class="el-menu-vertical-demo menu" router > 
        <sideItem v-for="v in get_routes[0].children" :key="v.path" :item="v" :path="v.path"/>
      </el-menu>
    </el-aside>
    
</template>

<script lang='ts' setup>
// import SideBarLogo from './SidebarLogo.vue'
import sideItem from './SidebarItem.vue'
// import SidebarItem from './SidebarItem.vue'
import { useMainStore } from '@/store/main.js'
import { usePermissionStore } from '@/store/permission.js'
import { computed, watchEffect, ref } from 'vue'

// const activeMenu = ''
// const variables = {}
// const menuActiveTextColor = ''
// const routes = ''

const handleOpen = () => {}
const handleClose = () => {}

const store = useMainStore()
const routeStore = usePermissionStore()
const sideSetting = ref(false)

watchEffect(() => {
  sideSetting.value = store.sidebarSetting
})
// const sidebar = computed(() => {
//   return store.state.app.sidebar
// })
// console.log(store)
const get_routes = routeStore.routes
// console.log('get_routes', get_routes[0].children)

// const isCollapse = computed(() => {
//   return sidebar.value.opened
// })
// console.log(isCollapse)

</script>


<style lang="scss">
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
    overflow: hidden;
    background-color: #ffffff !important;


  
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.menu {
  text-align: left;
  overflow-y: scroll;
}
.el-scrollbar {
  height: 100%;
}

.has-logo {
  .el-scrollbar {
    height: calc(100vh - 100px);
  }
}

.el-menu {
  border: none;
  width: 100% !important;
}
</style>
