import Circle from './class/filter.js'
import myCanvas from './canvasUtil.js'
import analysParam from './json/analysParam.json'

export default function usedDraw (state, canvasParam) {
    
    // 初始化：画圆圈
    type DrawCircle = ({x, y}: ({x: number, y: number}), isInit?: number) => void
    const drawCircle: DrawCircle = ({x , y}, isInit = 1) => {
        let cir = new Circle({x, y})
        //   isInit && state.resource.push(cir) // 记录起来，判断是否重叠
            // console.log(canvasParam.ctx)
        canvasParam.ctx.beginPath()
        canvasParam.ctx.fillStyle = '#1a95e9'
        canvasParam.ctx.arc(x, y, cir.radius, 0, 2 * Math.PI)
        canvasParam.ctx.fill()
        canvasParam.ctx.font = cir.font
        canvasParam.ctx.fillStyle = cir.fillStyle
        canvasParam.ctx.textAlgin = cir.textAlgin
        canvasParam.ctx.textBaseInline = cir.textBaseInline
        //   此处没有考虑多行，这是两行的
        canvasParam.ctx.fillText(cir.filterText[0], x - cir.radius / 2, y - cir.radius / 4 * 1)
        canvasParam.ctx.fillText(cir.filterText[1], x - cir.radius / 2, y + cir.radius / 4 * 2)
        canvasParam.ctx.closePath()
        
    }

    // 向右导弹
const drawDataSource = (x: number, y:number, item: any, callback) => {
    const scope = [x, y, analysParam.module.dataSource.w, analysParam.module.dataSource.h[item.paramType]]
    let temp = {...item, id:'ds_' + state.moduleKey, 
      scope: [0, 0, analysParam.module.dataSource.w, analysParam.module.dataSource.h[item.paramType]],
      countStr: '122'}
    state.moduleKey++
    state.resource.set(temp.id, temp)
    let dataR = myCanvas.createDataSourceCanvas(temp)
    state.dataRelation[temp.id] = {
      id: temp.id,
      canvas: dataR,
      scope: scope,
      relation: [{id: temp.id, path: temp.id + '/'}]
    }
    callback(temp.id)
    // changeGridArr(temp.id)
    // window.requestAnimationFrame(initCanvas)
    // 更新模型的信息
    // updateModelConfig()
    
    // ChangeDragAndDrop = []
    // changeIsDragAndDrop = false
  }

  // 圆形
const drawCondition = (x: number, y: number, item: any, callback) => {
    const condition = analysParam.module.condition[0]
    const scope = [x, y, condition.w, condition.h]
    let temp = {...item, scope: [0, 0, condition.w, condition.h], id: 'ds_' + state.moduleKey}
    state.moduleKey++
    state.resource.set(temp.id, temp)
    let dataR = myCanvas.createConditionCanvas(temp)
    state.dataRelation[temp.id] = {
      id: temp.id,
      canvas: dataR,
      scope,
      relation: [{id: temp.id, path: temp.id + '/'}]
    }
    callback(temp.id)

    // 更新模型的信息
    // updateModelConfig()
    // ChangeDragAndDrop = []
    // changeIsDragAndDrop = false
  }

  // 矩形
const drawResultSet = (x: number, y: number, item: any, callback) => {
    const resultSet = analysParam.module.resultSet
    const scope = [x, y, resultSet.gw - resultSet.marginR, resultSet.h]
    let temp = {...item, scope, id: 'dr_' + state.moduleKey, num: 12, showName: '结果集'}
    state.moduleKey++
    state.resource.set(temp.id, temp)
    let dataR = myCanvas.createResultSetCanvas(temp)
    state.dataRelation[temp.id] = {
      id: temp.id,
      canvas: dataR,
      scope: scope,
      relation: [{id: temp.id, path: temp.id + '/'}]
    }
    callback(temp.id)

    // 更新模型的信息
    // updateModelConfig()
    // ChangeDragAndDrop = []
    // changeIsDragAndDrop = false
  }
  // 画图
const drawImg = (x: number, y: number, item: any, callback) => {
    const scope = [10, 10, analysParam.resourceAdd.w, analysParam.resourceAdd.h]
    let dataR = myCanvas.createCanvas({ w: x, h: y, isTransparent: true })
    myCanvas.drawImg(dataR.ctx, analysParam.resourceAdd, function() {
      console.log('画图成功')
    })
    callback(item.id)

     // window.requestAnimationFrame(initCanvas)
    // 更新模型的信息
    // updateModelConfig()
    // ChangeDragAndDrop = []
    // changeIsDragAndDrop = false
  }

    return {
        drawCircle,
        drawDataSource,
        drawCondition,
        drawResultSet,
        drawImg
    }
}