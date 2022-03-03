<!-- 
1、可视区域的高度 boxHeight
2、列表项的高度   itemHeight
3、可视区域能展示的列表项个数 = ~~(可视区域高度 / 列表项高度) + 2 itemNum
4、开始索引    startIndex
5、结束索引    endIndex  = 可视区域能展示的列表项个数 + startIndex,注意超出列表长度
6、预加载（防止滚动过快，造成暂时白屏），怎么预加载？ => 获取下一页的数据
7、根据开始索引和结束索引，截取数据展示在可视区域
8、滚动节流 => 一段时间内无论触发几次都只执行一次
9、上下空白区使用padding实现 => 通过上下剩余多少数据 * 列表项高度
10、滑动到底，再次请求数据并拼接
 -->

 <template>
    <div class="v-scroll" @scroll.passive="doScroll" ref="scrollBox">
      <div :style="blankStyle" style="height: 100%">
        <div v-for="item in tempSanxins" :key="item.tid" class="scroll-item">
          <span>{{ item.text }}</span>
          <img :src="item.src" />
        </div>
      </div>
    </div>
  </template>
  
  <script lang='ts' setup>
  import { throttle } from 'utils/common/tool'
  import { computed, onMounted, ref } from 'vue'
  import { getList } from '@/api/http.js'
import { lte } from 'lodash'

    let list = ref([])
    const getData = async () => {
      const res = await getList()
      list.value = res.splice(0, 50)
    }

    // -----------------1、获取可视区高度-----------------
    const scrollBox = ref<HTMLElement>()
    let boxHeight:number = 0

    onMounted(() => {
      getData()

      getScrollBoxHeight()
      // 监听屏幕变化以及旋转，都要重新获取可视区域的高度
      window.onresize = getScrollBoxHeight;
      window.onorientationchange = getScrollBoxHeight;
    })

    const getScrollBoxHeight = () => {
      boxHeight = scrollBox.value?.clientHeight! 
    }

  // -----------------2、列表项高度-----------------
  const itemHeight = 150                            

  // -----------------3、可视区域能展示的列表项个数-----------------
  // ~~是向下取整的运算符，等同于Math.floor()，为什么要 +2 ，是因为可能最上面和最下面的元素都只展示一部分
   const itemNum = computed(() => ~~(boxHeight / itemHeight + 2))

  // -----------------4、开始索引 -----------------
  let startIndex = ref(1)                    

  // -----------------5、结束索引 -----------------
  // endIndex的计算公式：(开始索引 + 可视区域可展示多少个列表项 * 2)
  // 比如可视区域可展示8个列表项，startIndex是0的话endIndex就是0 + 8 * 2 = 16，startIndex是1的话endIndex就是1 + 8 * 2 = 17，以此类推
  // 为什么要乘2呢，因为这样的话可以预加载出一页的数据，防止滚动过快，出现暂时白屏现象
  const endIndex = computed(() => {
    let index = startIndex.value + itemNum.value * 2
    if (!list.value[index]) {
      index = list.value.length - 1
    }
    return index
  })

  // -----------------6、预加载（防止滚动过快，造成暂时白屏） -----------------
  // 可视区域展示的截取数据，使用了数组的slice方法，不改变原数组又能截取
  const tempSanxins = computed(() => {
      console.log(startIndex.value)
      const useList  = list.value
      let startI = 0
      if (startIndex.value <= itemNum.value) {
        startI = 0
      } else {
        startI = startIndex.value - itemNum.value
      }
      return list.value.slice(startI, endIndex.value + 1)
  })

  // -----------------7、根据开始索引和结束索引，截取数据展示在可视区域-----------------
  // -----------------8、滚动节流----------------
  // -----------------9、上下空白区使用padding实现-----------------
  let blankStyle = computed(() => {
      // 上下方的空白处使用padding来填充
      let startI = 0
      if (startIndex.value < itemNum.value) {
          startI = 0
      } else {
          startI = startIndex.value - itemNum.value
      }
      return {
          paddingTop: ( startIndex.value - 1 )  * itemHeight + "px",
          paddingBottom: (list.value.length - endIndex.value - 1) * itemHeight + 'px'
      }
  })

  // -----------------10、滑动到底，再次请求数据并拼接, // 节流，-----------------
  const doScroll = throttle(function () {
        console.log('startIndex', startIndex.value)
        const index = ~~(scrollBox.value?.scrollTop / itemHeight)
        if (index === startIndex.value ) return
        startIndex.value = index
        if (startIndex.value + itemNum.value > list.value.length - 1) {
            // 已经到底了,再发送请求(分页的话需要，不分页不需要)
            // getData();
        }
    }, 200)
  
  </script>

  <style lang='scss' scoped>
    .v-scroll {
  height: 100%;
  /* padding-bottom: 500px; */
  overflow: auto;

  .scroll-item {
    height: 148px;
    /* width: 100%; */
    border: 1px solid black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    img {
      height: 100%;
    }
  }
}
  </style>