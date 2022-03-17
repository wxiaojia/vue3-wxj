<!--
 * @Author: wxiaojia 
 * @Date: 2021-12-30 18:01:43 
 * @Last Modified by:   wxiaojia 
 * @Last Modified time: 2021-12-30 18:01:43 
-->
<template>
    <!-- 左侧 -->
    <section class='left'>
        <img src='static/img/logo.png'>
        <tree :treeData='treeList' :dragCallback='dragstart' :isOpenRoot='true'></tree>
      
    </section>
    <!-- 中间 -->
    <section class='center'>
      <section>
        <canvas class='filterCir' id='filterCir' draggable="true" @dragstart='dragstart'>
          您的浏览器不支持canvas，请升级您的浏览器
        </canvas>
      </section>
      <section id='canvasOut' @drop='drop' @dragover="allowDrop">
        <!-- <div class='dropDiv' draggable="true" @dragstart="innerDrag">我在这</div> -->
        <canvas id='canvas'
                @mousedown="canvasMouseDown"
                @mouseover="canvasMouseOver"
                @mouseleave="canvasMouseLeave"></canvas>
        <!-- 表名太长时，鼠标上移显示 -->
        <section class='showNameWin' v-show='showName.isShow' :style='showName.style'>
          <p v-for='(name, index) in showName.list' :key='index' v-text='name'></p>
        </section>
        <!--  -->
        <section class="contextMenu"  v-show='eventParam.isContextMenu' :style='contextMenu.style'>
          <ul>
            <!-- <li v-if='isStopAnalys'>停止分析</li>
            <li v-if='isRefresh'>刷新</li> -->
            <li>停止分析</li>
            <li>刷新</li>
          </ul>
        </section>
      </section>
    </section>
    <!-- 操作条件框 -->
    <dialogFrom :dialogFormVisible='dialogFormVisible' @cancelOpe='cancelOpe' @sureOpe='sureOpe'></dialogFrom>

</template>

<script lang='ts' setup>
import { ElMessageBox } from 'element-plus'

import { onMounted, ref, reactive, computed, watch, toRefs } from "vue"
import Tree from 'components/Tree/Tree.vue'
import dialogFrom from './dialogForm.vue'

import list from './mock/list'
import string from 'utils/common/string.js'
import array from 'utils/common/array.js'
import formula from 'utils/common/formula.ts'
import dataSourceJson from './json/dataSource.json'
import analysParam from './json/analysParam.json'
import resultSetJSON from './json/resultSet.json'
import Circle from './class/filter.js'
import myCanvas from './canvasUtil.js'
import util from './util.js'

import useInitCanvas from './initCanvas.ts'
import useGrid from './grid.ts'
import usedDraw from './draw.ts'
import useGetResource from './getResource.ts'
import useMouseEvent from './mouseEvent.ts'

import { EventParam } from './param.ts'
// import useVirtualScroll from "element-plus/lib/el-virtual-list/src/useVirtualScroll"
// import { CommonProps } from "element-plus/lib/el-cascader-panel"
import { result } from 'lodash'
import { log } from 'console'

const treeList = ref({
  name: '全部',
  children: list
})
let  dialogFormVisible = ref<boolean>(false)         // 选择操作弹框
const isChangeDragAndDrop = ref<boolean>(false)      // 是否在该div中拖拽的
const openModel = ref({})       // 目前打开操作的标签(还没完成)
const resultKey = ref('1')      // 结果集key,为什么是字符串
const runState = {              // 结果集的生成状态，可以减少
  0: '未运行',
  10: '等待运行',
  20: '正在运行',
  30: '手动停止',
  40: '异常停止',
  50: '正常结束'
}
const leftSide = 300  // 左侧导航菜单的宽度（用处：拖动资源的时候放置需要，如果左侧搜索则是不一样的值）
const isMove = ref<boolean>(false) // Q:这个isMove和下面的 eventParam.isMove 有什么区别 A:是否为有效，如果差距为0，为无效，不为0，移动跟画线都为true
// 鼠标事件
const eventParam = reactive({
  isContextMenu: false,   // 右键的菜单
  isMove: false,
  isOver: false,          // ？
  mouseDownBeginTime: 0,  // 记录开始点击时间， why??
  isDrawLine: false,      // 是否划线
  isMouseDown: false,     // 是否点击下去
})  

// 右键
const contextMenu = reactive({
  data: {       // 可右键的结果集对象
    type: 0,
    state: '0'
  },
  isShow: false,  // 是否可显示
  style: {      // 样式
    top: '0',
    left: '0'
  },
})
// 是否可以停止分析
const isStopAnalys = computed(() => {
  const {data} = contextMenu
  return data && data.type === 4 && data.state === '20'
})
// 是否可以刷新
const isRefresh = computed(() => {
  const {data} = contextMenu
  return data && data.type === 4 && ['0', '10', '20', '30', '40', '50'].includes(data.state)
})

