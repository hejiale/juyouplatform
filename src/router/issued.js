import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/issued',
  component: utils.view('Layout'),
  meta: {
    title: '发行'
  },
  children: [
    {
      path: 'info',
      name: 'issuedInfo',
      component: utils.view('issued/index'),
      meta: {
        breadcrumb: [
          {
            label: '发行管理',
            value: null
          }
        ]
      }
    },
    {
      path: 'info/add',
      name: 'issuedInfoAdd',
      component: utils.view('issued/add'),
      meta: {
        breadcrumb: [
          {
            label: '添加发行',
            value: null
          }
        ],
        parentPath: '/issued/info'
      }
    },
    {
      path: 'info/details',
      name: 'issuedInfoDetails',
      component: utils.view('issued/details'),
      meta: {
        breadcrumb: [
          {
            label: '发行详情',
            value: null
          }
        ],
        parentPath: '/issued/info'
      }
    },
    {
      path: 'audit',
      name: 'issuedAudit',
      component: utils.view('issued/audit'),
      meta: {
        breadcrumb: [
          {
            label: '发行审核',
            value: null
          }
        ]
      }
    },
    {
      path: 'audit/auditDetail',
      name: 'issuedAuditDetail',
      component: utils.view('issued/auditDetail'),
      meta: {
        breadcrumb: [
          {
            label: '发行审核详情',
            value: null
          }
        ],
        parentPath: 'issued/audit'
      }
    }
  ]
}
