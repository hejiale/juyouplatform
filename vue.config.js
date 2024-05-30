const path = require('path')
// const PurifyCSSPlugin = require('purifycss-webpack')
// const glob = require('glob-all')

function resolveRealPath(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  //  "baseUrl" option in vue.config.js is deprecated now, please use "publicPath" instead.
  publicPath: './',
  productionSourceMap: false,
  devServer: {
    // proxy: 'http://192.168.3.81:8855'
    proxy: 'https://www.uat.juyyds.com'
    // proxy: 'http://192.168.10.29:8855'
  },
  css: {
    loaderOptions: {
      // 给 styles-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        data: `@import "@/assets/styles/_variables.sass", "@/assets/styles/_mixins.sass"`
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', resolveRealPath('src'))
      .set('@utils', resolveRealPath('src/utils'))
      .set('@views', resolveRealPath('src/views'))
      .set('@assets', resolveRealPath('src/assets'))
      .set('@styles', resolveRealPath('src/assets/styles'))
      .set('@img', resolveRealPath('src/assets/images'))
      .set('@global', resolveRealPath('src/components/global'))
      .set('@partial', resolveRealPath('src/components/partial'))
    // svg loader
    const svgRule = config.module.rule('svg') // 找到svg-loader
    svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
    svgRule // 添加svg新的loader处理
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolveRealPath('src/icons'))
    config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  }
  // configureWebpack: config => {
  //   config.plugins.push(new PurifyCSSPlugin({
  //     paths: glob.sync([
  //       path.join(__dirname, './src/index.html'),
  //       path.join(__dirname, './**/*.vue'),
  //       path.join(__dirname, './src/**/*.js')
  //     ])
  //   }))
  // }
}
