<template>
<div>
    <slot name='header' :myName='myName' :clickChild='clickChild'></slot>
    <!-- <slot :arr='arr'></slot> -->
</div>
</template>

<script lang='ts' setup>
import { ref } from "vue";

const myName = ref('我是child')
const clickChild = () => {
    console.log('我在子打印的')
}
const arr = ref(['as', 'asd', 'asdf'])
</script>