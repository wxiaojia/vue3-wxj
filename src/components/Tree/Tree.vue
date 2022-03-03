<!--
 * @Author: wxiaojia 
 * @Date: 2021-12-30 17:32:53 
 * @Last Modified by:   wxiaojia 
 * @Last Modified time: 2021-12-30 17:32:53 
 * 实现功能：
 * 1、有+ 是文件 ✅
 * 2、展开，收起  ✅
 * 3、向外拖拽  ✅
 * 4、多个文件，拖拽到当前位置展开这个文件
 * 5、添加删除功能
 * 6、自定义渲染
 * 7、外部展开收缩设置
 * -、更多的功能，参考element3，极客vue3- 24讲
-->

<template>
    <div>
        <ul class="demo">
            <li v-if='isChildren' @click='toggleState'
                @dragover='dragOver'
                @drop='e => drop(e, treeData)'> 
                + {{ treeData[mapping.title] }}
            </li>
            <li v-else>
                <span  @dragstart="e => dragstart(e, treeData)"
                        draggable="true"
                        >{{ treeData[mapping.title] }}
                </span>
            </li>
            <ul v-show='isClose'>
                <tree 
                    v-for='(item, index) in treeData[mapping.children]' 
                    :treeData='item'
                    :key='item[mapping.title]'
                    :mapping='mapping'
                    :dragCallback='dragCallback'>
                </tree>
            </ul>
        </ul>
    </div>
</template>

<script lang='ts'>
    export default {
        name: 'Tree'
    }
</script>

<script lang='ts' setup>
import { computed, withDefaults, ref } from 'vue'

const isClose = ref(false)

interface TreeDate {
    name: string,
    children: TreeDate[]
}
interface Mapping {
    title: string,
    children: string
}
interface Props{
    treeData: TreeDate,
    mapping?: Mapping,
    dragCallback?: Function
}
// 设置props默认值
const props = withDefaults(defineProps<Props>(), {
    treeData: () => ({}),
    mapping: () => ({ title: 'name', children: 'children'}),
    dragCallback: () => {}
})

const isChildren = computed(() => {
    const { mapping, treeData } = props
    if (mapping) {
        return treeData && treeData[mapping.children] && treeData[mapping.children] instanceof Array
    }
    return treeData && treeData.children && treeData.children > 0
})

// 文件夹打开收起
const toggleState = () => {
    isClose.value = !isClose.value
}

// 执行外界的
const dragstart = (e, data) => {
    // console.log(e, data)
    // console.log(e.dataTransfer)
    e.dataTransfer.setData('guid', data.id)
    // console.log(e)
    if (props.dragCallback) {
        props.dragCallback(e, data)
    }
}
const dragOver = e => {
    e.preventDefault();
}

const drop = (e, data) => {
    e.stopPropagation();
    const startGuid = e.dataTransfer.getData('guid');
    const endGuid = data.id;
    console.log(startGuid, endGuid)
    if(startGuid!==endGuid){
        // 1. 在树形数据里，把startNode找到，先用一个变量存起来，然后在树里面删除
        // 2. 在把endNode找到，往后面插入startNode，即存起来的变量，
        // 3. 更新树
    }
}
// 新增
const addDir = () => {

}
// const loop = (data, key, callback) => {
//     data.forEach((item, index, arr) => {
//         if (item.guid === key) {
//             callback(item, index, arr);
//             return;
//         }
//         if (item.children) {
//             loop(item.children, key, callback);
//         }
//     });
// };
const loop = (data: any, key: string, callback: any) => {
    data.forEach((item: any, index: number, arr: any[]) => {
        if (item.id === key) {
            callback(item, index, arr)
            return
        }
        if (item.children) {
            loop(item.children, key, callback)
        }
    })
}

</script>

<style lang="scss" scoped>
  .demo{
    padding:5px 0;
    margin:3px 10px;
    text-align: left;
    font-size:16px;
    max-width:500px;
    border-left:1px dashed #999;
    li {
        list-style: none;
        &:before {
            content:'--';
            display: inline-block;
            padding:0 4px;
        }
    }
    
  }
</style>