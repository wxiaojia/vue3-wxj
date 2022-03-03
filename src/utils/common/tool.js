
// 节流，一段时间内无论触发几次都只执行一次
// export function throttle (fn, wait) {
//     let prev = new Date()
//     return function () {
//         let now = new Date()
//         console.log(timmer - now)
//         if (now - prev > wait) {
//             fn.apply(this, arguments)
//             prev = new Date()
//         }
//     }
// }

// 节流：一段时间内。无论触发几次，只发生一次请求
export function throttle(handler, wait) {
    console.log(handler)
    console.log(wait)
    var lastTime = 0;
    return function (e) {
        var nowTime = new Date().getTime();
        console.log('我竟来了')
        if (nowTime - lastTime > wait) {
            handler.apply(this, arguments);
            lastTime = nowTime;
        }
    }
}
