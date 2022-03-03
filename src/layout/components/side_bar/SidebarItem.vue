<!--
  未完成：
  换好看的图标
-->
<template>
      <!-- 没有子级 -->
      <el-menu-item :index="path" v-if="!item.children">
         <i class='el-icon-menu'></i>
         <span slot="title">{{item.meta.title}}</span>
      </el-menu-item>

      <!-- 有子级 -->
      <el-submenu :index="path" v-else>
        <template #title>
          <!-- <el-icon :size='30'><Menu></Menu></el-icon> -->
          <i class='el-icon-menu'></i>
          {{item.meta.title}}
        </template>
        <sideItem v-for="child in item.children" :key="child.path" :item="child" :path="getPath(child.path)"/>
      </el-submenu>
</template>

<script lang='ts'>
export default {
  name: 'sideItem',
}
</script>
<script lang='ts' setup>


import { Menu } from '@element-plus/icons-vue'

const props = defineProps({
  item: {type: Object, defaults: () => ({})},
  path: {type: String, defaults: ''}
})

const { item, path } = props

const resolve = (pre: string, str:string) => {
  // ('/a/b','./c')   ==== ('/a/b/c')
  if (str.startsWith('./')) {
    return `${pre}${str.slice(1)}`
  } else if (str.startsWith('/')) {
    return `${pre}${str}` 
  } else {
    return `${pre}/${str}` 
  }
  
}

const getPath = (url: string) => {
  return resolve(path,url);
}


</script>

<style lang='scss' scoped>

.el-submenu.is-active > .el-submenu__title {
  /* color: $subMenuActiveText !important; */
}

.full-mode {
  .nest-menu .el-submenu > .el-submenu__title,
  .el-submenu .el-menu-item {
    /* min-width: $sideBarWidth !important; */
    /* #background-color: $subMenuBg !important; */

    &:hover {
      /* background-color: $subMenuHover !important; */
    }
  }
  .el-menu-item{
    &>span{
      display: inline-block;
      padding-left: 5px;
    }
  }
  .el-submenu {
    overflow: hidden;

    & > .el-submenu__title {
      .el-submenu__icon-arrow {
        display: none;
      }

      & > span {
             padding-left: 5px;

      }
    }
  }
}

.simple-mode {
  &.first-level {
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;
      }
    }

    .el-submenu {
      overflow: hidden;

      & > .el-submenu__title {
        padding: 0px !important;

        .el-submenu__icon-arrow {
          display: none;
        }

        & > span {
          visibility: hidden;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
svg {
  margin-right: 16px;
}

.simple-mode {
  svg {
    margin-left: 20px;
  }
}
</style>
