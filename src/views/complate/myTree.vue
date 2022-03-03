<template>
    <section v-for='item of treeList'>
        <Tree :treeData='item' :dragCallback='dragstart' :mapping='mapping'></Tree>
    </section>
</template>

<script lang='ts' setup>
import Tree from 'components/Tree/Tree.vue'
import treeList from './treeData.js'

const mapping = {
    title: 'label',
    children: 'children'
}
const dragstart = () => {}
</script>