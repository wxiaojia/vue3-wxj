
function doNotify(title, options, events) {
    const notification = new Notification(title, options)
    for (let event in events) {
        notification[event] = events[event];
    }
}

export default function notify(title, options = {}, events = {}) {
    if (!("Notification" in window)) {
        return console.error("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        doNotify(title, options, events);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {           
            if (permission === "granted") {
                doNotify(title, options, events);
            }
        });
    }
}

// Notification.permission 只读
// 一个用于表明当前通知显示授权状态的字符串。可能的值包括：
// denied (用户拒绝了通知的显示), 
// granted (用户允许了通知的显示), 
// default (因为不知道用户的选择，所以浏览器的行为与 denied 时相同).