// 鼠标上移显示的文字
const showName = reactive({
  isShow: false,  
  list: [],       
  style: {},     
})

// 移动记录
const moveCoordinate = reactive({
  beginX: 0,
  beginY: 0,
  x: 0,
  y: 0,
  id: ''
})

const modelConfig = reactive({
  dataRelation: {},
  dsNum: 0,   // 操作资源个数（包括删除的）
  rsNum: 0,   // 操作个数（包括删除的）
  w: 0,
  h: 0,
  resource: {},
  rIdMapping: '',   //
  moduleKey: 0,     
  isNowModel: true,   // 是否为现在打开的模型
  countMapping: 0,  // 
  stepIdMapping: 0 // 
})

const canvasParam = reactive({
      ctx: null,
      w: 0,
      h: 0,
      left: 0,
      top: 0,
      // 画线上一点的坐标位置id
      oldLineLocation: {
          startId: '',    // 拉线开始的组件id
          endId: ''       // 拉线结束后的组件id
      }
  })
  
interface Path {
  id: string,
  path: string
}
interface dataRelation {
  id: string,
  relation: Path[],
  scope: any[]
}
const state = reactive({
    lineCoordinate: [],   // 画线的坐标  
    dataRelation: {},     // 存储画布上的结果资源
    moduleKey: 0,
    dataSource: [],     // 拖动的元素（如果是一整块，是多个吗？）
    resource: new Map(),   // 存放已放入的资源（all）
    ctx: null,
    canvas: null,
    xl: 0,              // 现有的栅栏布局个数（横向）
    gridArr: [],        // 画布栅格化数组 size * size
    size: 500,
})

// 点击右键
const canvasContextmenu = (e: MouseEvent) => {
  getOffset()
  // 获取当前经纬度
  // 获取当前点击的对象，通过gridArr来拿
   // 当前鼠标在画布中的坐标
  let x = e.pageX - canvasParam.left - leftSide
  let y = e.pageY - canvasParam.top
  let resouceObj = getCoordinateResource({x, y}, true)
  console.log('右键点击的资源', resouceObj, x, y)
  if (resouceObj === null) return
  
  contextMenu.style.top = y + state.canvas.parentNode.offsetTop + 'px'
  contextMenu.style.left = x + state.canvas.parentNode.offsetLeft + 'px'
  eventParam.isContextMenu = true

  window.event.returnValue = false  // 去除了右键的默认效果
  return false
}
// =====================整理========================
// 初始化
const { initCanvasParam, initFilterCanvas } = useInitCanvas(state, canvasContextmenu, canvasParam)
// 关于grid
const { deleteGridArr, changeGridArr} = useGrid(state)
// 画图形
const { drawCircle, drawDataSource, drawCondition, drawResultSet, drawImg } = usedDraw(state, canvasParam)
// 关于获取当前资源
const { getCoordinateResource, getCoordinateResourceRelation, getDataRelactionId } = useGetResource(state, canvasParam)
// mouse事件,canvas？
const { } = useMouseEvent()
onMounted(() => {
    initCanvasParam()        // 初始化画布，大小
    initFilterCanvas()  // 右边的条件圈圈
})

// 操作类型选择弹窗
const sureOpe = (opeType: string) => {
  // dialogFormVisible.value = false 
  // 成功提交cb(成功后提交返回的一些信息, 条件)
  let data = {
    stepId: '我是步骤的id',
    resourceName: '结果集',
    resourceId: resultKey,
    parentId: canvasParam.oldLineLocation.startId,
  }
  resultKey.value = resultKey.value + '' + Math.random() * 100 
  let param = {
    type: 1,
    column: [],
    pId: canvasParam.oldLineLocation.startId,
    opeType: opeType
  }

  let cb = (data: any, param: any, isNew: boolean) => {
      dialogFormVisible.value = false

      param = param || {}
      param.lId = canvasParam.oldLineLocation.startId
      param.rId = canvasParam.oldLineLocation.endId
      clearCanvasMoveAndDrawLine()
      // 生成结果
      chooseCondition(data, param, isNew)
      window.requestAnimationFrame(initCanvas)
      // updateModelConfig()
  }
  cb(data, param, true)
}

const cancelOpe = (cb: any) => {
  dialogFormVisible.value = false
  clearCanvasMoveAndDrawLine()
  window.requestAnimationFrame(initCanvas)
}

// =====================整理完毕========================

