// 常用的方式是使用正则或者split方法，其实不然，URLSearchParams和URL都能很好的实现功能。

const urlSP = new URLSearchParams(location.search);
function getQueryString(key){
    return urlSP.get(key)
}

const urlObj = new URL(location.href);
function getQueryString(key){
    return urlObj.searchParams.get(key)
}

// 测试地址： /index.html?pid=10

const log = console.log;
getQueryString

log("pid", getQueryString("pid"));  // pid 10
log("cid", getQueryString("cid"));  // cid null
