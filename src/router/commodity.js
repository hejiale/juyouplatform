import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/commodity',
  component: utils.view('Layout'),
  meta: {
    title: '商品中心'
  },
  children: [
    {
      path: 'manage',
      name: 'CommodityMagt',
      component: utils.view('commodity/manage/index'),
      meta: {
        breadcrumb: [
          {
            label: '商品管理',
            value: null
          }
        ]
      }
    },
    {
      path: 'manage/add',
      name: 'CommodityMagtAdd',
      component: utils.view('commodity/manage/add'),
      meta: {
        breadcrumb: [
          {
            label: '新增商品',
            value: null
          }
        ],
        parentPath: '/commodity/manage'
      }
    },
    {
      path: 'manage/edit',
      name: 'CommodityMagtEdit',
      component: utils.view('commodity/manage/edit'),
      meta: {
        breadcrumb: [
          {
            label: '编辑商品',
            value: null
          }
        ],
        parentPath: '/commodity/manage'
      }
    }
  ]
}
