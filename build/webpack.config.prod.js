
const path = require('path')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    mode: 'production',

    output: {
        filename: 'scripts/[name].[contenthash].js',      // name: 拿到入口的key
        publicPath: '',         // 如果指向的是cdn或者其他服务器，可以在这加上，打包后html中的资源会加上这个路径（绝对路径）
    },

    // 优化的配置
    optimization: {
        minimizer: [
            new CssMinimizerWebpackPlugin(),     // ps: mode是生产环境的
            new TerserPlugin()                  // 因为配置了css压缩，所以js代码压缩失效，需要加上配置terser
        ],
        // 多文件打包时，抽离公共代码用
        // splitChunks: {
        //     chunks: 'all'       // 把所有公共代码都分离出来
        // }
    },

    // 性能方面相关的配置
    performance: {
        hints: false    // 将性能提示去掉
    }
  
}