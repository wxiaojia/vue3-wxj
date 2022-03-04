<template>

    <div class='app-breadcrumb'>
      <i class='el-icon-s-unfold icon' @click='toggleSide'></i>

      <el-breadcrumb separator="/">
         <el-breadcrumb-item v-for='(v, i) in list' :key='i' style='float: left;'>
            <span>{{ v.meta.title }}</span>
            <!-- <router-link v-else :to='v.path'>{{ v.meta.title }}</router-link> -->
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="right-menu" style='float: right;padding: 20px; '>
      <button @click="goBack">退出</button>
        <!-- <el-dropdown>
          <span class="el-dropdown-link">
            退出<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span @click="goBack">退出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </div>

</template>

<script lang='ts' setup>
import { logout } from '@/api/http.js'
import { useRoute } from 'vue-router'
// import { useStore } from 'vuex'
import { ref, computed, watch } from 'vue'
import { setStorage } from 'utils/common/useStorage.js'
// import router from '@/router/router.js'
import { watchEffect } from '@vue/runtime-core'
import { useMainStore } from '@/store/main.js'

const router = useRoute()
const store = useMainStore()
// watchEffect(() => {
//   sideSetting.value = store.get_sidebarSetting
// })
const sideSetting = computed(() => store.sidebarSetting)
console.log('router.matched', router.matched, router.currentRoute)
let list = ref([])

watchEffect(() => {
  const [index, ...routers] = router.matched
  list.value = routers.filter(item => item.meta && item.meta.title)
})

const goBack = () => {
  logout().then((res:any) => {
    sessionStorage.setItem('TOKEN', '')
    router.push('/login');
  })
}
 
const toggleSide = () => {
  store.SET_SIDEBAR(true)
}

</script>


<style lang="scss" scoped>

    .app-breadcrumb {
      width: 50%;
      padding: 20px;
      float:left;
    }
    .icon {
      float: left;
      margin-right: 20px;
      cursor: pointer;
    }
</style>

