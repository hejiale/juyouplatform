import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/shop',
  component: utils.view('Layout'),
  meta: {
    title: '店铺'
  },
  children: [
    {
      path: 'info',
      name: 'shopInfo',
      component: utils.view('shop/index'),
      meta: {
        breadcrumb: [
          {
            label: '店铺库',
            value: null
          }
        ]
      }
    },
    {
      path: 'info/add',
      name: 'shopInfoAdd',
      component: utils.view('shop/add'),
      meta: {
        breadcrumb: [
          {
            label: '添加店家',
            value: null
          }
        ],
        parentPath: '/shop/info'
      }
    },
    {
      path: 'info/details',
      name: 'shopInfoDetails',
      component: utils.view('shop/details'),
      meta: {
        breadcrumb: [
          {
            label: '店铺详情',
            value: null
          }
        ],
        parentPath: '/shop/info'
      }
    },
    {
      path: 'audit',
      name: 'shopAudit',
      component: utils.view('shop/audit/index'),
      meta: {
        breadcrumb: [
          {
            label: '店铺审核',
            value: null
          }
        ]
      }
    },
    {
      path: 'audit/detail',
      name: 'shopAuditDetail',
      component: utils.view('shop/audit/detail'),
      meta: {
        breadcrumb: [
          {
            label: '店铺审核详情',
            value: null
          }
        ],
        parentPath: '/shop/audit'
      }
    }
  ]
}
