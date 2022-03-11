# 使用 mutationObserver 监听水印是否被修改

其实实现水印并不难，只需要利用自定义指令 + canvas + background-image即可，实现起来也非常方便：

# 水印的思路：
第一步：创建个canvas且画好水印
第二步：创建个水印容器div标签
第三步：将canvas画布转图片链接，赋值给div标签的background-image样式属性
第四步：将水印容器div放到目标元素之下

缺点：
1、可以控制background-image 为空
2、可以直接delete删除
3、可以加background-repeat: no-repeat，较少水印

# mutationObserver: 监控DOM元素的变化
1、审查元素修改容器div的background-image属性为空（禁止修改样式）
2、审查元素把容器div给删掉

disconnect()
阻止 MutationObserver 实例继续接收的通知，直到再次调用其observe()方法，该观察者对象包含的回调函数都不会再被调用。
observe()
配置MutationObserver在DOM更改匹配给定选项时，通过其回调函数开始接收通知。
takeRecords()
从MutationObserver的通知队列中删除所有待处理的通知，并将它们返回到MutationRecord对象的新Array中。

一个例子：
```javascript
// 选择需要观察变动的节点
const targetNode = document.getElementById('some-id');

// 观察器的配置（需要观察什么变动）
const config = { 
    attributes: true, // 属性的变动
    childList: true, //子元素的变动
    subtree: true   // 所有下属节点（包括子节点和子节点的子节点）的变动
};

// 当观察到变动时执行的回调函数
const callback = function(mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
        }
        else if (mutation.type === 'attributes') {
            console.log('The ' + mutation.attributeName + ' attribute was modified.');
        }
    }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 之后，可停止观察
observer.disconnect();
```

