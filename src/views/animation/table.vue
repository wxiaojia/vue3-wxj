<template>
   <div class='table'>
        <div class='header'>
            <span>日期</span>
            <span>姓名</span>
            <span>地址</span>
        </div>
        <div class='body'>
            <ul>
                <li v-for='item, index in tableData' :key='index'>
                    <span>{{ item.date }}</span>
                    <span>{{ item.name }}</span>
                    <span>{{ item.address }}</span>
                </li>
            </ul>
        </div>
   </div>

</template>

<script lang='ts' setup>

const tableData = [{
    date: '2016-05-02',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄'
}, {
    date: '2016-05-04',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1517 弄'
}, {
    date: '2016-05-01',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1519 弄'
}, {
    date: '2016-05-03',
    name: '王小虎',
    address: '上海市普陀区金沙江路 1516 弄'
}]
</script>

<style lang='scss' scope>
    .table {
        width: 600px;
        span{
            display: inline-block;
            width: 33%;
        }
    }
</style>