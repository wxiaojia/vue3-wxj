<template>
    <input type='file' @change='handleFileChange'/>
    <el-button @click='handleUpload'>上传</el-button>
    <el-button @click='pauseUpload'>暂停上传</el-button>

    <div style="width: 300px">
      总进度：
      <el-progress :percentage="totalPercent"></el-progress>
      切片进度：
      <div v-for="item in fileObj.chunkList" :key="item">
        <span>{{ item.chunkName }}：</span>
        <el-progress :percentage="item.percent"></el-progress>
      </div>
    </div>
</template>

<script setup lang='ts'>
import { computed, reactive } from "vue";
import { upload, merge, verifyUpload } from '@/api/http.js'
interface fileObj {
    file: any,
    chunkList: any[]
}

const fileObj = reactive<fileObj>({
    file: null,
    chunkList: []
})
// 上传了文件，存起来
const handleFileChange = (e: any) => {
    const [file] = e.target.files   // files是个数组，FileList
    if(!file) return 
    fileObj.file = file
}
// const singeUpload = () => {
//      if (!fileObj.file) return

//       let formdata = new FormData()
//       formdata.append("file", fileObj.file)

//       uploadSingle(formdata).then((res) => {
//         console.log(res, 'upload/singUpload')
//       })
// }
// 暂停上传
const pauseUpload = () => {

}
// 点了上传，调分割文件，调上传切片
const handleUpload = async () => {
    if (!fileObj.file) return
    // 判断是否已经上传过了
    const { shouldUpload } = await verifyUpload({
        fileName:fileObj.file.name,
    });
    if (!shouldUpload) {
        alert("秒传：上传成功");
        return;
   }

    const chunkList = createChunk(fileObj.file)
    fileObj.chunkList = chunkList.map(({ file }, index) => ({
        file,
        size: file.size,
        percent: 0,
        chunkName: `${fileObj.file.name}-${index}`,
        fileName: fileObj.file.name,
        index,
    }))
    uploadChunks()         // 执行上传切片的操作
}

// 分割文件
const createChunk = (file: any, size:number = 5 * 1024 * 1024) => {
    const chunkList = []
    let cur = 0     // 存储已经拿去截取的大小
    while(cur < file.size) {
        chunkList.push({ file: file.slice(cur, cur + size)})
        cur += size
    }
    return chunkList
}

// 上传文件，promise.all, 用form封装传
const uploadChunks = async () => {
    const requesList = fileObj.chunkList.map(({ file, fileName, index, chunkName }) => {
        const formData = new FormData()
        formData.append("file", file);
        formData.append("fileName", fileName);
        formData.append("chunkName", chunkName);
        return { formData, index };
    }).map(({ formData, index}) => {
        return upload(formData, createProgressHandler(
              fileObj.chunkList[index]
           ))
    })
    console.log(requesList)
    await Promise.all(requesList)
    mergeChunks()
}

//  传入监听上传进度回调
const createProgressHandler = (item: any) => {
    return (e) => {
         // 设置每一个切片的进度百分比
        item.percent = parseInt(String((e.loaded / e.total) * 100));
     };
}

const totalPercent = computed(() => {
    // 是否有切片上传
    if (fileObj.chunkList.length === 0) return 0

    const loaded = fileObj.chunkList
                    .map(({size, percent}) => size * percent)
                    .reduce((pre, next) => pre + next)
    
    return parseInt((loaded /fileObj.file.size).toFixed(2))  
})

// 告诉后端可以合并了
const mergeChunks = (size = 5 * 1024 * 1024) => {
    merge({ size,  fileName: fileObj.file.name})
} 
</script>