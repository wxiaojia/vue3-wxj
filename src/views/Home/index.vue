<template>
    <div>
      <div>
        <div>homehome-Name</div>
        <input type="text" v-model="name" />
      </div>
      <div>
        <div>Sex</div>
        <!-- <input type="radio" name="sex" :checked="sex === Sex.male" @click="() => sex = Sex.male" />Male
        <input type="radio" name="sex" :checked="sex === Sex.female" @click="() => sex = Sex.female" />Female -->
      </div>
      <p>
        <button @click="handleSubmit">Submit</button>
        <p>1、避免了冗长的return,也不用再声明components</p>
        <p>2、顺带的，import 进来的 TS enum 类型（Sex），也可以方便的在 template 中使用了。</p>
        <p>3、如果装了 Volar，在 template 中对于 Sex 的代码提示、校验也是非常的友好。</p>
        <p>toRefs会将我们一个响应式的对象转变为一个普通对象，然后将这个普通对象里的每一个属性变为一个响应式的数据</p>
        <p>vue3做不到了， name: 'CustomName',inheritAttrs: false, 分开写</p>
        <p>script setup定义的变量默认不会暴露出去，因为变量这时候包含在setup的闭包中。这时我们可以使用definExpose({ })来暴露组件内部属性给父组件使用</p>

      </p>

    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, ref, withDefaults } from "vue";
  import CountDown from 'components/countDown/index.vue'
//   import { Sex, fetchUserInfo } from "../services";
//   const name = ref("");
//   const sex = ref(Sex.male);
  
//   onMounted(() => {
//     fetchUserInfo("id-xxx").then((res) => {
//       name.value = res.name;
//       sex.value = res.sex;
//     });
//   });
  
//   const handleSubmit = () => {};

//     interface Props {
//         userList: UserInfo[];
//     }
//     withDefaults(defineProps<Props>(), {
//         userList: () => [],
//     });
  
  </script>

<script lang='ts'>
import { defineComponent  } from 'vue'
export default defineComponent({
    name: 'home'
})
</script>
