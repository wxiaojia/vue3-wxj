import analysParam from '../../views/analys/json/analysParam.json'
/**
 * @description 画布中图形坐标、线的坐标、图形大小等等相关计算
 */
export default {
    /**
     * 关系的线
     * @param {Object} relation 关系对象
     * @param {Object} startLine 第一个对象线后续线开始的位置对象
     * @param {Object} endLine 第二个对象线后续线开始的位置对象
     */
    relationLine (relation, startLine, endLine) {
        if (relation.type === 9) {
            relation.marginT = 0
        }
        let line = []
        let startX = startLine.x
        let startY = startLine.y
        let endX = endLine.x
        let endY = endLine.y
        let maxY = Math.abs(startY - endY)
        let maxX = Math.abs(startX - endX)
        let startX0 = startX > endX ? maxX : 0
        let endX0 = startX > endX ? 0 : maxX
        let startY0 = startY > endY ? relation.marginT + maxY + 2 : relation.marginT + 2
        let endY0 = startY > endY ? relation.marginT + 2 : relation.marginT + maxY + 2
        let startX1 = startX > endX ? maxX + 40 : maxX + 40
        let endX1 = startX > endX ? maxX + 40 : maxX + 40
        let startY1 = startY > endY ? relation.marginT + maxY + 2 : relation.marginT + 2
        let endY1 = startY > endY ? relation.marginT + 2 : relation.marginT + maxY + 2
        line.push({
            x0: startX0,
            y0: startY0,
            x1: startX1,
            y1: startY1,
            fillStyle: analysParam.lineParam.fillStyle
        })
        line.push({
            x0: endX0,
            y0: endY0,
            x1: endX1,
            y1: endY1,
            fillStyle: analysParam.lineParam.fillStyle
        })
        line.push({
            x0: maxX + 40,
            y0: relation.marginT + 2,
            x1: maxX + 40,
            y1: relation.marginT + maxY + 2,
            fillStyle: analysParam.lineParam.fillStyle
        })
        line.push({
            x0: maxX + 40,
            y0: relation.marginT + maxY / 2 + 2,
            x1: maxX + 80,
            y1: relation.marginT + maxY / 2 + 2,
            fillStyle: analysParam.lineParam.fillStyle
        })
        if (relation.type === 9) {
            line.push({
                x0: maxX + 80,
                y0: relation.marginT + maxY / 2 + 2,
                x1: maxX + 80,
                y1: relation.marginT + maxY / 2 + 2,
                fillStyle: analysParam.lineParam.fillStyle
            })
            line.push({
                x0: maxX + 80 + analysParam.resourceAdd.w,
                y0: relation.marginT + maxY / 2 + 2,
                x1: maxX + 80 + analysParam.resourceAdd.w + 40,
                y1: relation.marginT + maxY / 2 + 2,
                fillStyle: analysParam.lineParam.fillStyle
            })
        } else {
            line.push({
                x0: maxX + 80,
                y0: relation.marginT + maxY / 2 + 2,
                x1: maxX + 80 + analysParam.relation[relation.rType].w + 40,
                y1: relation.marginT + maxY / 2 + 2,
                fillStyle: analysParam.lineParam.fillStyle
            })
        }
        return line
    },
    /**
     * 获取资源、关系、数据过滤、数据统计、结果集等后续拉线的开始坐标
     * 获取后续开始线坐标对象的类型 1 资源 2个人数据 3复制结果集 4结果集 5关联关系 6字段映射 7数据过滤 8数据统计 9资源相加
     * @param {Object} option 对应类型的对象
     */
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
                break
            case 5:
                lineStart.x = option.scope[0] + option.scope[2]
                lineStart.y = option.scope[1] + option.lineCoordinate[4].y0
                break
            case 6:
                break
            case 7:
            case 8:
                let condition = analysParam.module.condition[option.type === 7 ? 0 : option.echo.type]
                if (option.lineCoordinate && option.lineCoordinate.length > 0) {
                    lineStart.x = option.scope[0] + condition.w + (option.type === 7 ? 120 : 80)
                } else {
                    lineStart.x = option.scope[0] + condition.w
                }
                lineStart.y = option.scope[1] + condition.h / 2
                break
            case 9:
                lineStart.x = option.scope[0] + option.scope[2]
                lineStart.y = option.scope[1] + option.lineCoordinate[4].y0
                break
        }
        return lineStart
    }
}
