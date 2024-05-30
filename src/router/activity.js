import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/activity',
  component: utils.view('Layout'),
  meta: {
    title: '展会'
  },
  children: [
    {
      path: 'info',
      name: 'ActivityInfo',
      component: utils.view('activity/index'),
      meta: {
        breadcrumb: [
          {
            label: '展会',
            value: null
          }
        ]
      }
    },
    {
      path: 'detail',
      name: 'ActivityDetail',
      component: utils.view('activity/detail'),
      meta: {
        breadcrumb: [
          {
            label: '展会详情',
            value: null
          }
        ],
        parentPath: '/activity/info'
      }
    }
  ]
}
