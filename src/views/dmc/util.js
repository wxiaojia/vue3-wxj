import analysParam from './json/analysParam.json'

export default {
     // 栅格化，用一维数组。改变大小而已
     changeGridSize (grid = [], now = {w:0, y:0}, old = {w: 0, y:0}) {
        let nowXL = Math.ceil(now.w / 500)
        let nowYL = Math.ceil(now.h / 500)
        let nowL = nowXL * nowYL    // 有多少个
        // 初始时
        if (grid.length === 0) {
            for (let i = 0; i < nowL; i++) {
                grid.push([])       
            }
        }
        // 比较是否跟之前的一样
        if (nowL === grid.length) {
            return grid
        }
        let oldXL = Math.ceil(old.w / 500)
        let oldYL = Math.ceil(old.h / 500)
        if (nowXL > oldXL && nowYL > oldYL) {
            // 宽高都变大了
            for (let i = 0; i < oldYL; i++) {
                grid.splice(oldXL * (i + 1)+i, 0, [])       
            }
            for (let i = 0; i < oldXL; i++) {
                grid.push([])       
            }
        } else if (nowXL > oldXL) {
            for (let i = 0; i < oldYL; i++) {
                grid.splice(oldXL * (i+1) + i, 0, [])       
            }
        } else {
            for (let i = 0; i < nowXL; i++) {
                grid.push([])       
            }
        }
        return grid
    },
    // 判断图形是否相交
    graphicsIntersection (g1, g2) {
        let graphA = {
            x0: g1[0],
            y0: g1[1],
            x1: g1[0] + g1[2],
            y1: g1[1] + g1[3]
        }
        let graphB = {
            x0: g2[0],
            y0: g2[1],
            x1: g2[0] + g2[2],
            y1: g2[1] + g2[3]
        }
        let lx = Math.abs((graphA.x0 + graphA.x1) / 2 - (graphB.x0 + graphB.x1) / 2)
        let ly = Math.abs((graphA.y0 + graphA.y1) / 2 - (graphB.y0 + graphB.y1) / 2)
        let sax = Math.abs(graphA.x0 - graphA.x1)
        let sbx = Math.abs(graphB.x0 - graphB.x1)
        let say = Math.abs(graphA.y0 - graphA.y1)
        let sby = Math.abs(graphB.y0 - graphB.y1)
        if (lx <= (sax + sbx) / 2 && ly <=(say +sby) /2) return true
        return false
    },
    coordinateInscope(coor, graphics) {
        if (graphics instanceof Array) {
            if (coor.x >= graphics[0] && coor.x <= graphics[0] + graphics[2] && 
                coor.y >= graphics[1] && coor.y <= graphics[1] + graphics[3]) {
                    return true
                }
        } else {
            if (coor.x > graphics.x && coor.x <= graphics.x + graphics.w &&
                coor.y > graphics.y && coor.y <= graphics.y + graphics.h) {
                    return true
                }
        }
        return false
    },
    coordinateInCircular(coordinate, circular) {
        let x = circular.x - coordinate.x
        let y = circular.y - coordinate.y
        if (Math.pow(x, 2) + Math.pow(y, 2) < Math.pow(circular.r, 2)) {
            return true
        }
        return false
    },
    mapToJson (map) {
        let obj = {}
        for (let [key, value] of map) {
            obj[key] = value
        }   
        return obj
    },
    // 连接画线的坐标
    // 获取资源，数据过滤，结果集等后续拉线的开始坐标
    // 获取后开始线坐标对象的类型 1 资源 2 个人数据 3 复制结果集 4结果集 5 关联关系
    // 6 字段映射 7 数据过滤 8 数据同级 9 资源相加 
    lineStart (option) {
        let lineStart = {
            x: 0,
            y: 0
        }
        switch (option.type) {
            case 1:
            case 2:
            case 3:
                let dataSource = analysParam.module.dataSource
                lineStart.x = option.scope[0] + dataSource.w
                lineStart.y = option.scope[1] + dataSource.closeCircular.y + (dataSource.h[option.paramType] - dataSource.closeCircular.y) / 2
                break
            case 4:
                let resultSet = analysParam.module.resultSet
                lineStart.x = option.scope[0] + option.scope[2] + resultSet.marginR
                lineStart.y = option.scope[1] + resultSet.gh / 2 + 17
                break;
            case 5:
                lineStart.x = option.scope[0] + option.scope[2]
                lineStart.y = option.scope[1] + option.lineCoordinate[4].y0
                break;
            case 6:
                break;
            case 7:
            case 8:
                let condition = analysParam.module.condition[option.type === 7 ? 0 :option.echo.type]
                if (option.lineCoordinate && option.lineCoordinate.length > 0) {
                    lineStart.x = option.scope[0] + condition.w + (option.type === 7 ? 120 : 80)
                } else {
                    lineStart.x = option.scope[0] + condition.w
                }
                lineStart.y = option.scope[1] + condition.h / 2
                break        }

        return lineStart
    }
}