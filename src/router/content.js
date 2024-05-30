import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/content',
  component: utils.view('Layout'),
  meta: {
    title: '内容'
  },
  children: [
    {
      path: 'trends',
      name: 'trendsManage',
      component: utils.view('content/trends/index'),
      meta: {
        breadcrumb: [
          {
            label: '动态管理',
            value: null
          }
        ]
      }
    }
  ]
}
