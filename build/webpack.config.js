const webpackMerge = require('webpack-merge')

const commonConfig = require('./webpack.config.base')
const devConfig = require('./webpack.config.dev')
const proConfig = require('./webpack.config.prod')

module.exports = (env) => {
    switch(true) {
        case env.development:
            return webpackMerge.merge(commonConfig, devConfig)

        case env.production:
            return webpackMerge.merge(commonConfig, proConfig)

        default:
            new Error('No match configuration was wrong')
    }
}