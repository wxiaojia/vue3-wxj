<template>
<div>
    <!-- 左侧组件列表 -->
    <div class="left">
      <div
        class="left-item"
        v-for="item in state.list1"
        :key="item.code"
        draggable
        @dragstart="e => dragstart(e, item)"
        @dragend="dragend"      
      >
        {{ item.name }}
      </div>
    </div>

    <!-- 画布区域 -->
    <div class="targetContent" ref="targetContent">
      <div
        class="item"
        v-for="item in state.list2"
        :key="item.id"
        :ref="item.id"
        :style="{
          top: `${item.top - 16}px`,
          left: `${item.left - 85}px`,
          'z-index': `${item.zIndex}`
        }"
         @mousedown="e => mousedown(e, item)"
      >
        <template v-if="item.code === 'MyInput'">
          <a-input></a-input>
        </template>
      </div>
    </div>
</div>
</template>
<script lang='ts' setup>
import { reactive, ref, unref } from 'vue'
import aInput from './aInput.vue'

interface listType {
    top: number,
    left: number,
    zIndex: number,
    code: string,
    id: number
}

interface stateType {
    list1: [],
    list2: Array<listType>
}

const state = reactive({
    list1: [{
        code: "MyInput",
        name: "输入框",
        props: {}
    }],
    list2: []
})

const  dragItem =  ref(null),
      moveItem = ref(null)

const dragenter = (e) => {
    console.log('触发了dragenter')
    e.dataTransfer.dropEffect = "move";
}

const dragover = (e) => {
    e.preventDefault();
}

const dragleave = (e) => {
    e.dataTransfer.dropEffect = "none";
}
const drop = (e) => {
    const { code } = dragItem.value
    const list: listType = {
        top: e.offsetY,
        left: e.offsetX,
        zIndex: 1,
        code: code,
        id: Date.parse(new Date())
    }
    state.list2.push(list)
    console.log(list)
}

const targetContent = ref() // 获取ref绑定元素
const dragstart = (e, item) => {
    dragItem.value = item
    // 此处为拖动的放置元素绑定事件
    const target = unref(targetContent)
    console.log(target)
     // 设置元素的放置行为——移动
    target.addEventListener("dragenter", dragenter);
    // 在目标元素经过 必须要阻止默认行为 否则不能触发drop
    target.addEventListener("dragover", dragover);
      // 离开目标元素时设置元素的放置行为——不能拖放
    target.addEventListener("dragleave", dragleave);
      // 拖动元素在目标元素松手时添加元素到画布
    target.addEventListener("drop", drop);
}

// 移除绑定事件
const dragend = () => {
    const target = unref(targetContent)
    console.log(target)
     // 设置元素的放置行为——移动
    target.removeEventListener("dragenter", dragenter);
    // 在目标元素经过 必须要阻止默认行为 否则不能触发drop
    target.removeEventListener("dragover", dragover);
      // 离开目标元素时设置元素的放置行为——不能拖放
    target.removeEventListener("dragleave", dragleave);
      // 拖动元素在目标元素松手时添加元素到画布
    target.removeEventListener("drop", drop);
}

const mousedown = (e, item) => {
  moveItem.value = item
  document.addEventListener("mousemove", mousemove);
  document.addEventListener("mouseup", mouseup);
}

const mousemove = (e) => {
  // 移动时也是展示的，那就要酸楚移动的距离
  let { clientX, clientY } = e
  const moveIdx = state.list2.findIndex(item => item.id === moveItem.value.id)
  let newList2: Array<listType> = [...state.list2];

  newList2[moveIdx].top = clientY;
  newList2[moveIdx].left = clientX;
  state.list2 = newList2;
  console.log('移动成功')

}
const mouseup = () => {
  document.removeEventListener("mousemove", mousemove);
  document.removeEventListener("mouseup", mouseup);
}


</script>


<style lang='scss' scoped>
.left {
  padding: 10px;
  position: absolute;
  width: 270px;
  background: rgb(247, 202, 202);
  top: 0;
  bottom: 0;
  left: 0;
}
.left-item {
  cursor: pointer;
  height: 100px;
  line-height: 100px;
  background: #fff;
}
.targetContent {
  background: rgb(173, 244, 247);
  height: 100vh;
  padding: 0 270px;
}
.item {
  position: absolute;
}
</style>