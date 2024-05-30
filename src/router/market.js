import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/market',
  component: utils.view('Layout'),
  meta: {
    title: '营销'
  },
  children: [
    {
      path: 'cardCenter',
      name: 'cardCenter',
      component: utils.view('market/cardCenter/index'),
      meta: {
        breadcrumb: [
          {
            label: '优惠券',
            value: null
          }
        ]
      }
    },
    {
      path: 'addCard',
      name: 'addCard',
      component: utils.view('market/cardCenter/add'),
      meta: {
        breadcrumb: [
          {
            label: '优惠券新增',
            value: null
          }
        ],
        parentPath: '/market/cardCenter'
      }
    },
    {
      path: 'detailCard',
      name: 'detailCard',
      component: utils.view('market/cardCenter/detail'),
      meta: {
        breadcrumb: [
          {
            label: '优惠券详情',
            value: null
          }
        ],
        parentPath: '/market/cardCenter'
      }
    },
    {
      path: 'marketTool',
      name: 'marketTool',
      component: utils.view('market/marketTool/index'),
      meta: {
        breadcrumb: [
          {
            label: '营销活动',
            value: null
          }
        ]
      }
    },
    {
      path: 'marketToolInfo',
      name: 'marketToolInfo',
      component: utils.view('market/marketTool/info'),
      meta: {
        breadcrumb: [
          {
            label: '手动发券',
            value: null
          }
        ],
        parentPath: '/market/marketTool'
      }
    },
    {
      path: 'addMarketTool',
      name: 'addMarketTool',
      component: utils.view('market/marketTool/add'),
      meta: {
        breadcrumb: [
          {
            label: '创建手动发券',
            value: null
          }
        ],
        parentPath: '/market/marketTool'
      }
    },
    {
      path: 'marketToolInfoAuto',
      name: 'marketToolInfoAuto',
      component: utils.view('market/marketTool/auto'),
      meta: {
        breadcrumb: [
          {
            label: '自动发券',
            value: null
          }
        ],
        parentPath: '/market/marketTool'
      }
    },
    {
      path: 'addMarketToolAuto',
      name: 'addMarketToolAuto',
      component: utils.view('market/marketTool/addAuto'),
      meta: {
        breadcrumb: [
          {
            label: '创建自动发券',
            value: null
          }
        ],
        parentPath: '/market/marketTool'
      }
    },
    {
      path: 'editMarketToolAuto',
      name: 'editMarketToolAuto',
      component: utils.view('market/marketTool/editAuto'),
      meta: {
        breadcrumb: [
          {
            label: '编辑自动发券',
            value: null
          }
        ],
        parentPath: '/market/marketTool'
      }
    },
    {
      path: 'record',
      name: 'record',
      component: utils.view('market/record/index'),
      meta: {
        breadcrumb: [
          {
            label: '发放记录',
            value: null
          }
        ]
      }
    }
  ]
}
