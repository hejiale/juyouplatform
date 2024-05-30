// 将/components/global里面的组件设为全局组件
import Vue from 'vue'
import _ from '@/utils/lodash'
import config from '@/config'

const requireComponent = require.context(
    // 其组件目录的相对路径
    './global',
    // 是否查询其子目录
    true,
    // 匹配基础组件文件名的正则表达式
    /\.(vue|js)$/
)

requireComponent.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = requireComponent(fileName)

  // 获取组件的 PascalCase 命名
  const componentName =
      _.upperFirst(config.componentPrefix) +
      _.upperFirst(
          _.camelCase(
              // 剥去文件名开头的 `'./` 和 `/index` 和结尾的扩展名
              fileName.replace(/^\.\/(.*)\/index\.\w+$/, '$1').replace('vue', '')
          )
      )
  // 全局注册组件
  Vue.component(
      componentName,
      // 如果这个组件选项是通过 `export default` 导出的，
      // 那么就会优先使用 `.default`，
      // 否则回退到使用模块的根。
      componentConfig.default || componentConfig
  )
})
