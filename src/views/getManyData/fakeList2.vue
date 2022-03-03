<template>

    <el-button @click='getData'>直接渲染</el-button>
    <el-button @click='renderList'>分页渲染</el-button>
    <el-button @click='renderList2'>requestAnimationFrame</el-button>
    <el-button @click='renderList3'>文档碎片 + requestAnimationFrame</el-button>
    <el-button @click='lazy'>懒加载</el-button>
    
    <div ref='container' id='list'></div>

    <div v-if='lazyLoad' id="containerV" @scroll="handleScroll" ref="containerV">
        <div class="sunshine" v-for="item of showList" :key='item.tid'>
            <img :src="item.src" />
            <span>{{ item.text }}</span>
        </div>
        <div class='blank' ref="blank"></div>
    </div>
</template>

<script setup lang='ts'>
import { watch, computed, onMounted, ref, toRaw } from 'vue'
import { getList } from '@/api/http.js'

let container = ref<HTMLElement>()
const lazyLoad = ref(false)

//  直接渲染  1456.652099609375 ms
const getData = async () => {
    lazyLoad.value = false

    console.time('直接渲染列表时间')
    const list = await getList()
    const startTime = new Date().getTime()
    list.forEach(item => {
        const div = document.createElement('div')
        div.className = 'sunshine'
        div.innerHTML = `<img src="${item.src}" /><span>${item.text}</span>`
        container.value.appendChild(div)
    })
    console.timeEnd('直接渲染列表时间')
    const endTime = new Date().getTime()
    console.log(endTime - startTime)

}

// 分页渲染  239.77001953125 ms
const renderList = async () => {
    lazyLoad.value = false

    console.time('分页渲染列表时间')
    const list = await getList()
    const total = list.length
    const page = 0
    const limit = 200
    const totalPage = Math.ceil(total / limit)

    const render = (page) => {
        if (page >= totalPage) return
        setTimeout(() => {
            for (let i = page * limit; i < page * limit + limit; i++) {
                const item = list[i]
                const div = document.createElement('div')
                div.className = 'sunshine'
                div.innerHTML = `<img src="${item.src}" /><span>${item.text}</span>`
                container.value.appendChild(div)
            }
            render(page + 1)
        }, 0)
    }
    render(page)
    console.timeEnd('分页渲染列表时间')
}

// requestAnimationFrame  213.689208984375 ms
// 使用requestAnimationFrame代替setTimeout，减少了重排的次数，极大提高了性能，
// 建议在渲染方面多使用requestAnimationFrame
const renderList2 = async () => {
    lazyLoad.value = false

    console.time('requestAnimationFrame 列表时间')
    const list = await getList()
    const total = list.length
    const page = 0
    const limit = 200
    const totalPage = Math.ceil(total / limit)

    const render = (page) => {
        if (page >= totalPage) return
        // 使用requestAnimationFrame代替setTimeout
        requestAnimationFrame(() => {
            for (let i = page * limit; i < page * limit + limit; i++) {
                const item = list[i]
                const div = document.createElement('div')
                div.className = 'sunshine'
                div.innerHTML = `<img src="${item.src}" /><span>${item.text}</span>`
                container.value.appendChild(div)
            }
            render(page + 1)
        })
    }
    render(page)
    console.timeEnd('requestAnimationFrame 列表时间')
}
// 文档碎片 + requestAnimationFrame  473.925048828125 ms
const renderList3 = async () => {
    lazyLoad.value = false

    console.time('文档碎片 + requestAnimationFrame 列表时间')
    const list = await getList()
    const total = list.length
    const page = 0
    const limit = 200
    const totalPage = Math.ceil(total / limit)

    const render = (page) => {
        if (page >= totalPage) return
        requestAnimationFrame(() => {
            // 创建一个文档碎片
            const fragment = document.createDocumentFragment()
            for (let i = page * limit; i < page * limit + limit; i++) {
                const item = list[i]
                const div = document.createElement('div')
                div.className = 'sunshine'
                div.innerHTML = `<img src="${item.src}" /><span>${item.text}</span>`
                // 先塞进文档碎片
                fragment.appendChild(div)
            }
            // 一次性appendChild
            container.value.appendChild(fragment)
            render(page + 1)
        })
    }
    render(page)
    console.timeEnd('文档碎片 + requestAnimationFrame 列表时间')
}

// 懒加载
const lazy = () => {
    lazyLoad.value = true
}
const list = ref([])
const page = ref(1) // 页码
const limit = 20    // 一页展示
const maxPage = ref()
const containerV = ref<HTMLElement>()
const blank = ref<HTMLElement>()
    
watch(lazyLoad, async (newV, oldV) => {
    if (newV) {
        const res = await getList()
        console.log(res)
        list.value = res   
        maxPage.value = computed(() => Math.ceil(list.value.length / limit))    // 最大页码
    }
})
const showList = computed(() => list.value.slice(0, page.value * limit))

const handleScroll = () => {
    console.time('懒加载 列表时间')
    
    // 当前页数和最大页数的比较
    if ( page.value > maxPage.value ) return
    const clientHeigth = containerV.value?.clientHeight
    const blankTop = blank.value?.getBoundingClientRect().top
    console.log('clientHeigth', clientHeigth)
    if (clientHeigth >= blankTop - 100) {
        // blank出现在视图，则当前页数加1
        page.value++
    }
    console.timeEnd('懒加载 列表时间')

}

onMounted(async () => {
    container.value = document.getElementById('list')
    // getData()
    // renderList()
    // renderList2()
    // renderList3()
    // renderList4()
})
</script>


<style scope>

    #container {
      height: 100vh;
      overflow: auto;
    }
    .sunshine {
      display: flex;
      padding: 10px;
    }
    img {
      width: 150px;
      height: 150px;
    }
    #containerV {
        height: 680px;
        top: 6rem;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: auto;
    }
    .blank {
        height: 20px;
    }

  </style>
