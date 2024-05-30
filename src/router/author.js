import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/author',
  component: utils.view('Layout'),
  meta: {
    title: '作者'
  },
  children: [
    {
      path: 'info',
      name: 'AuthorInfo',
      component: utils.view('author/index'),
      meta: {
        breadcrumb: [
          {
            label: '作者库',
            value: null
          }
        ]
      }
    },
    {
      path: 'info/add',
      name: 'AuthorInfoAdd',
      component: utils.view('author/add'),
      meta: {
        breadcrumb: [
          {
            label: '添加作者',
            value: null
          }
        ],
        parentPath: '/author/info'
      }
    },
    {
      path: 'info/edit',
      name: 'AuthorInfoEdit',
      component: utils.view('author/edit'),
      meta: {
        breadcrumb: [
          {
            label: '编辑作者',
            value: null
          }
        ],
        parentPath: '/author/info'
      }
    }
  ]
}
