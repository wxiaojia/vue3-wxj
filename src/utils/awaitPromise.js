/*
 * @Author: wxiaojia 
 * @Date: 2022-02-10 17:24:07 
 * @Last Modified by: wxiaojia
 * @Last Modified time: 2022-02-10 17:42:07
 * 使用 awiat/async 时，可捕获错误
 * 函数返回一个Promise且值是一个数组，数组之中有两个元素，
 * 如果索引为0的元素不为空值，说明该请求报错，
 * 如果索引0的元素为空值说明该请求没有报错，也就是成功。
 */

export function request( promise, errorText) {
    return promise
            .then(data => [null, data])
            .catch(err => {
                if (errorText) {
                    let parsetError = Object.assign({}, err, errorText)
                    return [parsetError, undefined]
                }

                return [err, undefined]
            })
}

export default request

// 使用：
// const [resErr, res] = await request(request('/basic/login', {
//     usename: 'sunshine',
//     password: '123456'
//   }))
//   if (resErr) {
//     // fail do somthing
//     return
//   }