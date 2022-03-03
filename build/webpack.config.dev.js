
const path = require('path')

module.exports = {
    mode: 'development',
    
    output: {
        filename: 'scripts/[name].js',      // name: 拿到入口的key
     },

    devtool: 'cheap-module-source-map',
    devServer: {
        static: './dist',
        compress: true,        // 是否进行代码压缩，可以减少传输的数据大小 => gzip
        port: 3000,
        headers: {
            'x-Access-Token': 'sasd'        // 这里设置响应头
        },
        // 代理
        proxy: {
            '/api': 'http://localhost:8077'
        },
        // https: true,        // 开启https
        // http2: true,           // 开启http2,自带https的
        historyApiFallback: true,   // spa时，如果跳转到的路由没有找到，会直接报错，加上这个，任意路由都可以输入，其实是跳到跟页面
        host: '0.0.0.0',         // 同一局域网上的其他小伙伴可以访问我们的项目啦
        hot: true,               // 模块热替换，有模块新增删除替换时，无需重新加载页面，这个webpack是有默认的
        liveReload: true,       // 热加载
    },

}