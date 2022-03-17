import util from './util.js'

export default function useGetResource(state, canvasParam) {
    // 获取当前位置的坐标的资源
    const getCoordinateResource = (coordinate = {x: 0, y: 0}, isClick = false) => {
    // console.log(coordinate)
  
      let resourceObj = null
      let [ xl, yl ] = [Math.floor(coordinate.x / state.size), Math.floor(coordinate.y / state.size)]
      let arr = state.gridArr[xl + yl * state.xl]
      // console.log(arr)
      if (!(arr instanceof Array) || arr.length === 0) {
        return null
      }
      // coordinate 鼠标点击的坐标， scope 在该格子中，里面的资源的scope
      for (let i = 0; i < arr.length; i++) {
        let scope = state.dataRelation[arr[i]].scope
        // console.log(scope)
  
        console.log(util.coordinateInscope(coordinate, scope))
        if (util.coordinateInscope(coordinate, scope)) {
            if (state.dataRelation[arr[i]].relation.length > 1) {
              // 关联的资源
              resourceObj = {...state.resource.get(arr[i])}
              break
            } else {
              resourceObj = {...state.resource.get(arr[i])}
              break
            }
        }
      }
      console.log(resourceObj)
      return resourceObj
  }

  // 获取当前鼠标移动或者点击对应的资源结果根节点对象, coordinate 当前坐标，type：0 默认 1 移动 2 拉线
const getCoordinateResourceRelation = (moveCoordinate, coordinate = {x:0, y: 0}, type = 0) => {
    let resouceObj = null
    let [xl, yl] = [Math.floor(coordinate.x / state.size), Math.floor(coordinate.y / state.size)] // 处于哪一个区域
    let arr = state.gridArr[xl + yl * state.xl]
  
    if (arr.length === 0) {
      return null
    } else {
      for (let i = 0; i < arr.length; i++) {
        let isInScope = false
        if (type === 1) {
          if (moveCoordinate.id === arr[i]) {
            continue
          }
        } else {
          if (getDataRelactionId(canvasParam.oldLineLocation.startId) === arr[i]) {
            continue
          }
        }
  
        let scope = state.dataRelation[arr[i]].scope
        let dataRelationScope
        if (type == 1) {
          dataRelationScope = state.dataRelation[moveCoordinate.id].scope
        } else {
          dataRelationScope = [coordinate.x, coordinate.y, 1, 1]
        }
  
        if (util.graphicsIntersection(dataRelationScope, scope)) {
          if (state.dataRelation[arr[i]].relation.length > 1) {
            // 把整个链的看成整一个链
            let relations = state.dataRelation[arr[i]].relation
            for(let j = 0; j < relations.length; j++) {
              let temp = { ...state.resource.get(relations[j].id) }
              // ？？？
              temp.scope[0] += scope[0]
              temp.scope[1] += scope[1]
              if (util.graphicsIntersection(dataRelationScope, temp.scope)) {
                isInScope = true
                if (type === 2) {
                  if (temp.isLine) {
                    resouceObj = state.dataRelation[arr[i]]
                  }
                } else {
                  resouceObj = state.dataRelation[arr[i]]
                }
                break
              }
            }
            if (isInScope) {
              break
            }
          } else {
            resouceObj = state.dataRelation[arr[i]]
            break
          }
        }
      }
    }
    return resouceObj
  }
  // 获取当前对象在关系中的顶层id
const getDataRelactionId = (id: string) => {
    let drId
    let arr = Object.keys(state.dataRelation)
    for (let i = 0; i < arr.length; i++) {
      let temp = state.dataRelation[arr[i]]
      if (arr[i] === id) {
        drId = id
        break
      } else {
        let isGetId = false
        for (let j = 0; j < temp.relation.length; j++) {
          let item = temp.relation[j].id
          if (item === id) {
            drId = arr[i]
            isGetId = true
            break
          }
        }
        if (isGetId) break
      }
    }
    return drId
  }

    return {
        getCoordinateResource,
        getCoordinateResourceRelation,
        getDataRelactionId
    }
}