import utils from '../utils'

// 项目看板路由配置
export default {
    path: '/banner',
    component: utils.view('Layout'),
    meta: {
        title: 'banner图管理'
    },
    children: [
        {
            path: 'headerBanner',
            name: 'headerBanner',
            component: utils.view('banner/headerBanner'),
            meta: {
                breadcrumb: [
                    {
                        label: '首页头部banner管理',
                        value: null
                    }
                ]
            }
        },
        {
            path: 'backgroundBanner',
            name: 'backgroundBanner',
            component: utils.view('banner/backgroundBanner'),
            meta: {
                breadcrumb: [
                    {
                        label: '首页背景banner管理',
                        value: null
                    }
                ]
            }
        },
        {
            path: 'activityBanner',
            name: 'activityBanner',
            component: utils.view('banner/activityBanner'),
            meta: {
                breadcrumb: [
                    {
                        label: '首页剧圈动态banner管理',
                        value: null
                    }
                ]
            }
        }
    ]
}