// ===============目前还没调用==============================
// 更新模型信息
const updateModelConfig = () => {
  let dataRelation = { ...state.dataRelation }
  let arr = Object.keys(dataRelation)
  for (let i = 0; i < arr.length; i++) {
    delete dataRelation[arr[i]].canvas
  }
  modelConfig.dataRelation = dataRelation
  modelConfig.resource = util.mapToJson(state.resource)
  modelConfig.w = canvasParam.w
  modelConfig.h = canvasParam.h

  // console.log(modelConfig)
}

// 清空画布初始化值
const initIdAndNum = () => {
  // id = 0
  // dsNum = 1
  // rsNum = 1
  state.dataRelation = {}
  state.gridArr = []
  state.xl = Math.floor(canvasParam.w)
  util.changeGridSize(state.gridArr, {w: canvasParam.w, h: canvasParam.h})
}
// ===============目前还没调用 - 结束==============================

// 重新绘画画布中的内容
const initCanvas = () => {
  if(window.requestAnimationFrame) {
    // 大小
    state.canvas.width = canvasParam.w
    state.canvas.height = canvasParam.h
    // 背景颜色
    canvasParam.ctx.fillStyle = analysParam.canvas.fillStyle
    // 清空内容
    canvasParam.ctx.fillRect(0, 0, canvasParam.w, canvasParam.h)
    // console.log(state.resource)
    // 开始绘画
    if(state.resource.size === 0) {
      myCanvas.fillText(canvasParam.ctx, analysParam.fontParam.defaultText, '请拖动资源到画布', canvasParam.w / 2, canvasParam.h / 2)
      return
    }
    // 下面这里代码重复性很高啊！！！
    // 在移动，画线移动还是拖拽移动，看moveCoordinate存的是什么
    if (eventParam.isMove && moveCoordinate.id != '') {
      // 获取当前关系,将当前不在移动的重新画
      // 为什么分开写？？
      let arr = Object.keys(state.dataRelation)
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== moveCoordinate.id) {
          let temp = state.dataRelation[arr[i]]
          myCanvas.drawCanvas(canvasParam.ctx, temp.canvas, {
            sx: 0,
            sy: 0,
            sw: temp.scope[2],
            sh: temp.scope[3],
            x: temp.scope[0],
            y: temp.scope[1],
            w: temp.scope[2],
            h: temp.scope[3],
          })
        }
      }
      let temp = state.dataRelation[moveCoordinate.id]
      myCanvas.drawCanvas(canvasParam.ctx, temp.canvas, {
            sx: 0,
            sy: 0,
            sw: temp.scope[2],
            sh: temp.scope[3],
            x: temp.scope[0],
            y: temp.scope[1],
            w: temp.scope[2],
            h: temp.scope[3],
      })
    } else {
      // 不在移动，直接渲染全部
      // console.log(state.dataRelation)

      let arr = Object.keys(state.dataRelation)
      for (let i = 0; i < arr.length; i++) {
          let temp = state.dataRelation[arr[i]]
          myCanvas.drawCanvas(canvasParam.ctx, temp.canvas, {
            sx: 0,
            sy: 0,
            sw: temp.scope[2],
            sh: temp.scope[3],
            x: temp.scope[0],
            y: temp.scope[1],
            w: temp.scope[2],
            h: temp.scope[3],
          })
      }
    }
    // 画箭头
    const { x0, x1, y0, y1 } = state.lineCoordinate[0] || {}
    if (state.lineCoordinate.length > 0 && 
        (Math.abs(x0 - x1) > 5) ||
        (Math.abs(y0 - y1) > 5)) {
          // 这个是什么？
          let canvas = document.createElement('canvas')
          canvas.width = 40
          canvas.height = 40
          let ctx = canvas.getContext('2d')
          // 求出角度
          let angle = formula.getAngle({
            x: state.lineCoordinate[0].x0,
            y: state.lineCoordinate[0].y0
          }, {
            x: state.lineCoordinate[0].x1,
            y: state.lineCoordinate[0].y1
          })
          console.log('angle', angle)
          ctx.translate(20, 20)
          ctx.rotate((angle - 90) * Math.PI / 180)
          ctx.translate(-20, -20)
          ctx.fillStyle = 'transparent'
          // 清空内容
          ctx.fillRect(0, 0, 40, 40)
          myCanvas.drawLine(ctx, {
            fillStyle: state.lineCoordinate[0].fillStyle,
            x0: 30,
            y0: 10,
            x1: 20,
            y1: 20
          })
          myCanvas.drawLine(ctx, {
            fillStyle: state.lineCoordinate[0].fillStyle,
            x0: 10,
            y0: 10,
            x1: 20,
            y1: 20
          })
          myCanvas.drawCanvas(canvasParam.ctx, canvas, {
            sx: 0,
            sy: 0,
            sw: 40,
            sh: 40,
            x: state.lineCoordinate[0].x1 + -20,
            y: state.lineCoordinate[0].y1 + -20,
            w: 40,
            h: 40
          })
    }

    // 画线
    for (let temp of state.lineCoordinate) {
      myCanvas.drawLine(canvasParam.ctx, temp)
    }
  }
}

