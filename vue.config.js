//vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    publicPath: './',
    outputDir: 'dist',
    pages: {
        index: {
          entry: 'src/main.js',
          template: 'public_files/index.html',
          filename: 'index.html',
        }
    },
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([{ from: 'public_files/', to: '' }])
        ],
    }
}