import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/system',
  component: utils.view('Layout'),
  children: [
    {
      path: 'role',
      name: 'systemRole',
      component: utils.view('system/role/index'),
      meta: {
        breadcrumb: [
          {
            label: '角色权限',
            value: null
          }
        ]
      }
    },
    {
      path: 'systemRoleAuthorize',
      name: 'systemRoleAuthorize',
      component: utils.view('system/role/authorize'),
      meta: {
        breadcrumb: [
          {
            label: '用户授权',
            value: null
          }
        ],
        parentPath: '/system/role'
      }
    },
    {
      path: 'user',
      name: 'systemUser',
      component: utils.view('system/user/index'),
      meta: {
        breadcrumb: [
          {
            label: '账号管理',
            value: null
          }
        ]
      }
    },
    {
      path: 'svn',
      name: 'svn',
      component: utils.view('system/svn/index'),
      meta: {
        breadcrumb: [
          {
            label: '后台版本管理',
            value: null
          }
        ]
      }
    },
    {
      path: 'menu',
      name: 'menu',
      component: utils.view('system/menu/index'),
      meta: {
        breadcrumb: [
          {
            label: '菜单权限',
            value: null
          }
        ]
      }
    },
    {
      path: 'dictionary',
      name: 'dictionary',
      component: utils.view('system/dictionary/index'),
      meta: {
        breadcrumb: [
          {
            label: '字典管理',
            value: null
          }
        ]
      }
    },
    {
      path: 'storePermission',
      name: 'storePermission',
      component: utils.view('system/storePermission/index'),
      meta: {
        breadcrumb: [
          {
            label: '店铺权限',
            value: null
          }
        ]
      }
    },
    {
      path: 'storeMenuPermission',
      name: 'storeMenuPermission',
      component: utils.view('system/storeMenuPermission/index'),
      meta: {
        breadcrumb: [
          {
            label: '店铺菜单权限',
            value: null
          }
        ]
      }
    },
    {
      path: 'svgManage',
      name: 'svgManage',
      component: utils.view('system/svgManage/index'),
      meta: {
        breadcrumb: [
          {
            label: '图标管理',
            value: null
          }
        ]
      }
    }
  ]
}