// 取消划线和移动后的清空数据的方法
const clearCanvasMoveAndDrawLine = () => {
  eventParam.isMouseDown = false
  eventParam.isMove = false
  eventParam.isDrawLine = false
  canvasParam.oldLineLocation.startId = ''
  canvasParam.oldLineLocation.endId = ''
  state.lineCoordinate = []
  window.requestAnimationFrame(initCanvas)
}

// 通过资源类型获取对应的资源基本属性
const getModule = (type = 1, subType?: number) => {
  let module
  const { module: { dataSource, resultSet, condition }, relation } = analysParam
  switch (type) {
    case 1:
    case 2:
    case 3:
      module = dataSource
      break;
    case 4:
      module = resultSet
      break;
    case 5:
      module = relation[subType]
      break;
    case 6:
    case 7:
      module = condition[subType]
      break;
    case 8:
      break;
  }
  return module
}

// 判断是否移出了画布
const validateMoveSite = (site: {x: number, y: number}, data: any) => {
  let status = false
  if (data.scope[0] + site.x < 0 || data.scope[0] + data.scope[2] + site.x > canvasParam.w ||
      data.scope[1] + site.y < 0 || data.scope[1] + data.scope[3] + site.y > canvasParam.h) {
        status = true
      }
  return status
}

const moveSite = (site: {x: number, y: number}, data: any) => {
  let changeValue = (obj) => {
    obj.scope[0] = obj.scope[0] + site.x
    obj.scope[1] = obj.scope[1] + site.y
    return obj
  }
  data = changeValue(data)
  return data
}

// 点击
const canvasClick = (e: MouseEvent) => {
  eventParam.isContextMenu = false
  getOffset()
  console.log(leftSide)
  let coordinate = {
    x: e.pageX - canvasParam.left - leftSide,
    y: e.pageY - canvasParam.top
  }
  console.log('点我了', state.gridArr)
  let resouceObj = getCoordinateResource(coordinate)
  if (resouceObj === null) {
    return
  }

  if (resouceObj.type === 7) return

  // console.log(resouceObj)
}

const canvasMouseMove = (e: MouseEvent) => {
  getOffset()
  let x = e.pageX - canvasParam.left - leftSide
  let y = e.pageY - canvasParam.top

  if (eventParam.isMove) {
    let site = {
      x: x - moveCoordinate.x,
      y: y - moveCoordinate.y
    }
    isMove.value = site.x === 0 && site.y === 0 ? false : true
    
    let resouceObj = state.dataRelation[moveCoordinate.id]
    // console.log('点击移动的资源', resouceObj)
    // 校验是否移出了画布,移出不管不添加这差距
  console.log('我是移动的',state.gridArr)

    if (!validateMoveSite(site, resouceObj)) {
      moveSite(site, resouceObj)
    }
    moveCoordinate.x = x
    moveCoordinate.y = y
    window.requestAnimationFrame(initCanvas)
  } else if (eventParam.isDrawLine) {
    isMove.value = true
    // 实时的记录位置
    state.lineCoordinate[0].x1 = x
    state.lineCoordinate[0].y1 = y
    window.requestAnimationFrame(initCanvas)
  }
}

// 创建结果对象，上面有个拖拽的
const createResultSet = (data: any, relation: any) => {
  let resultSet = {...resultSetJSON}
  let resultSetGrap = {...analysParam.module.resultSet}
  resultSet.rId = 'r' + state.moduleKey
  resultSet.id = 'rs' + state.moduleKey
  resultSet.num = modelConfig.rsNum
  resultSet.name = data.resourceName + modelConfig.rsNum
  let lineStart = util.lineStart(relation)
  resultSet.scope = [ lineStart.x, lineStart.y - resultSetGrap.marginT, resultSetGrap.gw - resultSetGrap.marginR, resultSetGrap.h ]
  modelConfig.rsNum ++
  state.moduleKey++
  return resultSet
}
// 修改dataRelation.relation的path值
const changeDataRelationPath = (relation: any[], path: string) => {
  for (let i = 0; i < relation.length; i++) {
    let temp = relation[i]
    temp.path = path + temp.path
  }
  return relation
}

