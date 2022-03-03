<!--
    请求很多：控制并发量
    中间点击其他的：点击的请求优先级更高（控制并发量的时候就已经实现了，因为请求延后，中间点击的那个已经会立即发出请求）
-->
<template>
    多请求控制并发量（并且能通过先发送请求，不卡住）
    <br>
    <el-button @click='addRequest'>请求10个</el-button>
    <el-button @click='insert'>插入</el-button>
</template>

<script lang='ts' setup>
import { request, insertReq } from '@/api/http.js'

const requestFns: any[] = [];

const realRequest = (i: number) => {
    return () => request({index: i})
}

const concurrentRequest = (requestFns: any[], limit = 3) => {
    // 递归函数,无论成功失败，只要结束就发起另一个请求
    function recursion(requestFn: any) {
        requestFn().finally(() => {
            if (_requestFns.length > 0) {
                recursion(_requestFns.pop())
            }
        })
    }
    const _requestFns = [...requestFns];
    for(let i = 0; i< limit && _requestFns.length > 0; i++) {
        recursion(_requestFns.pop())
    }
}

const addRequest = () => {
    for(let i = 0; i < 10; i++) {
        requestFns.push(realRequest(i))
    }
    concurrentRequest(requestFns, 3);
}

const insert = () => {
    insertReq().then(res => {
        console.log(res)
    })
}
</script>