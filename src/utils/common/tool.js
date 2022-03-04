
// 节流：一段时间内。无论触发几次，只发生一次请求
export function throttle(handler, wait) {
    var lastTime = 0;
    console.log('我进来了')
    return function (e) {
        var nowTime = new Date().getTime();
        console.log('我是节流')
        if (nowTime - lastTime > wait) {
            handler.apply(this, arguments);
            lastTime = nowTime;
        }
    }
}