// 圆形操作生成结果集
// 1、创建结果集
const chooseCondition = (data: any, param: any, isNew: boolean) => {
  console.log(data, param, isNew)
  // 如果不是新的，要rebuildCanvas
  if(!isNew) {
    // myCanvas.rebuildCanvas([data.id])
    return
  }

  // 新的创建结果集 resultSet：json文件中结果集基本信息, dataFilterImg数据过滤圈圈
  let [ resultSetImg, dataFilterImg ] = [ analysParam.module.resultSet, analysParam.module.condition[0] ]
  // 创建结果集

  console.log(state.dataRelation)   // 当前两个没成链的资源
  // Q：state.dataRelation中取的 和 state.resource这个获取有什么不同？
  // A：state.dataRelation 存的是{canvas, id, relation:[{id, path}], scope} ,
  //    state.resource 存储了基本信息{key, value:{echo, id, marginT, type, scope等}}
  // 左边：
  let beginDataRelation = state.dataRelation[param.lId] 
  let beginResouce = state.resource.get(param.lId)  // 左边资源
  // 右边
  let dataOpe = state.dataRelation[param.rId]       
  let dataOpeResource = state.resource.get(param.rId)  // 连线的右边，即操作圆
  
  beginResouce.isLine = false   // 只能连接一次，连接后去除这个功能
  dataOpeResource.echo = param

  console.log(data, param)  // param 连接的时候结果集信息
  let scope = [beginDataRelation.scope[0], beginDataRelation.scope[1]]
  let lineStart, addH = 0
  // 修改左边的资源的位置scope，获取画线开始坐标
  if (beginResouce.type === 4) {
    // 结果集（就是用结果集再去操作，结果集高度一致的）
    scope.push(beginDataRelation.scope[2] + 120 + dataFilterImg.w + resultSetImg.gw)
    scope.push(beginDataRelation.scope[3])
    lineStart = util.lineStart(beginResouce)
  } else {
    // 扩展结果集的canvas大小
    // marginT 即marginTop,是数值方向的中间点，因为要存储整条链的位置，所以会因为结果（比如上面的正常结束，异常）等文字改变了位置
    if (beginResouce.type <= 2) {
      addH = resultSetImg.marginT - analysParam.module.dataSource.marginT[beginResouce.paramType]
    } else {
      addH = resultSetImg.marginT - analysParam.module.dataSource.marginT[0]
    }
    // 资源位置不变，只是这个canvas的中间画布相对位置改变
    scope[1] -= addH
    scope.push(beginDataRelation.scope[2] + 120 + dataFilterImg.w + resultSetImg.gw - resultSetImg.marginR)
    scope.push(resultSetImg.h)
    beginResouce.scope[1] += addH

    beginDataRelation.canvas = myCanvas.createDataSourceCanvas(beginResouce)
    lineStart = util.lineStart(beginResouce)
  }

  // 右侧,操作圆的两条线, 左(0, 30) -> (40, 30) 右（40 + dataFilterImg.w, 30） -> (120 + dataFilterImg.w,30 )
  let y = lineStart.y
  dataOpeResource.lineCoordinate = [{
    x0: 0, y0: 30, x1: 40, y1: 30
  }, {
    x0: 40 + dataFilterImg.w, y0: 30, x1: 120 + dataFilterImg.w, y1: 30
  }]

  dataOpe.canvas = myCanvas.createConditionCanvas(dataOpeResource)
  dataOpe.scope[0] = lineStart.x
  dataOpe.scope[1] = y - dataFilterImg.r
  dataOpe.scope[2] = 120 + dataFilterImg.w

  dataOpeResource.scope[0] = lineStart.x
  dataOpeResource.scope[1] = dataOpe.scope[1]
  dataOpeResource.scope[2] = 120 + dataFilterImg.w
  console.log('line',dataOpeResource)
  let resultSet = createResultSet(data, dataOpeResource)
  
  resultSet.echo.alias = beginResouce.alias
  resultSet.echo.num = beginResouce.num
  resultSet.isDataFilter = true
  console.log(resultSet)

  // 关系链,画布中最后的节点（可多个）
  let path = resultSet.id + '/'
  let dataRelation = {
    id : resultSet.id,
    canvas: null,
    scope,
    relation: [{id: resultSet.id, path: path}]
  }
  let addPath = path + dataOpeResource.id + '/'
  dataRelation.relation.push({
    id: dataOpeResource.id,
    path: addPath
  })
  delete state.dataRelation[param.rId]
  let relationData = changeDataRelationPath(beginDataRelation.relation, addPath)
  dataRelation.relation = [ ...dataRelation.relation, ...JSON.parse(JSON.stringify(relationData))]
  delete state.dataRelation[param.lId]

  let newCanvasObj = myCanvas.getNewCanvas(self, 2, {
    beginModule: beginResouce,
    beginDataRelation,
    condition: dataOpe,
    resultSet,
    w: scope[2],
    h: scope[3]
  })

  dataRelation.canvas = newCanvasObj.canvas
  state.resource.set(resultSet.id, resultSet)
  state.dataRelation[resultSet.id] = dataRelation

  console.log(dataRelation)
  console.log(state.resource)
  console.log(state.dataRelation)

  // // commit('changeResource', state.resource)
  deleteGridArr([param.lId, param.rId])
  changeGridArr(resultSet.id)
  delete dataOpeResource.echo.lId
  delete dataOpeResource.echo.rId
  const [ x0, y0, x1, y1 ] = dataRelation.scope
  changeCanvasSize(x0 + x1 > canvasParam.w, y0 + y1 > canvasParam.h)
  // openModel.isEdit = true
}

