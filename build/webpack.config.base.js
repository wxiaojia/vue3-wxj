
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader/dist/index');

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}
  

module.exports = {
    entry: {
        index: './src/main.ts',
        // another: './src/another.js'     // 多文件入口，如果两个入口都使用同一个js文件，那么可能会出现重复打包那一个模块

        // 解决重复代码一：如果两个文件都引用了loadsh，那么把loadsh拿出来，取名教shared的一个chunk，这样打包就只有一个loadsh共用的，两个入口文件大小就小点
        // index: {
        //     import: './src/main.ts',
        //     dependOn: 'shared'
        // },
        // another: {
        //     import: './src/another.ts',
        //     dependOn: 'shared'
        // },
        // shared: 'loadsh'

        // 解决重复代码二：用splitChunk,这里的入口跟以前一样
        // index: './src/main.ts',
        // another: './src/another.js' 
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        clean: true,            // 打包之前清楚目录中的内容
        assetModuleFilename: 'images/[contenthash][ext]',
     },
    resolve: {
        extensions: ['.js', '.ts', '.vue', '.json'],
        // 设置别名
        alias: {
            //后面的$符号指精确匹配，也就是说只能使用 import vuejs from "vue" 这样的方式导入vue.esm.js文件，不能在后面跟上 vue/vue.js
            'vue': 'vue/dist/vue.esm-bundler.js',
            '@': resolve('src'),
            'utils': resolve('src/utils'),
            'components': resolve('src/components'),
            'directive': resolve('src/utils/directive'),
            'assets': resolve('src/assets')
        },
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            [
                                '@babel/plugin-transform-runtime'
                            ]
                        ]
                    }
                }
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.ts$/,
                exclude: /node-modules/,
                use: 'ts-loader',
            },
            {
                test: '/\.css$/',
                exclude: '/node_modules/',
                use: 'style-loader!css-loader!postcss-loader'
            },
            {
                test: '/\.scss$/',
                exclude: '/node_modules/',
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },
             // 图片文件
             {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: "asset",  // >8K，一般会转换为 "asset/resource", 会生成一个uri,用import可导入，会生成一个文件
                generator: {
                    filename: 'images/[contenthash][ext]'   // 如果output也设置了，此处的优先级更高
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024 * 1024        // 大于4M的时候才会生成用asset/resource
                    }
                }
            },
            // 字体文件
            {
                test: /\.(otf|eot|woff2?|ttf|svg)$/i,
                type: "asset", // <8K，一般会转换为 "asset/inline", 内敛到打包的js文件中（base64）
            },
            // 数据文件
            { 
                test: /\.(txt|xml)$/i,
                type: "asset", // 一般会转换成 "asset/source",会导出资源源码
            },
            { 
                test: /\.(tsv|csv)$/i,  // 转化为数组
                type: "csv-loader", 
            },
            { 
                test: /\.xml$/i,    // => 转化成js对象
                type: "xml-loader", 
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            inject: 'body',     // 将添加的script添加到body中
        }),
        new VueLoaderPlugin(),
         // 抽离css文件
        new MiniCssExtractPlugin({
            filename: 'styles/[contenthash].css'
        }),
    ],

    // 优化的配置
    optimization: {
        // 多文件打包时，抽离公共代码用
        // splitChunks: {
        //     chunks: 'all'       // 把所有公共代码都分离出来
        // }
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
}