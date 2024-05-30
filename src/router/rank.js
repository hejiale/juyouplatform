import utils from '../utils'

// 项目看板路由配置
export default {
  path: '/rank',
  component: utils.view('Layout'),
  meta: {
    title: '排行榜'
  },
  children: [
    {
      path: 'manage',
      name: 'rankManage',
      component: utils.view('rank/index'),
      meta: {
        breadcrumb: [
          {
            label: '排行榜',
            value: null
          }
        ]
      }
    }
  ]
}
