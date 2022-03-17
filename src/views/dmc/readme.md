 canvas分为4个部分，模型分析，刮刮乐，钟表，画板
 
paramType： 2 资源 7 条件 4 结果集 3 图
 
 #  功能：
 * 1、a类 导弹 canvas画图   createDataSourceCanvas ✅
 * 2、b类 圆形 canvas画圆   drawCircular  ✅
 * 3、c类 圆角矩形 canvas画圆角矩形  drawRoundedRect ✅
 * 4、d类 自定义 canvas drawImg   ✅ 测试未通过，不能展示，img的src路径问题？？？？ drawImg
 * 5、操作后颜色运行中 - 上方状态，几秒后成功或失败（颜色改变？）
 * 6、fillText 写文字   ✅  myCanvas.fillText
 * 7、操作的画线 还差箭头 ✅  lineCoordinate
 * 9、创建canvas，初始化  ✅  
 * 10、右键菜单    ✅
 * 11、结果       ✅ 
 * 12、多个标签
 * 13、怎么让同一组首尾相应的一起拖动？   ✅ 
 * 14、检测点击的是图（拖拽） / x / 拉线 
 * 15、结果的画线 ✅ 
 * 16、图形的存储，划分为size*size的格子  ✅
 * 17、重新排版，布局 
 * 18、重复判断 - 栅格化，确定这附近是否存在资源  ✅
 * 19、点击弹出框 ✅
 * 20、点击拖动当前整体 ✅ 
 * 21、点击删除
 * 22、结果集继续操作

 # 初始化时展示原有的资源：
 + 若不为空：
    获取该画布的属性，resource 所有节点（资源、操作、结果）
    拿到关系链，画布栅格化去标记哪些区域有资源，
    去除前面的字母，剩余数字就是节点的生成/操作顺序，并按照这个顺序去画图，没有关系的图，只是渲染出节点（所以画图部分抽离出来）
    自动排版


 * isExitGridId(arr: string[], id: string):string[] gridArr中的这个区域是否已存在该id
 * deleteGridArr(arrId = []):void
    Q: 删除传过来的id所在的,只删一个??
    A: 获取到的id确实是一条关系的最后一个，但是scope[链的开头坐标x, y,整个链的长w, 整个链的高h]，
        所以移动的就是整一个关系链的移动,这里删除还要分这个链的哪一部分（源 操作 结果），一般删除只删除操作和结果
 * changeGridArr(id: string):void 画布中gridArr添加此id,修改这个id在画布的位置
 * drawDataSource(x: number, y:number, item: any):void 资源
 * drawCondition(x: number, y: number, item: any):void 圆形
 * drawResultSet(x: number, y: number, item: any):void 矩形
 * drawImg(x: number, y: number, item: any):void 画图   （测试未通过）
 * initIdAndNum:void 初始化画布和值
 * initCanvas 重新画画布，画布大小，颜色，资源，画线，箭头。。。（未完成）
 * getCoordinateResource(coordinate = {x: 0, y: 0}, isClick = false):any 获取当前坐标的资源
 * canvasContextmenu(e: MouseEvent):void 点击右键 =》 获取当前位置资源，设置右键菜单样式，展示
 * initCanvasParam:void  初始化画布，=》 画布和绘画大小，gridArr初始化，添加右键监听
 * clearCanvasMoveAndDrawLine:void 取消划线和移动后的清空数据的方法
 * getDataRelactionId:string 获取当前对象在关系中的顶层id
 * getModule(type = 1, subType?: number):any 通过资源类型获取对应的资源基本属性
 * validateMoveSite(site: {x: number, y: number}, data: any):boolean 判断是否移除了画布
    site 移动的距离，data 原坐标，相加后与画布的高宽对比
 * moveSite(site: {x: number, y: number}, data: any):any  移动后的坐标
 * canvasClick 画布点击 （未完成） 获取资源->是否可点击啊
 * canvasMouseMove 画布中移动，
    如果是移动，判断是否回到了当前的资源，是->其实是点击事件，判断是否移动超出了画布范围
    如果是拉线，记录位置
 * getCoordinateResourceRelation(coordinate = {x:0, y: 0}, type = 0): any 返回资源
    获取当前鼠标移动或者点击对应的资源结果根节点对象, coordinate 当前坐标，type：0 默认 1 移动 2 拉线
    获取当前资源的区域
    是否还有其他资源，没有为null,
    循环该区域的资源，相加？？？然后比较是否重叠？？？
 * canvasMouseUp(e: MouseEvent): void 在画布中点下的时候绑定监听事件
    是否为鼠标的有效移动：
    有效：1、画线 2、资源移动，是否移动出画布，修改位置
    无效：只是点击事件
 * canvasMouseDown(e: MouseEvent) 在画布中点下
    如果当前画布无资源，点击无效哦，
    获取当前点击的资源
    然后要获取顶层对象，dataRelation存这链，查找到顶层对象可以拿到整个链的信息
    判断类型，还有是连线还是移动的，
      若为连线，画线坐标存储 lineCoordinate
      若为移动，移动的坐标存储 moveCoordinate
    绑定 canvasMouseMove 移动事件 和 canvasMouseUp 鼠标抬起事件
 * canvasMouseOver 进入画布事件
 * canvasMouseLeave 离开画布事件
 * initFilterCanvas 画布上的圆形，操作的，初始化
 * drawCircle 画圆
 * isCover 用勾股定理判定是否重复（没有用这个）
 * isExitResource(scope: number[]) （初始化坐标x，y, 资源的宽，高）
    查找栅格化中，该坐标的范围内是否有资源（得到数组）
    是否相交？---（未完）
 * changeXl(w = 0):void 当前横向的区域块
 * changeCanvasSize(isAddW = false, isAddH = false) 改变画布大小
 * drop(e: MouseEvent) 放置。 
    先判断是否有拖动资源
    是否重合
    获取当前坐标及资源配置，先判断放置的时候是否重叠，重叠则加上60，然后画图啦
    

 * 自动排版：设置默认初始位置[60, 60]
    拿到关系链 dataRelation, 先布局单独的资源或者数据过滤，一个画布中有多个结果即多个链，这里的单独是， 比如多个结果，每个结果都是单独的资源或者操作，不是真实的操作资源得到的，如果去渲染的话，记得把拿到的key在keys中删除掉，表示改孤独节点已经渲染啦，还要记录已经渲染的（为什么）
    改变canvas大小
    删除在gridArr里的位置，再重新放进去

    循环该画布中的所有链，排序：从资源（头）开始到结尾