const canvasMouseUp = (e: MouseEvent) => {
  // 点击收起（画线或者移动结束,取消监听的）
  document.body.removeEventListener('mousemove', canvasMouseMove, false)
  document.body.removeEventListener('mouseup', canvasMouseUp, false)
  // 是否为有效move
  if (isMove.value) {
    isMove.value = false

    getOffset()
    let x = e.pageX - canvasParam.left - leftSide
    let y = e.pageY - canvasParam.top

    // 画线
    if (eventParam.isDrawLine) {
      let resouceObj = getCoordinateResourceRelation(moveCoordinate, { x, y }, 2)

      if (resouceObj && resouceObj.id !== canvasParam.oldLineLocation.startId) {
          let temp = state.resource.get(resouceObj.id)  // 获取最后鼠标所在的资源信息
          console.log(temp)
          // 指向的是圆形的操作
          if (temp.isLine || [7, 8].includes(temp.type)) {
            if (temp.type === 4 && temp.runStatus !== '50') {
              // 只对正常结束状态的结果集设置关联关系
              clearCanvasMoveAndDrawLine()

              return
            } 
            canvasParam.oldLineLocation.endId = temp.id
            eventParam.isDrawLine = false
            // 拉线后判断是否为组件关系？？
            if (temp.type === 7) {
              // 过滤，拉线过的操作
              // 弹框，选择，确定，拉线，生成结果集
              dialogFormVisible.value = true
              console.log('我到这了到这了', dialogFormVisible.value)
              // sureOpe((data: any, param: any, isNew: boolean) => {
              //   console.log('我打开了吗')
              //   param = param || {}
              //   param.lId = canvasParam.oldLineLocation.startId
              //   param.rId = canvasParam.oldLineLocation.endId
              //   clearCanvasMoveAndDrawLine()
              //   // 生成结果
              //   chooseCondition(data, param, isNew)
              //   window.requestAnimationFrame(initCanvas)
              //   // updateModelConfig()
              // })
            } else {
              // 其他的拉线，设置关联关系&资源相加
            }
          }
      } else {
        // 不存在 或者 就是自己
        clearCanvasMoveAndDrawLine()
      }
    }
    // console.log(eventParam.isMove)
    // 移动
    if (eventParam.isMove) {
      // 判断是否与其他模型向碰撞，这个比较复杂，可能根据展示的不同，计算的不同,
      // 碰撞了
      // if () {
      //   state.dataRelation[moveCoordinate.id].scope[0] = moveCoordinate.beginX
      //   state.dataRelation[moveCoordinate.id].scope[1] = moveCoordinate.beginY
      // } else {
      deleteGridArr([moveCoordinate.id])
      changeGridArr(moveCoordinate.id)
      // }
      clearCanvasMoveAndDrawLine()
      // 更新该模型的配置（主要是宽高）
    }

  } else {
    // 无效的，就当作是点击事件
    canvasClick(e)
    clearCanvasMoveAndDrawLine()
  }
}

