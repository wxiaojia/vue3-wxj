<template>
    坏的
    <span class="dusbin">
        🗑
    </span>
    <transition name="modal">
        <div class="info-wrapper" v-if="showModal">
        <div class="info">
            哥，你啥也没输入！
        </div>
        </div>
  </transition>
    输入：<input type="text" v-model='title' @keyup.enter="addTodo">
    <ul v-if="todos.length">
      <transition-group name="flip-list" tag="ul">
        <li v-for="todo in todos" :key="todo.title">
          <input type="checkbox" v-model="todo.done"/>
          <span :class="{ done: todo.done }"> {{ todo.title }}</span>
          <span class="remove-btn" @click="removeTodo($event,i)">❌</span>
        </li>
      </transition-group>
    </ul>
    <div class="animate-wrap">
        <transition @before-enter='beforeEnter' @enter='enter' @after-enter='afterEnter' >
            <div class="animate" v-show='animation.show'>
                📋
            </div>
        </transition>
    </div>
    
</template>
<script lang='ts' setup>
import { ref, reactive } from 'vue'

const showTitle = ref(true)
const todos = ref([])
const title = ref('')

let showModal = ref(false) 
function addTodo() { 
    if(!title.value){ 
         showModal.value = true 
         setTimeout(()=>{ 
             showModal.value = false }
        ,1500) 
        return 
    } 
    todos.value.push({ title: title.value, done: false, }); 
    title.value = ""; 
}

let animation: {
    show: boolean, 
    el: HTMLElement | null
} = reactive({
    show: false,
    el: null
})

function removeTodo(e: MouseEvent, i: number){
    animation.el = e.target as HTMLElement
    animation.show = true
    todos.value.splice(i,1)
}

function beforeEnter (el: HTMLElement)  {
    console.log('beforeEnter')
    let dom = animation.el
    let rect = (dom as HTMLElement).getBoundingClientRect()
    let x = window.innerWidth- rect.left - 60
    let y = rect.top - 10
    el.style.transform = `translate(-${x}px, ${y}px)`
}
function enter(el: HTMLElement, done: any) {
    console.log('enter')

    el.style.transform = `translate(0, 0)`
    el.addEventListener('transitionend', done)
}
function afterEnter (el: HTMLElement) {
    console.log('afterEnter')

    animation.show = false
    el.style.display = 'none'
}
</script>

<style>
.animate-wrap .animate{    
    position :fixed;    
    right :10px;    
    top :10px;    
    z-index: 100;    
    transition: all 0.5s linear;
}
.flip-list-move { 
    transition: transform 0.8s ease;
}
.flip-list-enter-active,.flip-list-leave-active { 
    transition: all 1s ease;
}
.flip-list-enter-from,.flip-list-leave-to { 
    opacity: 0; transform: translateX(30px);
}

.modal-enter-from {
      opacity: 0;
      transform: translateY(-60px);
    }
    .modal-enter-active {
      transition: all 0.3s ease;
    }
    .modal-leave-to {
      opacity: 0;
      transform: translateY(-60px);
    }
    .modal-leave-active {
      transition: all 0.3s ease;
    }
</style>
