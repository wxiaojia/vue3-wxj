<template>
    <child>
        <template v-slot:header='{myName, clickChild}'>
            我是 {{ myName }}
            我的父在这 {{ parentName }}
            <button @click='clickMe'>点我</button>
            <button @click='clickChild'>子给我</button>
        </template>
    </child>
</template>

<script lang='ts' setup>
import { ref } from 'vue';
import child from './child.vue'

const clickMe = () => {
    console.log('我被父点了')
}
const parentName = ref('我可以显示吗')

</script>