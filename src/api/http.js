import http from 'utils/request.ts'

// 登录
export function login(data){   //登录
    return http.get('/user/login', data)
}
// 获取好多好多数据的列表
export function getList(data) {
    return http.get('/getManyData', data)
}
// 登出
export function logout(data) {
    return http.get('/logout', data)
}

export function userInfo(data) {
    return http.get('/getUserInfo', data)
}
// 上传文件, onUploadProgress 进度处理
export function upload(data, onUploadProgress) {
    return http.upload('/upload', data, onUploadProgress)
}

export function merge(data) {
    return http.post('/merge', data)
}

export function uploadSingle(data) {
    return http.upload('/uploadSingle', data)
}

export function verifyUpload(data) {
    return http.post('/verify', data)
}

// 请求很多次用
export function request(data) {
    return http.get('/request', data)
}

export function insertReq(data) {
    return http.get('/insertReq', data)
}