const canvasMouseDown = (e: MouseEvent) => {
    clearCanvasMoveAndDrawLine()
    eventParam.isMouseDown = true
    if (state.resource.size === 0) {
      eventParam.isMouseDown = false
      return
    }

    eventParam.isContextMenu = false
    isMove.value = false
    eventParam.mouseDownBeginTime = new Date().getTime()

    getOffset()
    // 当前点击坐标
    let coordinate = {
      x: e.pageX - canvasParam.left - leftSide,
      y: e.pageY - canvasParam.top
    }
    let resouceObj = getCoordinateResource(coordinate)
    console.log('我嗯下了', resouceObj)

    if (resouceObj === null) {
      return
    }

    // 通过资源类型获取对应的资源基本属性
    let module
    // Q: 为什么要获取顶层对象的？？？移动的时候要整条链移动，但是为啥这里只要顶层的呢
    // A: 因为 dataRelation 存的 key 是一个关系链中的最后一个
    moveCoordinate.id = getDataRelactionId(resouceObj.id)
    let dataRelation = state.dataRelation[moveCoordinate.id]
    if (resouceObj.type === 5) {
      // 如果是关联关系的 
      module = getModule(resouceObj.type, resouceObj.rType)
    } else if ([6, 7].includes(resouceObj.type)) {
      // 7 数据过滤 echo???
      module = getModule(resouceObj.type, resouceObj.echo.type)
    } else {
      module = getModule(resouceObj.type)
    }
    // 判断是连线还是移动-eventParam
    switch (resouceObj.type) {
      case 1:
      case 2:
      case 3:
        // 资源能否连线
        if (resouceObj.isLine) {
          if (util.coordinateInCircular(coordinate, {
            x: module.lineCircular.x + resouceObj.scope[0] + dataRelation.scope[0],
            y: module.lineCircular.y[resouceObj.paramType] + resouceObj.scope[1] + dataRelation.scope[1],
            r: module.lineCircular.r
          })) {
            eventParam.isDrawLine = true
          } else {
            eventParam.isMove = true
          }
        } else {
            eventParam.isMove = true   
        }
        // console.log('是不是移动', eventParam.isMove)
        break;
      case 4: 
        // 结果集是否能连线
        if (resouceObj.isLine) {
          if (util.coordinateInCircular(coordinate, {
            x: module.lineCircular.x + resouceObj.scope[0] + dataRelation.scope[0],
            y: module.lineCircular.y + resouceObj.scope[1] + dataRelation.scope[1],
            r: module.lineCircular.r
          })) {
              if (resouceObj.runStatus === '50') {
                eventParam.isDrawLine = true
              } else {
                // 只能对正常结束状态的结果集进行操作
              }
          } else {
            eventParam.isMove = true
          }
        } else {
          eventParam.isMove = true
        }
        break;
      case 5:
        eventParam.isMove = true
        break;
      case 6:
        break;
      case 7: 
      case 8:
      case 9:
        eventParam.isMove = true
        break;
    }
    console.log(eventParam.isDrawLine)
    console.log(eventParam.isMove)
    if (eventParam.isDrawLine) {
      // 连线
      canvasParam.oldLineLocation.startId = resouceObj.id
      // 为什么需要这么多参数, x0,y0,初始的，x1,y1实时记录的坐标（move的时候记录）
      state.lineCoordinate.push({
        x0: coordinate.x,
        y0: coordinate.y,
        x1: coordinate.x,
        y1: coordinate.y,
        fillStyle: analysParam.lineParam,
      })
    } else if (eventParam.isMove) {
      // 移动
      moveCoordinate.beginX = dataRelation.scope[0]
      moveCoordinate.beginY = dataRelation.scope[1]
      moveCoordinate.x = coordinate.x
      moveCoordinate.y = coordinate.y
    }

    document.body.addEventListener('mousemove', canvasMouseMove, false)
    document.body.addEventListener('mouseup', canvasMouseUp, false)
    
}
// 进入canvas的监听，canvasMouseMove是点击后的滑动监听
const canvasMouseOver = () => {
    // console.log('mouseOver')
    // console.log('进入')
}
const canvasMouseLeave = () => {
    // console.log('mouseLeave')
    // console.log('离开')
}

    // 获取canvas的信息
const getOffset = () => {
    try {
      canvasParam.top = state.canvas.parentNode.offsetTop
      canvasParam.left = state.canvas.parentNode.offsetLeft
    } catch (e) {

    }
}

// 是否重叠，此处用勾股定理，有点麻烦，图形有点多。。。(这个先放着)
const isCover = (e: MouseEvent) => {
    let canvas = document.getElementById('conditions') as HTMLElement
  const [x, y] = [e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop]
  // 勾股定理（先考虑圆形）
  for (let circle of state.resource) {
    if (circle instanceof Circle) {
      // 使用勾股定理计算这个点与圆心之间的距离
      // Math.sqrt(Math.pow(circle.x - 点x, 2)+ Math.pow(circle.y - 点y, 2)) < r 重复了
      let distanceFromCenter = Math.sqrt(Math.pow(circle.x - x, 2) + Math.pow(circle.y - y, 2))
      if (distanceFromCenter < circle.radius) {
        console.log('重叠啦')
      }
    }
  }
}

