<!-- @Author: wxiaojia 
 * @Date: 2021-12-23 22:55:30 
 * @Last Modified by:   wxiaojia 
 * @Last Modified time: 2021-12-23 22:55:30 
  -->

<template>
 <transition name="toast" @after-leave="afterLeave" @after-enter="afterEnter">
    <!-- 弹窗 -->
    <div ref="container" class="toast-container" :style="toastStyle" v-show="visible" @mouseenter="clearTimer" @mouseleave="createTimer">
        <!-- icon图标 -->
        <template v-if="type || type != 'custom' || type != 'img'">
            <div class="toast-icon success" v-if="type==='success'">
                <i class="fi fi-br-check"></i>
            </div>
            <div class="toast-icon warning" v-if="type==='warning'">
                ?
            </div>
            <div class="toast-icon info" v-if="type==='info'">
                <i class="fi fi-sr-bell-ring"></i>
            </div>
            <div class="toast-icon error" v-if="type==='error'">
                <i class="fi fi-br-cross-small"></i>
            </div>
        </template>

        <div :style="{'backgroundColor': customIconBackground}" class="toast-icon" v-if="type==='custom'" v-html="customIcon"></div>
        <img class="toast-custom-img" :src="customImg" v-if="type==='img'"/>

        <!-- 主要内容 -->
        <div class="toast-content">
            <!-- 标题及其倒计时 -->
            <div class="toast-head" v-if='title'>
               <!-- title -->
                <span class="toast-title">{{title}}</span>
                <!-- time -->
                <span class="toast-countdown">{{countDown}}</span>
            </div>

            <!-- body -->
            <div class="toast-body" v-if="message" v-html="message"></div>

            <!-- 操作按钮 -->
            <div class="toast-operate" v-if="confirmHandle">
            <a class="toast-button-confirm" 
               :class="[{'success':type==='success'},
                        {'warning':type==='warning'},
                        {'info':type==='info'},
                        {'error':type==='error'}]"
                        @click="confirmHandle">{{confirmText}}</a>
            </div>

        </div>
            <!-- 关闭 -->
        <div v-if="closeIcon" class="toast-close"  @click="destruction">
            <i class="fi fi-rr-cross-small"></i>
        </div>
       
    </div>
</transition>
</template>

<script lang='ts' setup>
import Bus from './toastsBus.js'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    closeIcon: {
        type: Boolean,
        default: true
    },
    autoClose: {            // 自动关闭弹框时间
        type: Number,
        default: 4500
    },
    type: {
        type: String,
        validator: function(val) {
            return ['success', 'warning', 'info', 'error', 'custom', 'img'].includes(val);
        }
    },
    customIconBackground: String,
    customIcon: String,
    customImg: String,
    title: String,
    message: String,
    confirmHandle: Function,
    confirmText: String,
})
// 框样式
const toastStyle = computed(()=>{
    return {
        top: `${toastPosition.value.y}px`,
        right: `${toastPosition.value.x}px`,
    }
})

 // 倒计时
 const countDown = computed(()=>{
    return '2 seconds ago'
})

// 是否展示
const visible = ref(false)
// toast的id
const id = ref('')
// toast容器实例
const container = ref(null);
// toast本身高度
const height = ref(0);
// 定时器
const timer = ref(null)
// toast位置
const toastPosition = ref({
    x: 16,
    y: 16
})

// 鼠标移入，停止计时
const clearTimer = () => {
    if(timer.value) {
        clearTimeout(timer.value)
    }
}
// 鼠标移走
const createTimer = () => {
    if (props.autoClose) {
        timer.value = setTimeout(() => {
            visible.value = true
        }, props.autoClose)
    }
}

// 框 离开和进入的动画
const afterLeave = () => {
    // 告诉 instance.js 需要进行关闭操作 ()
    Bus.$emit('closed',id.value);
}
const afterEnter = () => {
    height.value = container.value.offsetHeight
}

// 销毁
function destruction(){
    visible.value = false
}

 // 主动关闭
function close(){
    destruction();
}

onMounted(()=>{
    createTimer();
})
onBeforeUnmount(()=>{
    if(timer.value)
        clearTimeout(timer.value)
})
</script>

<style lang="scss" scoped>
// 外部容器
.toast-container{
    width: 330px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
    background-color: rgba(#F7F7F7, .6);
    border: 1px solid #E5E5E5;
    padding: 14px 13px;
    z-index: 1001;
    position: fixed;
    top: 0;
    right: 0;
    border-radius: 10px;
    backdrop-filter: blur(15px);
    display: flex;
    align-items: stretch;
    transition: all .3s ease;
    will-change: top,left;
}
// -------------- icon --------------
.toast-icon, .toast-close{
    flex-shrink: 0;
}
.toast-icon{
    width: 30px;
    height: 30px;
    border-radius: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
// 正确
.toast-icon.success{
    background-color: rgba(#2BB44A, .15);
    color: #2BB44A;
}
// 异常
.toast-icon.warning{
    background-color: rgba(#ffcc00, .15);
    color: #F89E23;
    font-weight: 600;
    font-size: 18px;
}
// 错误
.toast-icon.error{
    font-size: 18px;
    background-color: rgba(#EB2833, .1);
    color: #EB2833;
}
// 信息
.toast-icon.info{
    background-color: rgba(#3E71F3, .1);
    color: #3E71F3;
}
// 自定义图片
.toast-custom-img{
    width: 40px;
    height: 40px;
    border-radius: 10px;
    overflow: hidden;
    flex-shrink: 0;
}
// ------------- content -----------
.toast-content{
    padding: 0 8px 0 13px;
    flex: 1;
}
// -------------- head --------------
.toast-head{
    display: flex;
    align-items: center;
    justify-content: space-between;
}
// title
.toast-title{
    font-size: 16px;
    line-height: 24px;
    color: #191919;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
// time
.toast-countdown{
    font-size: 12px;
    color: #929292;
    line-height: 18.375px;
}
// --------------- body -----------
.toast-body{
    color: #191919;
    line-height: 21px;
    padding-top: 5px;
}
// ---------- close -------
.toast-close{
    padding: 3px;
    cursor: pointer;
    font-size: 18px;
    width: 24px;
    height: 24px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
.toast-close:hover{
    background-color: rgba(#E4E4E4, .5);
}
// --------- operate ----------
.toast-button-confirm{
    font-weight: 600;
    color: #3E71F3;
}
.toast-button-confirm:hover{
    color: #345ec9;
}
// 成功
.toast-button-confirm.success{
    color: #2BB44A;
}
.toast-button-confirm.success:hover{
    color: #218a3a;
}
// 异常
.toast-button-confirm.warning{
    color: #F89E23;
}
.toast-button-confirm.warning:hover{
    color: #df8f1f;
}
// 信息
.toast-button-confirm.info{
    color: #3E71F3;
}
.toast-button-confirm.info:hover{
    color: #345ec9;
}
// 错误
.toast-button-confirm.error{
    color: #EB2833;
}
.toast-button-confirm.error:hover{
    color: #c9101a;
}


/*动画*/
.toast-enter-from,
.toast-leave-to{
  transform: translateX(120%);
}
.v-leave-from,
.toast-enter-to{
  transform: translateX(00%);
}
</style>