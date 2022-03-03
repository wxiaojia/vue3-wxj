/**
 * 用来配置 jest 的测试行为。
 * 不同格式的文件需要使用不同命令来配置，对于.vue 文件我们使用 vue-jest，
 * 对于.js 或者.jsx 结果的文件，我们就要使用 babel-jest，
 * 而对于.ts 结尾的文件我们使用 ts-jest，
 * 然后匹配文件名是 xx.spect.js。这里请注意，Jest 只会执行.spec.js 结尾的文件。
 */

module.exports = {
    transform: {
        // .vue文件用 vue-jest 处理 
        '^.+\\.vue$': 'vue-jest', 
        // .js或者.jsx用 babel-jest处理 
        '^.+\\.jsx?$': 'babel-jest', 
        //.ts文件用ts-jest处理 
        '^.+\\.ts$': 'ts-jest'
    },
    testMatch: ['**/?(*.)+(spec).[jt]s?(x)']
}