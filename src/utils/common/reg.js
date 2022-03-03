export default {
    isId: '/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/',
    userName: '/^[a-zA-Z0-9_-]{4,16}$/',
    weixin: '/[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/',
    pwdLooseF: '/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,10}$/',
    pwdLooseT: '/^[0-9a-zA-Z\u4E00-\uFA29]*$/',
    pwdStronge: '/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/',
    chinese: '/^[\u4e00-\u9fa5]{0,}$/',
    chineseNum: '/^[\u4e00-\u9fa5]{2,6}$/',
    name: '/^(?:[\u4e00-\u9fa5·]{2,16})$/',
    englishName: '/(^[a-zA-Z][a-zA-Z\s]{0,20}[a-zA-Z]$)/',
    pic: '/(.jpg|.gif|.png|.jpeg)+(\?|\#|$)/',
    phone: '/^1[34578]\d{9}$/',
    version: '/^\d+(?:\.\d+){2}$/',
    dotN: '/^[0-9]+(.[0-9]{2})?$/',
    dot: '/^\d+\.\d+$/',
    _dot: '/(-?\d+)(\.\d+)?/',
    num: '/-?\d+/'
}

/**
 * test: reg.test(str) 找到返回true，否则false 找到第一个后就会停止向后找
 * match: str.match(reg) 不匹配返回null ，匹配到就返回对应的数组
 * search: str.search(reg) 匹配成功返回对应得位置，不成功返回 -1
 * replace:str.replace(reg,newstring) newstring需要替换成的东西 返回替换完成后的字符串
 */

/**
 * isId: 身份证 eg:42112319870115371X
 * userName: 用户名 eg: jaywcjlove, 验证 数字、字母、_、-，不包含特殊字符，长度 4-16 之间。
 * weixin: 微信号 eg: jslite。微信号正则，6至20位，以字母开头，字母，数字，减号，下划线。
 * pwdLooseF: 密码（宽松） eg: diaoD123, Wgood123。必须是包含大小写字母和数字的组合，长度在 8-10 之间
 * pwdLooseT: 密码（宽松） eg: diaoD123, Wgood123。数字字母中文。
 * pwdStronge: 密码强度(包含特殊字符) eg: iaoD123#, Wgood123#$。密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符。
 * chinese: 汉字中文 eg: 中文, 湖北, 黄冈。不限制文字长度。
 * chineseNum: eg：中文, 湖北黄冈。2到6位汉字
 * name: 中文名字 eg: 周杰伦, 古丽娜扎尔·拜合提亚尔, 拉希德·本·穆罕默德·本·拉希德。
 * englishName: 英文名字 eg:Gene Kelly, Fred Astaire, Humphrey Bogart, GaryCooper, Cary Grant, Joan Crawford
 * pic: 图片后缀 eg：a/b/c.jpg?, a/b/c.png, a/b/c.png?good=1
 * phone: 手机号码 eg：13611778887
 * version: 版本号 X.Y.Z
 * dotN：小数点后几位，eg: 1.22, 0223.23。精确到 2 位小数
 * dot: 小数， eg: 0.0, 0.23, 10.54。
 * _dot: eg:-0.0, 0.23, -10.54。
 * num: 整数
 */


//  .*  .表示 匹配除换行符 \n 之外的任何单字符，*表示零次或多次。所以.*在一起就表示任意字符出现零次或多次。没有?表示贪婪模式。比如a.*b，它将会匹配最长的以a开始，以b结束的字符串。如果用它来搜索aabab的话，它会匹配整个字符串aabab。这被称为贪婪匹配。
//  又比如模式src=`.*`， 它将会匹配最长的以 src=` 开始，以`结束的最长的字符串。用它来搜索 <img src=``test.jpg` width=`60px` height=`80px`/> 时，将会返回 src=``test.jpg` width=`60px` height=`80px`

// ?: 匹配 pattern 但不获取匹配结果，也就是说这是一个非获取匹配，不进行存储供以后使用。这在使用 "或" 字符 (|) 来组合一个模式的各个部分是很有用。例如， 'industr(?:y|ies) 就是一个比 'industry|industries' 更简略的表达式。

