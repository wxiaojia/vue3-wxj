<template>   
<div class="about">
    <h1>登录页</h1>
    <el-form :model="loginData" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      
      <el-form-item label="用户名" prop="account">
        <el-input ref='userNameRef' v-model="loginData.account"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input ref='passwordRef' type="password" v-model="loginData.pwd"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">立即创建</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script lang='ts' setup>
import { ElLoading, ElMessage } from 'element-plus'
import { ref, unref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.js'
import { login } from '@/api/http.js'
// let todos = useSessionStorage('todos', [])
import { setStorage } from 'utils/common/useStorage.js'
// import axios from 'axios'

const router = useRouter()
const state = useUserStore()

// 对密码和邮箱进行类型限制
interface loginData {
    account: string;
    pwd: string;
}

const loginData = ref<loginData>({
    account: '',
    pwd:''
})

// 定义规则
const rules = reactive({
    account: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
    ],
    pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 3, max: 18, message: '长度在 3 到 18 个字符', trigger: 'blur' }
    ]
})

const ruleForm = ref()
const userNameRef = ref()
const passwordRef = ref()

onMounted(() => {
      if (loginData.value.account === '') {
        (userNameRef.value as any).focus()
      } else if (loginData.value.pwd === '') {
        (passwordRef.value as any).focus()
      }
    })

// 重置表单
const resetForm = () => {
    // unref:不知道是ref还是proxy，等同于 isRef(val) ? val.value : val
    const form = unref(ruleForm)
    form.resetFields()
}

let loading = ref(false)    // 加载中
const submitForm = async () => {
    let form = unref(ruleForm)

    if (!form) {
        return
    }
    try {
        form.validate(async (valid: boolean) => {
            if (valid) {
                loading.value = true
                const res = await login(loginData.value)
                const { data, token } = res
                loading.value = false
                if (token) {
                    sessionStorage.setItem('TOKEN', token)
                    sessionStorage.setItem('UERRINFO', JSON.stringify(data))
                    state.updateRoles(data.roles)
                    router.push({name: 'index'})
                } else {
                    ElMessage({ message: '登录失败', type: 'error' })
                }
            } else {
                return false
            }
        })
    } catch (err) {
         console.log(err)
    }
}
 
</script>


