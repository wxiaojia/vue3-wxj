export default function useGrid (state) {

    // gridArr中的这个区域是否已存在该id
    const isExitGridId = (arr: string[], id: string) => {
        if (arr.indexOf(id) === -1) {
        arr.push(id)
        }
        return arr
    }


// 删除传过来的id所在的
    const deleteGridArr = (arrId = []) => { 
        for (let i = 0; i < state.gridArr.length; i++) {
        for (let j = 0; j < arrId.length; j++) {
            let index = state.gridArr[i].indexOf(arrId[j])
            if (index >= 0) {
            state.gridArr[i].splice(index, 1)
            }
        }
        }
    }
  
  // 画布中grid添加此id
  const changeGridArr = (id: string) => {
    let arr = state.dataRelation[id].scope
    let [ x, y, maxX, maxY ] = [
      Math.floor(arr[0] / state.size),
      Math.floor(arr[1] / state.size),
      Math.floor((arr[0] + arr[2]) / state.size),
      Math.floor((arr[1] + arr[3]) / state.size)
    ] 
    if (x === maxX && y === maxY) {
      // 在同一个区域内
      state.gridArr[state.xl * y + x] = isExitGridId(state.gridArr[state.xl * y + x], id)
    } else if (x === maxX) {
      // x在同一区域
      for (let i = y; i <= maxY; i++) {
        state.gridArr[x + i * state.xl] = isExitGridId(state.gridArr[x + i * state.xl], id)
      }
    } else if (y === maxY) {
      // y在同一区域
      for (let i = x; i <= maxX; i++) {
        state.gridArr[i + y * state.xl] = isExitGridId(state.gridArr[i + y * state.xl], id)
      }
    } else {
      for (let i = x; i < maxX; i++) {
        for (let j = y; j <= maxY; j++) {
          state.gridArr[i + j * state.xl] = isExitGridId(state.gridArr[i + j * state.xl], id)
        }
      }
    }
  }

    return {
        deleteGridArr,
        changeGridArr
    }
}