// 使用栅格化，判断是否该范围内有资源（初始化坐标x，y, 资源的宽，高）
const isExitResource = (scope: number[]) => {
  let isExist = false
  let arr
  // 左上角的点和右下角的点
  let [ x1, y1, x2, y2] = [
    Math.floor(scope[0] / state.size),
    Math.floor(scope[1] / state.size),
    Math.floor((scope[0] + scope[2]) / state.size),
    Math.floor((scope[1] + scope[3]) / state.size)
  ]
  // 先扩展了大小
  if (x1 === x2 && y1 === y2) {
    // 在同一区域内，只加到一个区域
    arr = state.gridArr[x1 + y1 * state.xl]
    if (!(arr instanceof Array)) {
      return isExist
    }
  } else {
    arr = state.gridArr[x1 + y1 * state.xl]
    if (!(arr instanceof Array)) {
      arr = []
    }
    let arr2 = state.gridArr[x2 + y2 * state.xl]
    if (!(arr2 instanceof Array)) {
      arr2 = []
    }
    arr = [...arr2, ...arr]
    if (arr.length === 0) {
      return isExist
    }
    arr = new Set(arr)
  }
  // arr 就是该区域的资源（不重复）
  // console.log(arr)

  // 再判断该区域的资源，及其相关联的资源是否与当前scope要放的位置相交，
  for (let i = 0; i < arr.length; i++) {
      const dataRelationScope = state.dataRelation[arr[i]].scope
      if (util.graphicsIntersection(scope, dataRelationScope)) {
        // 相交了,这里其实还要跟他关联到的资源比较，应该是更小范围的比较
        isExist = true
        break
      } 
  }
  return isExist

}
const changeXl = (w = 0) => {
  state.xl = Math.floor(w / state.size)
}
// 改变画布大小
const changeCanvasSize = (isAddW = false, isAddH = false) => {
  if (!isAddW && !isAddH) return
  let old = {
    w: canvasParam.w,
    h: canvasParam.h,
  }
  let now  = {
    w: isAddW ? canvasParam.w + state.size : canvasParam.w,
    h: isAddH ? canvasParam.h : canvasParam.w + state.size,
  }
  isAddW && changeXl(now.w)

  state.gridArr = util.changeGridSize(state.gridArr, now, old)
  canvasParam.w = now.w
  canvasParam.h = now.h
}

const drop = (e: MouseEvent) => {
    // 是否有拖动的资源
    if (state.dataSource.length === 0) {
        return
    }
    // 判断当前模型是否能拖放组件进入画布

    // 检测是否重叠，重叠则重设x,y
    // isCover(e)
   const callback = (id) => {
      changeGridArr(id)
      window.requestAnimationFrame(initCanvas)
   }

    getOffset()
    // 当前鼠标在画布中的坐标
    let x = e.pageX - canvasParam.left - leftSide
    let y = e.pageY - canvasParam.top
    let item = state.dataSource[0]
    let drawDateSource = (x = 10, y = 10) => {
      const scope = [x, y, analysParam.module.dataSource.w, analysParam.module.dataSource.h[item.paramType]]
      // console.log(isExitResource(scope))
      // 先判断要放的位置是不是会重复
      if(!isExitResource(scope)) {
        switch(item.paramType) {
          case 2: 
            drawDataSource(x, y, item, callback)
            break;
          case 7:
            drawCondition(x, y, item, callback)
            break;
          case 4:
            drawResultSet(x, y, item, callback)
            break;
          case 3: 
            drawImg(x, y, item, callback)
            break;
        }
      } else {
        if (y + 60 < canvasParam.h - 60) {
          y += 60
          drawDateSource(x, y)
        } else if (x + 140 < canvasParam.w - 140) {
          drawDateSource(x, y)
        } else {
          // 改变canvas的大小啦
          changeCanvasSize(true, true)
           y += 60
          drawDateSource(x, y)
        }
      }
    }
    // 获取当前位置
    // drawCircle({x: e.clientX - state.canvas.offsetLeft, y: e.clientY - state.canvas.offsetTop})
    drawDateSource(x, y)

    // 拖进来资源，该画布编辑状态
    // openModel.value.isEdit = true
}

    // 列表的拖动
    const dragstart = (e: MouseEvent, item? :any) => {
      if (!item) {
        item = {
          name: '过滤字段',  
          key: 'b',
          type: 7,
          paramType: 7
        }
      }
      // console.log('item', item)
      const {type, key, name} = item
      // id++
      // type 可以判断操作类型，如果有操作类型，放count(目前不知道是什么意思)，stepId（步骤id吧？）

      let dataSource = {
        ...dataSourceJson,
        ...item,
        type,
        rId: key,
        name
      }
      
      state.dataSource = [ dataSource ]
      isChangeDragAndDrop.value = true
      // console.log(state.dataSource)
    }

    // 可拖拽，阻止默认事件
    const allowDrop = (e: MouseEvent) => {
      e.preventDefault()
    }

    defineExpose({
      // 暴露一些变量，因为setup中相当与一些闭包，暴露这些变量给父组件使用
    })
</script>

<style lang='scss' scoped>
@import './index.scss'

</style>
