import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/information',
  component: utils.view('Layout'),
  meta: {
    title: '数据'
  },
  children: [
    {
      path: 'info',
      name: 'info',
      component: utils.view('information/index'),
      meta: {
        breadcrumb: [
          {
            label: '数据大屏',
            value: null
          }
        ]
      }
    }
  ]
}
