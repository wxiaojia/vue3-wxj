<template>
    <tree-comp :treeData="mainData"></tree-comp>
  </template>
  <script lang='ts'>
  export default {
    name: 'treeRender',
    data () {
      return {
        mainData: {
          value: "root",
          children:[
            {
              value: "层级1-1",
              children:[{
                value: "层级2-1",
                children:[{
                  value: "层级3-1",
                  children:[]
                }]
              },{
                value: "层级2-2",
                children:[]
              }]
            },{
              value: "层级1-2",
              children:[]
            }
          ]
        }
      }
    },
    components:{
      treeComp:{
        functional: true,
        props: {treeData: Object},
        render(h, {props: {treeData = {}}}) {
          const creatNode = (node)=>{
            if(node.children && node.children.length > 0){
              let hArr = node.children.map(item=>{
                return creatNode(item)
              })
              return h('div', {class:'demo'}, [node.value, hArr])
            }else{
              return h('div', {class:'demo'}, [node.value])
            }          
          }
          return creatNode(treeData)
        },
      }
    },
    mounted(){},
    methods:{}
  }
  </script>

  <style lang="scss" scoped>
    .demo{padding:5px 0;margin:1px 10px;text-align: left;font-size:16px;max-width:500px;border-left:1px dashed #999;
      &:before{content:'--';display: inline-block;padding:0 4px;}
    }
  </style>