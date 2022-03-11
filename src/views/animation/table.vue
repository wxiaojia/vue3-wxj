<!-- 定义能够看到的一共有多少条，然后下方重复这几条，往上滚动，
    如果第一条是重复的第一条，改变他的top值回到真正的第一条，可实现重复滚动 -->

<template>
    <div class='descrition'>
        <p>* 表格滚动</p>
        <p>* 使用css的transition过渡属性，v-bind绑定css的top值进行移动</p>
    </div>
   <div class='table'>
        <div class='header'>
            <span>日期</span>
            <span>姓名</span>
            <span>地址</span>
        </div>
        <div class='tbody'>
            <ul ref='ul' id='uls' :class='{"animate": !end}' @mouseover='mouseOver' @mouseout="mouseOut">
                <li v-for='item, index in tableData' :key='index'>
                    <span>{{ item.date }}</span>
                    <span>{{ item.name }}</span>
                    <span>{{ item.address }}</span>
                </li>
                <!-- 用于无缝滚动 -->
                <li v-for='(item, i) in 3' :key='i'>
                    <span>{{ tableData[i].date }}</span>
                    <span>{{ tableData[i].name }}</span>
                    <span>{{ tableData[i].address }}</span>
                </li>
            </ul>
        </div>
   </div>

</template>

<script lang='ts' setup>
import { ref, onMounted, computed, watch, stop } from 'vue'

const tableData = [{
    date: '2016-05-02',
    name: '1王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
}, {
    date: '2016-05-04',
    name: '2王小虎',
    address: '上海市普陀区金沙江路 1517 弄'
}, {
    date: '2016-05-01',
    name: '3王小虎',
    address: '上海市普陀区金沙江路 1519 弄'
}, {
    date: '2016-05-03',
    name: '4王小虎',
    address: '上海市普陀区金沙江路 1516 弄'
}, {
    date: '2017-05-03',
    name: '5王小虎',
    address: '上海市普陀区金沙江路 1516 弄'
}, {
    date: '2019-05-03',
    name: '6王小忘',
    address: '上海市普陀区金沙江路 1516 弄'
}, {
    date: '2020-05-03',
    name: '7王小丫',
    address: '上海市普陀区金沙江路 1516 弄'
}]


let ul = ref<HTMLElement>(null)
let top = ref('')
let timer = null
let scrollIndex = ref(0)
let end = ref(false)

const sleep = (fn, wait) => {
    return new Promise((resolve, reject) => {
        fn()
        setTimeout(() => {
            resolve()
        }, wait)
    })
}

const animate = async () => {
    const roll = () => {
        top.value = -70 * scrollIndex.value + 'px'  // 70 li的高度
        scrollIndex.value++    
        if (scrollIndex.value > tableData.length + 1) {
            clearInterval(timer)
            // 偷偷移动到上面的，先取出那个class，然后再该top，再加上类
            scrollIndex.value = 0
            sleep(() => {
                end.value = true
                top.value = 0 + 'px'
            }, 500).then(() => {
                end.value = false
                animate()
            })
        }
    }
    timer = setInterval(roll, 1500)
}

const mouseOver = () => {
    timer && clearInterval(timer)
}

const mouseOut = () => {
    timer && clearInterval(timer)
    animate()
}

onMounted(() => {
    animate()
})

</script>

<style lang='scss' scope>
    .descrition {
        text-align: left;
        padding: 20px;
    }
    .table {
        width: 600px;
        margin-top: 60px;
        span{
            display: inline-block;
            width: 33%;
        }
    }
    .tbody {
        height: 200px;
        overflow: hidden;
        position: relative;
        ul {
            position: absolute;
            width: 600px;
            top: v-bind(top);
            li {
                height: 70px;
            }
        }
    }
    .animate {
        transition: all 1s;
    }
</style>


