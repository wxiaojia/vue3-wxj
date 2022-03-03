<!--
 * @Author: wxiaojia 
 * @Date: 2021-12-29 23:01:50 
 * @Last Modified by:   wxiaojia 
 * @Last Modified time: 2021-12-29 23:01:50 
-->


<template>
    <a
      v-if="isExternal(to)"
      :href="props.to"
      target="_blank"
      rel="noopener"
    >
      <slot />
    </a>
    <div
      v-else
      @click="push"
    >
      <slot />
    </div>
  </template>
  
  <script lang='ts' setup>
  import { useRouter } from 'vue-router'
  import { isExternal } from 'utils/validate'

  const props = defineProps({
      to: {
          type: String,
          required: true
      }
  })

    const router = useRouter()
    const push = () => {
        console.log(props.to)
        router.push(props.to).catch((err) => {
            console.log(err)
        })
    }

  </script>
