import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/order',
  component: utils.view('Layout'),
  meta: {
    title: '订单中心'
  },
  children: [
    {
      path: 'manage',
      name: 'OrderManage',
      component: utils.view('order/manage/index'),
      meta: {
        breadcrumb: [
          {
            label: '订单管理',
            value: null
          }
        ]
      }
    },
    {
      path: 'gather',
      name: 'gatherManage',
      component: utils.view('order/gather/index'),
      meta: {
        breadcrumb: [
          {
            label: '组局记录',
            value: null
          }
        ]
      }
    }
  ]
}
