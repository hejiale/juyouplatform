import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/deliver',
  component: utils.view('Layout'),
  meta: {
    title: '发货'
  },
  children: [
    {
      path: 'manage',
      name: 'deliverManage',
      component: utils.view('deliver/index'),
      meta: {
        breadcrumb: [
          {
            label: '发货管理',
            value: null
          }
        ]
      }
    }
  ]
}
