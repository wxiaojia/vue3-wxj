<template>
    父子通过slot传递数据！！
    slot里可以是子传来的，也可以是父本身的数据
    <child>
        <template v-slot:header='{myName, clickChild}'>
            <p>我是 {{ myName }} </p>
            <p>我的父在这 {{ parentName }}</p>
            <button @click='clickMe'>点我</button><br>
            <button @click='clickChild'>子给我</button>
        </template>
        <!-- <template slot-scope='scope'>
            {{ scope.arr }}
        </template> -->
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