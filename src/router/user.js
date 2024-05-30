import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/user',
  component: utils.view('Layout'),
  meta: {
    title: '用户'
  },
  children: [
    {
      path: 'info',
      name: 'UserInfo',
      component: utils.view('user/index'),
      meta: {
        breadcrumb: [
          {
            label: '平台用户',
            value: null
          }
        ]
      }
    }
  ]
}
