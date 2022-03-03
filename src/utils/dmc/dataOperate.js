import relationJSON from '../../views/analys/json/relation.json'
import resultSetJSON from '../../views/analys/json/resultSet.json'
import resourceAddJSON from '../../views/analys/json/resourceAdd.json'
import analysParam from '../../views/analys/json/analysParam.json'
import arrayUtil from '../common/array'
import stringUtil from '../common/string'
import objectUtil from '../common/object'
import tagUtil from '../common/tagUtil'
/**
 * 数据操作
 */
export default {
    /**
     * 变更当前打开窗口的model对象信息
     * @param {Object} self 页面对象
     */
    changeOpenModel (self) {
        let arrayList = []
        if (self.openModel) {
            for (let temp of self.openModelList) {
                if (self.openModel.modelId === temp.modelId) {
                    arrayList.push(self.openModel)
                } else {
                    arrayList.push(temp)
                }
            }
        } else {
            for (let temp of self.openModelList) {
                arrayList.push(temp)
            }
        }
        self.$store.commit('analys.changeOpenModelList', arrayList)
    },
    /**
     * 创建资源对象并且把对象存放到数据关系和资源map中去
     * @param {Object} self center.vue this对象
     * @param {Object} data 资源原始参数对象
     * @param {Number} x 当前拖入画布的x坐标
     * @param {Number} y 当前拖入画布的y坐标
     */
    createDataSource (self, data, x, y) {
        let module = self.module.dataSource
        self.changeCanvasSize(module.w + x > self.canvasParam.w, module.h[data.paramType] + y > self.canvasParam.h)
        let dataSource = data
        let scope = [x, y, module.w, module.h[data.paramType]]
        dataSource.scope = [0, 0, module.w, module.h[data.paramType]]
        dataSource.id = 'ds_' + self.moduleKey
        dataSource.moduleId = dataSource.rId
        if (self.rIdMapping[dataSource.rId]) {
            self.countMapping[dataSource.rId] = dataSource.count
            dataSource.rId = self.rIdMapping[dataSource.rId]
        } else {
            self.rIdMapping[dataSource.rId] = 'r' + self.moduleKey
            self.countMapping[dataSource.rId] = dataSource.count
            dataSource.rId = self.rIdMapping[dataSource.rId]
        }
        if (data.type === 3) {
            for (let temp of self.resource) {
                let module = self.resource.get(temp[0])
                if (module.type === 4 && module.rId === data.rId) {
                    if (!module.copyResultSetId) {
                        module.copyResultSetId = [dataSource.id]
                    } else {
                        module.copyResultSetId.push(dataSource.id)
                    }
                    break
                }
            }
            if (!self.stepIdMapping[data.stepId]) {
                self.stepIdMapping[data.stepId] = data.stepId
                data.stepId = self.stepIdMapping[data.stepId]
            } else {
                data.stepId = self.stepIdMapping[data.stepId]
            }
            self.$store.commit('analys.changeStepIdMapping', self.stepIdMapping)
        }
        self.$store.commit('analys.changeRIdMapping', self.rIdMapping)
        self.$store.commit('analys.changeCountMapping', self.countMapping)
        dataSource.num = self.dsNum
        dataSource.countStr = self.$util.string.numberToString(dataSource.count, ',')
        self.moduleKey++
        self.dsNum++
        dataSource.showNameW = this.getNameWidth(dataSource.name)
        self.resource.set(dataSource.id, dataSource)
        self.$store.commit('analys.changeResource', self.resource)
        self.$store.commit('analys.changeIsDragAndDrop', false)
        self.dataRelation[dataSource.id] = {
            id: dataSource.id,
            canvas: self.$util.canvas.createDataSourceCanvas(dataSource),
            scope: scope,
            relation: [{id: dataSource.id, path: dataSource.id + '/'}]
        }
        self.changeGridArr(dataSource.id)
    },
    /**
     * 创建关联关系对象
     * @param {Object} self center.vue this对象
     * @param {String} stepId 关联关系对应结果集的步骤id
     * @param {Object} param 关联关系所需要的一些回显参数对象
     * @return {Object} 生成的关联关系对象
     */
    createRelation (self, stepId, param) {
        let moduleL = self.resource.get(param.lId)
        let moduleR = self.resource.get(param.rId)
        moduleL.isLine = false
        moduleR.isLine = false
        let lLineStart = self.$util.calculate.lineStart(moduleL)
        let rLineStart = self.$util.calculate.lineStart(moduleR)
        let relation = self.$util.object.deepCopy(relationJSON)
        let relationImg = analysParam.relation[param.relation]
        relation.scope = []
        relation.scope.push(Math.min(lLineStart.x, rLineStart.x))
        relation.scope.push(Math.min(lLineStart.y, rLineStart.y) - 2)
        relation.scope.push(Math.abs(lLineStart.x - rLineStart.x) + 120 + relationImg.w)
        relation.scope.push(Math.abs(lLineStart.y - rLineStart.y) > relationImg.h ? Math.abs(lLineStart.y - rLineStart.y) + 4 : relationImg.h + 4)
        relation.id = 'r' + self.moduleKey
        self.$store.commit('analys.changeStepIdMapping', self.stepIdMapping)
        relation.rType = param.relation
        relation.echo = {
            lId: param.lId,
            rId: param.rId,
            lColumn: param.aSelectedColumns,
            rColumn: param.bSelectedColumns,
            condition: param.mapping
        }
        relation = this.getRelationMapping(relation)
        self.moduleKey++
        self.$store.commit('analys.changeResource', self.resource)
        return relation
    },
    createResourceAdd (self, data) {
        let moduleL = self.resource.get(data.lId)
        let moduleR = self.resource.get(data.rId)
        moduleL.isLine = false
        moduleR.isLine = false
        let lLineStart = self.$util.calculate.lineStart(moduleL)
        let rLineStart = self.$util.calculate.lineStart(moduleR)
        let resourceAdd = self.$util.object.deepCopy(resourceAddJSON)
        let resourceAddImg = analysParam.resourceAdd
        resourceAdd.scope = []
        resourceAdd.scope.push(Math.min(lLineStart.x, rLineStart.x))
        resourceAdd.scope.push(Math.min(lLineStart.y, rLineStart.y) - 2)
        resourceAdd.scope.push(Math.abs(lLineStart.x - rLineStart.x) + 120 + resourceAddImg.w)
        resourceAdd.scope.push(Math.abs(lLineStart.y - rLineStart.y) > resourceAddImg.h ? Math.abs(lLineStart.y - rLineStart.y) + 4 : resourceAddImg.h + 4)
        resourceAdd.id = 'ra' + self.moduleKey
        self.$store.commit('analys.changeStepIdMapping', self.stepIdMapping)
        resourceAdd.echo = {
            lId: data.lId,
            rId: data.rId,
            relationList: data.relationList,
            resultColumns: data.resultColumns
        }
        resourceAdd.num = self.rsNum
        self.moduleKey++
        // self.rsNum++
        self.$store.commit('analys.changeResource', self.resource)
        return resourceAdd
    },
    /**
     * 创建结果集对象
     * @param {Object} self center.vue this对象
     * @param {Object} data 结果集相关的数据对象
     * @param {Object} relation 结果集对应的关联关系对象
     * @return {Object} 生成的结果集对象
     */
    createResultSet (self, data, relation) {
        // 创建结果集
        let resultSet = self.$util.object.deepCopy(resultSetJSON)
        let resultSetGraph = self.$util.object.deepCopy(self.module.resultSet)
        resultSet.rId = 'r' + self.moduleKey
        self.rIdMapping[data.resourceId] = resultSet.rId
        self.$store.commit('analys.changeRIdMapping', self.rIdMapping)
        resultSet.id = 'rs' + self.moduleKey
        if (!self.stepIdMapping[data.stepId]) {
            self.stepIdMapping[data.stepId] = resultSet.id
        }
        resultSet.stepId = self.stepIdMapping[data.stepId]
        self.$store.commit('analys.changeStepIdMapping', self.stepIdMapping)
        resultSet.num = self.rsNum
        resultSet.name = data.resourceName + self.rsNum
        resultSet.showName = resultSet.name.substring(0, 10)
        resultSet.showNameW = this.getNameWidth(resultSet.showName)
        let lineStart = self.$util.calculate.lineStart(relation)
        resultSet.scope = [lineStart.x, lineStart.y - resultSetGraph.marginT, resultSetGraph.gw - resultSetGraph.marginR, resultSetGraph.h]
        self.rsNum++
        self.moduleKey++
        return resultSet
    },
    /**
     * 创建数据过滤对象并且把对象存放到数据关系和资源map中去
     * @param {Object} self center.vue this对象
     * @param {Object} data 数据过滤原始参数对象
     * @param {Number} x 当前拖入画布的x坐标
     * @param {Number} y 当前拖入画布的y坐标
     */
    createDataFilter (self, data, x, y) {
        let module = self.module.condition[0]
        self.changeCanvasSize(module.w + x > self.canvasParam.w, module.h + y > self.canvasParam.h)
        let dataFilter = self.dragAndDrop[0]
        let scope = [x, y, module.w, module.h]
        dataFilter.scope = [0, 0, module.w, module.h]
        dataFilter.id = 'df_' + self.moduleKey
        self.moduleKey++
        self.resource.set(dataFilter.id, dataFilter)
        self.$store.commit('analys.changeResource', self.resource)
        self.$store.commit('analys.changeIsDragAndDrop', false)
        self.dataRelation[dataFilter.id] = {
            id: dataFilter.id,
            canvas: self.$util.canvas.createConditionCanvas(dataFilter),
            scope: scope,
            relation: [{id: dataFilter.id, path: dataFilter.id + '/'}]
        }
        self.changeGridArr(dataFilter.id)
    },
    /**
     * 通过运行状态获取对应的运行状态名称
     * @param {String} runStatus 运行状态
     */
    getRunStatusName (runStatus) {
        let statusName = ''
        switch (parseInt(runStatus)) {
            case 0:
                statusName = '未运行'
                break
            case 10:
                statusName = '等待运行'
                break
            case 20:
                statusName = '正在运行'
                break
            case 30:
                statusName = '手动停止'
                break
            case 40:
                statusName = '异常停止'
                break
            case 50:
                statusName = '正常结束'
                break
        }
        return statusName
    },
    getScope (self, id) {
        let module = self.resource.get(id)
        let scope = []
        if (module.type === 4) {
            let dataRelationScope = self.dataRelation[id].scope
            scope[0] = dataRelationScope[0] + module.scope[0] + (module.isDataFilter ? 80 : 40)
            scope[1] = dataRelationScope[1] + module.scope[1]
            scope[2] = module.scope[2] - (module.isDataFilter ? 80 : 40)
            scope[3] = module.scope[3]
        } else {
            scope = self.dataRelation[id].scope
        }
        return scope
    },
    /**
     * 通过资源的映射id获取实际id的值
     * @param {Object} self 页面vue对象
     * @param {String} id
     * @return {String} 返回资源id
     */
    getResourceId (rIdMapping, id) {
        let arr = Object.keys(rIdMapping)
        let resourceId
        for (let i = 0; i < arr.length; i++) {
            if (id === rIdMapping[arr[i]]) {
                resourceId = arr[i]
                break
            }
        }
        return resourceId
    },
    /**
     * 判断rId是否存在重复的
     * @param {Map} resource 存在所有资源的Map对象
     * @param {String} rId 要判断是否存在的rId
     * @returns {Boolean} 繁华是否存在
     */
    rIdExist (resource, rId) {
        let exist = false
        for (let value of resource) {
            if (value[1].rId === rId) {
                exist = true
                break
            }
        }
        return exist
    },
    /**
     * 改变path的值
     * @param {String} path1 比较的path
     * @param {String} path2 待处理的path
     * @returns {String} 返回根据path1处理后的path2
     */
    changeRelationPath (path1, path2) {
        if (path2.indexOf(path1) !== -1) {
            return path2.replace(path1, '')
        }
        let pathArr1 = path1.split('/')
        for (let i = 0; i < pathArr1.length - 1; i++) {
            if (path2.indexOf(pathArr1[i] + '/') !== -1) {
                path2 = path2.replace(pathArr1[i] + '/', '')
            }
        }
        return path2
    },
    /**
     * 通过结果集id获取生成结果对象的条件id
     * @param {Array} relationArr 关系结构数组
     * @param {String} id 结果集id
     * @returns {Object} 返回条件id和对应的path
     */
    getResultSetRelation (relationArr, id) {
        let path
        let relationId
        for (let val of relationArr) {
            if (val.id === id) {
                path = val.path
                break
            }
        }
        for (let val of relationArr) {
            let pathId = val.id + '/'
            if (val.path.indexOf(path) !== -1) {
                if (val.path.substr(path.length) === pathId) {
                    relationId = val.id
                    path = val.path
                    break
                }
            }
        }
        return {
            id: relationId,
            path: path
        }
    },
    /**
     * 通过id获取对应的path，来获取path对应的最长path
     * @param {Array} relationArr 降序排序后的relation数组
     * @param {String} id id
     * @returns {String} 新的path
     */
    getPathByPath (relationArr, id) {
        let path = ''
        for (let temp of relationArr) {
            if (temp.id === id) {
                path = temp.path
                break
            }
        }
        for (let temp of relationArr) {
            if (temp.path.indexOf(path) === 0) {
                path = id + '/' + temp.path.replace(path, '')
                break
            }
        }
        return path
    },
    /**
     * 删除资源后初始化数据机构的scope值并且改变对应的relation数组中每个关联资源的scope值
     * @param {Object} dataRelation 待修改scope的数据结构
     * @param {Map} resource 所有资源的存放Map对象
    */
    initDataRelationScope (dataRelation, resource) {
        let oldScope = dataRelation.scope
        let scope = [0, 0, 0, 0]
        let relation = dataRelation.relation
        relation.forEach(val => {
            let module = resource.get(val.id)
            let x = oldScope[0] + module.scope[0]
            let y = oldScope[1] + module.scope[1]
            if (scope[0] === 0 || scope[0] > x) {
                scope[0] = x
            }
            if (scope[1] === 0 || scope[1] > y) {
                scope[1] = y
            }
        })
        relation.forEach(val => {
            let module = resource.get(val.id)
            module.scope[0] -= scope[0] - oldScope[0]
            module.scope[1] -= scope[1] - oldScope[1]
            let w = module.scope[0] + module.scope[2]
            let h = module.scope[1] + module.scope[3]
            if (scope[2] < w) {
                scope[2] = w
            }
            if (scope[3] < h) {
                scope[3] = h
            }
        })
        dataRelation.scope = scope
        return dataRelation
    },
    /**
     * 资源删除时返回新的scope数组
     * @param {Array} pScope 父容器的scope数组
     * @param {Array} scope 资源的scope
     */
    getNewScope (pScope, scope) {
        scope[0] += pScope[0]
        scope[1] += pScope[1]
        return scope
    },
    /**
     * 结构数据关系排序
    */
    relationSort (relation, order = 'asc') {
        let arr = arrayUtil.sortByField(relation, (a) => {
            return a.path.split('/').length
        }, (a) => {
            return a.id.replace(/\D/g, '')
        }, order)
        return arrayUtil.sortByField(arr, (a) => {
            return a.path.split('/').length
        }, (a) => {
            return a.id.replace(/\D/g, '')
        }, order)
    },
    /**
     * 获取数据结构中relation的生成资源id
     * @param {Array} relation dataRelation.relation数组
     * @param {String} relationId 关系对应的资源id
     * @param {String} resourceId 关系其中的一个资源id
     */
    getRelationSubId (relation, relationId, resourceId = '') {
        let id
        if (!resourceId) {
            id = []
        }
        let path
        for (let i = 0; i < relation.length; i++) {
            if (!path && relation[i].id === relationId) {
                path = relation[i].path
                i = -1
            } else if (relation[i].path.indexOf(path) === 0 && relation[i].path.split('/').length === path.split('/').length + 1) {
                if (resourceId) {
                    if (resourceId !== relation[i].id) {
                        id = relation[i].id
                    }
                } else {
                    id.push(relation[i].id)
                }
            }
        }
        return id
    },
    /**
     * 获取中文在浏览器中的长度
     * @param {String} name 要获取长度的中文
     * @param {Number} start 最多要获取中文的字符开始长度
     * @param {Number} end 最多要获取中文的字符结束长度
     * @returns {Number} 返回中文在浏览器中的长度
     */
    getNameWidth (name, start = 0, end = 0) {
        let spanTag = document.querySelector('#spanTag')
        if (end !== 0 && end > start) {
            spanTag.innerHTML = stringUtil.subStrLength(name, start, end)
        } else {
            spanTag.innerHTML = name
        }
        return tagUtil.getTagComputedStyle(spanTag, 'width', true)
    },
    getRelationMapping (relation) {
        let relationImg = analysParam.relation[relation.rType]
        relation.mapping = []
        for (let i = 0; i < relation.echo.condition.length; i++) {
            let lName = relation.echo.condition[i].columnaNote
            let rName = relation.echo.condition[i].columnbNote
            if (lName && lName.indexOf('.') === -1) {
                lName = relation.echo.condition[i].tableaAlias + '.' + lName
            }
            if (rName && rName.indexOf('.') === -1) {
                rName = relation.echo.condition[i].tablebAlias + '.' + rName
            }
            relation.mapping.push(lName + ' ' + relation.echo.condition[i].condition + ' ' + rName)
        }
        let nameMaxlengthArr = []
        let maxWidth = 60 + relationImg.w
        const len = relation.echo.condition.length > 2 ? 2 : relation.echo.condition.length
        for (let i = 0; i < len; i++) {
            nameMaxlengthArr.push(this.getNameWidth(relation.mapping[i]))
        }
        for (let i = 0; i < nameMaxlengthArr.length; i++) {
            if (nameMaxlengthArr[i] > maxWidth) {
                nameMaxlengthArr[i] = maxWidth
                relation.marginR = 30
            } else if (relation.marginR < (nameMaxlengthArr[i] - relationImg.w) / 2) {
                relation.marginR = (nameMaxlengthArr[i] - relationImg.w) / 2
            }
        }
        if (relation.marginR < 0) {
            relation.marginR = 0
        }
        relation.marginT = len * 14 + (len === 2 ? 4 : 0) + 5
        let marginT = relation.marginT - (relation.scope[3] - relationImg.h) / 2
        if (marginT > 0) {
            relation.scope[1] -= marginT
            relation.scope[3] += marginT
            relation.marginT = marginT
        } else {
            relation.marginT = 0
        }
        return relation
    },
    /**
     * 通过步骤id的映射值查找对应的步骤id
     * @param {Object} stepIdMapping 步骤id映射对象
     * @param {String} id 步骤id的映射值
     * @returns {String} 返回真实步骤id
     */
    getStepId (stepIdMapping = {}, id = '') {
        if (!id) {
            return ''
        }
        let stepId
        let keys = Object.keys(stepIdMapping)
        for (let index = 0; index < keys.length; index++) {
            if (stepIdMapping[keys[index]] === id) {
                stepId = keys[index]
                break
            }
        }
        return parseInt(stepId)
    },
    /**
     * 通过path修改path上存在的节点scope
     * @param {Object} self 父级页面vue对象
     * @param {Array} relations 对应的relation关系数组
     * @param {Array} rebuidIds 要重新生成canvas的resourceId
     * @param {String} path 节点路径字符串
     * @param {Number} y 当前的y坐标
     * @param {Number} x left节点的lineStart.x的值
     * @param {Array} newScope 新的dataRelation的scope
    */
    changeScopeByPath (self, relations, rebuidIds, path, y, x, newScope) {
        let arr = path.split('/')
        if (arr.length < 3) {
            return
        }
        y += 85
        let module = self.resource.get(arr[arr.length - 2])
        if (module.type <= 3 && module.paramType !== undefined) {
            module.scope = [0, y, module.scope[2], self.module.dataSource.h[module.paramType]]
        } else {
            module.scope = [0, y, module.scope[2], module.scope[3]]
        }
        rebuidIds.push(module.id)
        let lLineStart
        for (let i = arr.length - 3; i >= 0; i--) {
            let id = arr[i]
            const subModel = self.resource.get(arr[i + 1])
            lLineStart = self.$util.calculate.lineStart(subModel)
            module = self.resource.get(id)
            rebuidIds.push(id)
            if (module.type <= 3 && module.paramType !== undefined) {
                module.scope = [lLineStart.x, y, module.scope[2], self.module.dataSource.h[module.paramType]]
            } else {
                module.scope = [lLineStart.x, y, module.scope[2], module.scope[3]]
            }
            if (module.type === 5 || module.type === 9) {
                const rId = module.echo.lId === arr[i + 1] ? module.echo.rId : module.echo.lId
                let rModel = self.resource.get(rId)
                let w
                if (module.type === 5) {
                    w = analysParam.relation[module.rType].w
                } else {
                    w = analysParam.resourceAdd.w
                }
                rebuidIds.push(rId)
                if (rModel.type <= 3) {
                    y += 85
                    const h = rModel.paramType !== undefined ? self.module.dataSource.h[rModel.paramType] : rModel.scope[3]
                    if (subModel.type <= 3) {
                        const scopeX = self.$util.calculate.lineStart(self.resource.get(arr[0])).x < x ? x - self.$util.calculate.lineStart(self.resource.get(arr[0])).x : 0
                        if (self.$util.calculate.lineStart(self.resource.get(arr[0])).x < x) {
                            rModel.scope = [subModel.scope[0] + scopeX, y, rModel.scope[2], h]
                        } else {
                            rModel.scope = [subModel.scope[0] + scopeX, y, rModel.scope[2], h]
                        }
                    } else {
                        rModel.scope = [subModel.scope[0] + self.module.resultSet.gw - self.module.dataSource.w, y, rModel.scope[2], h]
                    }
                } else {
                    let rPath = self.$util.dataOperate.getPathByPath(relations, rId)
                    const obj = this.changeScopeByPath(self, relations, rebuidIds, rPath, y, lLineStart.x, newScope)
                    y = obj.y
                    newScope = obj.newScope
                    rebuidIds = obj.rebuidIds
                    rModel = self.resource.get(rId)
                }
                const rLineStart = self.$util.calculate.lineStart(rModel)
                module.scope = [Math.min(lLineStart.x, rLineStart.x), Math.min(lLineStart.y, rLineStart.y) - 2, Math.abs(rLineStart.x - lLineStart.x) + 120 + w, Math.abs(rLineStart.y - lLineStart.y) + 4]
                if (module.type === 5) {
                    const marginT = self.module.relation.textMaxH - (module.scope[3] - analysParam.relation[module.rType].h) / 2
                    module.marginT = 0
                    if (marginT > 0) {
                        module.scope[3] += marginT
                        module.scope[1] -= marginT
                        module.marginT = marginT
                    }
                }
                module.lineCoordinate = self.$util.calculate.relationLine(module, lLineStart, rLineStart)
                newScope = this.changeScope(newScope, rModel.scope)
                y += 85
            } else if (module.type === 7) {
                module.scope = [lLineStart.x, lLineStart.y - self.module.condition[0].h / 2, module.scope[2], module.scope[3]]
            } else if (module.type === 8) {
                module.scope = [lLineStart.x, lLineStart.y - self.module.condition[module.echo.type].h / 2, module.scope[2], module.scope[3]]
            } else if (module.type <= 3) {
                const h = module.paramType !== undefined ? self.module.dataSource.h[module.paramType] : module.scope[3]
                if (module.type <= 2) {
                    module.scope = [lLineStart.x, lLineStart.y - self.module.dataSource.marginT[module.paramType], module.scope[2], h]
                } else {
                    module.scope = [lLineStart.x, lLineStart.y - self.module.dataSource.marginT[0], module.scope[2], h]
                }
            } else {
                module.scope = [lLineStart.x, lLineStart.y - self.module.resultSet.marginT, module.scope[2], module.scope[3]]
            }
            newScope = this.changeScope(newScope, module.scope)
            const dataObj = self.$util.dataOperate.changeCanvasSize(newScope, self.canvasParam, self.gridArr)
            self.canvasParam = dataObj.canvasParam
            self.gridArr = dataObj.gridArr
        }
        self.$store.commit('analys.changeResource', self.resource)
        lLineStart = self.$util.calculate.lineStart(self.resource.get(arr[0]))
        if (lLineStart.x < x) {
            const poor = x - lLineStart.x
            this.changeScopeX(self, arr, poor)
        }
        return {
            y: y,
            newScope: newScope,
            rebuidIds: rebuidIds
        }
    },
    changeScopeX (self, arr, poor) {
        for (let j = arr.length - 2; j >= 0; j--) {
            if (arr[j].replace(/\d/g, '') === 'r' || arr[j].replace(/\d/g, '') === 'ra') {
                let module = self.resource.get(arr[j])
                module.scope[0] += poor
                let relations = self.dataRelation[self.getDataRelationId(arr[j])].relation
                let arrId = self.$util.dataOperate.getRelationSubId(relations, arr[j])
                let resource = self.resource.get(arrId[arrId.indexOf(arr[j + 1]) === 0 ? 1 : 0])
                if (resource.type <= 3) {
                    resource.scope[0] += poor
                    const otherResource = self.resource.get(arr[j + 1])
                    if (otherResource.type <= 3 && otherResource.scope[0] !== resource.scope[0]) {
                        otherResource.scope[0] = resource.scope[0]
                    }
                } else {
                    let rPath = self.$util.dataOperate.getPathByPath(relations, resource.id)
                    this.changeScopeX(self, rPath.split('/'), poor)
                }
                let lLineStart = self.$util.calculate.lineStart(self.resource.get(arrId[0]))
                let rLineStart = self.$util.calculate.lineStart(self.resource.get(arrId[1]))
                if (module.type === 5) {
                    module.scope = [Math.min(lLineStart.x, rLineStart.x), Math.min(lLineStart.y, rLineStart.y) - 2, Math.abs(rLineStart.x - lLineStart.x) + 120 + analysParam.relation[module.rType].w, Math.abs(rLineStart.y - lLineStart.y) + 4]
                    const marginT = self.module.relation.textMaxH - (module.scope[3] - analysParam.relation[module.rType].h) / 2
                    module.marginT = 0
                    if (marginT > 0) {
                        module.scope[3] += marginT
                        module.scope[1] -= marginT
                        module.marginT = marginT
                    }
                } else if (module.type === 9) {
                    module.scope = [Math.min(lLineStart.x, rLineStart.x), Math.min(lLineStart.y, rLineStart.y) - 2, Math.abs(rLineStart.x - lLineStart.x) + 120 + analysParam.resourceAdd.w, Math.abs(rLineStart.y - lLineStart.y) + 4]
                }
                module.lineCoordinate = self.$util.calculate.relationLine(module, lLineStart, rLineStart)
            } else {
                self.resource.get(arr[j]).scope[0] += poor
            }
        }
    },
    /**
     * 通过资源范围判断是否需要修改表格高度
     * @param {Array} scope 资源范围数组
     * @param {Object} canvasParam canvas参数对象
     * @param {Array} gridArr 栅格化数组
     */
    changeCanvasSize (scope, canvasParam, gridArr) {
        const old = objectUtil.deepCopy(canvasParam)
        if (scope[0] + scope[2] > canvasParam.w && scope[1] + scope[3] > canvasParam.h) {
            canvasParam.w = scope[0] + scope[2] + 100
            canvasParam.h = scope[1] + scope[3] + 100
            gridArr = arrayUtil.changeGridSize(gridArr, {w: canvasParam.w, h: canvasParam.h}, old)
        } else if (scope[0] + scope[2] > canvasParam.w) {
            canvasParam.w = scope[0] + scope[2] + 100
            gridArr = arrayUtil.changeGridSize(gridArr, {w: canvasParam.w, h: canvasParam.h}, old)
        } else if (scope[1] + scope[3] > canvasParam.h) {
            canvasParam.h = scope[1] + scope[3] + 100
            gridArr = arrayUtil.changeGridSize(gridArr, {w: canvasParam.w, h: canvasParam.h}, old)
        }
        return {
            canvasParam: canvasParam,
            gridArr: gridArr
        }
    },
    changeScope (newScope, scope) {
        if (newScope[2] < scope[0] + scope[2]) {
            newScope[2] = scope[0] + scope[2]
        }
        if (newScope[3] < scope[1] + scope[3]) {
            newScope[3] = scope[1] + scope[3]
        }
        return newScope
    }
}
