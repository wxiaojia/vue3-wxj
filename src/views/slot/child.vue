<template>
<div>
    <slot name='header' :myName='myName' :clickChild='clickChild'></slot>
</div>
</template>

<script lang='ts' setup>
import { ref } from "vue";

const myName = ref('我是child')
const clickChild = () => {
    console.log('我在子打印的')
}
</script>