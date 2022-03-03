import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
const CancelToken = axios.CancelToken;
const source = CancelToken.source();
// 请求被取消：忽略
// 网络异常：提示检查是否连接网络
// 请求超时：提示网络慢，请切换网络
// 服务器异常：提示系统出问题了
// 响应解析失败：同上，且可以进行错误日志上报
// 请求失败：这种情况通常是业务异常，前端需要根据错误码进行相应的处理，最简单的就是消息提醒
// 请求成功：前端拿到数据后更新界面

axios.defaults.baseURL = '/api'
axios.defaults.timeout = 60000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 错误处理
const err = (error) => {
    if (error.message.includes('timeout')) {
        // 请求超时，请刷新网络请求
        ElMessage({
            message: error.message,
            type: '请求超时',
            duration: 5 * 1000
        })
    } 
    if (error.response?.status) {
        const status = error.response.data
        let message = ''
        switch (status) {
	        case 400:
	            message = '请求错误';
	            break;
	        case 401:
	            message = '请求错误';
	            break;
	        case 404:
	            message = '请求地址出错';
	            break;
	        case 408:
	            message = '请求超时';
	            break;
	        case 500:
	            message = '服务器内部错误!';
	            break;
	        case 501:
	            message = '服务未实现!';
	            break;
	        case 502:
	            message = '网关错误!';
	            break;
	        case 503:
	            message = '服务不可用!';
	            break;
	        case 504:
	            message = '网关超时!';
	            break;
	        case 505:
	            message = 'HTTP版本不受支持';
	            break;
	        default:
	            message = '请求失败'
	    }
    }
    return Promise.reject(error)
}

// 扩展额外的属性
type Config = AxiosRequestConfig & {successNotice? : boolean, errorNotice? : boolean}

axios.interceptors.request.use(
    (config: Config) => {
        console.log('我是请求拦截', sessionStorage.getItem('TOKEN'))
         // 如果有token 就携带tokon
        config.headers['Access-Token'] = sessionStorage.getItem('TOKEN') || '';
        return config;
    },
    err
)

axios.interceptors.response.use(
    (response: AxiosResponse) => {
        const config: Config = response.config;
        const code = Number(response.status)

        if (code === 200) {
            if (config && config.successNotice) {
                // 弹窗 response.data.msg
                ElMessage({
                    message: response.data.message,
                    type: 'success',
                    duration: 5 * 1000
                  })
            }
            return response.data
        } else {
            let errCode = [402, 403]
            if (errCode.includes(response.data.code)) {
                // 弹窗 response.data.msg
                ElMessage({
                    message: response.data.msg,
                    type: 'error',
                    duration: 5 * 1000
                  })
            }
        }

    },
    err
)

interface ResType<T> {
    code: number
    data?: T
    msg: string
    err?: string
}
interface Http {
    get<T>(url: string, params?: unknown): Promise<ResType<T>>
    post<T>(url: string, params?: unknown): Promise<ResType<T>>
    upload<T>(url: string, params: unknown, onUploadProgress?: any): Promise<ResType<T>>
    download(url: string): void
}

const http: Http = {
    get(url, params) {
        return new Promise((resolve, reject) => {
            axios.get(url, { params }).then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
        })
    },
    post(url, params) {
        return new Promise((resolve, reject) => {
            axios.post(url, JSON.stringify(params), {
                cancelToken: source.token
            }).then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
        })
    },
    upload(url, file, onUploadProgress) {
        return new Promise((resolve, reject) => {
            axios.post(url, file, 
                { headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress})
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
        })
    },
    download(url) {
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = url
        iframe.onload = function () {
            document.body.removeChild(iframe)
        }
        document.body.appendChild(iframe)
    }
}
  

export default http;

