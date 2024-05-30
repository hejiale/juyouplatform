import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/script',
  component: utils.view('Layout'),
  meta: {
    title: '剧本'
  },
  children: [
    {
      path: 'info',
      name: 'ScriptInfo',
      component: utils.view('script/scriptLibrary/index'),
      meta: {
        breadcrumb: [
          {
            label: '剧本库',
            value: null
          }
        ]
      }
    },
    {
      path: 'info/add',
      name: 'scriptInfoAdd',
      component: utils.view('script/scriptLibrary/add'),
      meta: {
        breadcrumb: [
          {
            label: '新增剧本',
            value: null
          }
        ],
        parentPath: '/script/info'
      }
    },
    {
      path: 'info/edit',
      name: 'scriptInfoEdit',
      component: utils.view('script/scriptLibrary/edit'),
      meta: {
        breadcrumb: [
          {
            label: '编辑剧本',
            value: null
          }
        ],
        parentPath: '/script/info'
      }
    },
    {
      path: 'applyDrama',
      name: 'scriptApplyDrama',
      component: utils.view('script/applyDrama/index'),
      meta: {
        breadcrumb: [{
          label: '申领剧本管理',
          value: null
        }]
      }
    },
    {
      path: 'addApply',
      name: 'scriptApplyAdd',
      component: utils.view('script/applyDrama/add'),
      meta: {
        breadcrumb: [{
          label: '创建申领剧本',
          value: null
        }],
        parentPath: '/script/applyDrama'
      }
    },
    {
      path: 'editApply',
      name: 'scriptApplyEdit',
      component: utils.view('script/applyDrama/edit'),
      meta: {
        breadcrumb: [{
          label: '修改申领剧本',
          value: null
        }],
        parentPath: '/script/applyDrama'
      }
    },
    {
      path: 'applyRecord',
      name: 'scriptApplyRecord',
      component: utils.view('script/applyRecord/index'),
      meta: {
        breadcrumb: [{
          label: '剧本授权',
          value: null
        }]
      }
    },
    {
      path: 'applyRecordDetail',
      name: 'scriptApplyRecordDetail',
      component: utils.view('script/applyRecord/detail'),
      meta: {
        breadcrumb: [{
          label: '剧本授权详情',
          value: null
        }],
        parentPath: '/script/applyRecord'
      }
    },
    {
      path: 'hotDrama',
      name: 'scriptHotDrama',
      component: utils.view('script/hotDrama/index'),
      meta: {
        breadcrumb: [{
          label: '热本推荐',
          value: null
        }]
      }
    }
  ]
}
