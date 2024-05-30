import utils from '../utils'

// 项目看板路由配置
export default {
    path: '/lovePotion',
    component: utils.view('Layout'),
    meta: {
        title: 'lovePotion'
    },
    children: [
        {
            path: 'lpBanner',
            name: 'lpBanner',
            component: utils.view('lovePotion/lpBanner'),
            meta: {
                breadcrumb: [
                    {
                        label: 'Lp轮播图',
                        value: null
                    }
                ]
            }
        },
        {
            path: 'lpCustomer',
            name: 'lpCustomer',
            component: utils.view('lovePotion/lpCustomer'),
            meta: {
                breadcrumb: [
                    {
                        label: 'Lp客服',
                        value: null
                    }
                ]
            }
        },
        {
            path: 'lpMembershipPackage',
            name: 'lpMembershipPackage',
            component: utils.view('lovePotion/lpMembershipPackage'),
            meta: {
                breadcrumb: [
                    {
                        label: 'Lp会员套餐',
                        value: null
                    }
                ]
            }
        },
        {
            path: 'LpUserMessage',
            name: 'LpUserMessage',
            component: utils.view('lovePotion/lpUserMessage'),
            meta: {
                breadcrumb: [
                    {
                        label: 'Lp会员管理',
                        value: null
                    }
                ]
            }
        },
        {
            path: 'LpUserMessageDetail',
            name: 'LpUserMessageDetail',
            component: utils.view('lovePotion/lpUserMessageDetail'),
            meta: {
                breadcrumb: [
                    {
                        label: 'Lp会员管理详情',
                        value: null
                    }
                ],
                parentPath: '/lovePotion/LpUserMessage',
            },

        },
        {
            path: 'LpActivity',
            name: 'LpActivity',
            component: utils.view('lovePotion/activity/index'),
            meta: {
                breadcrumb: [
                    {
                        label: '活动管理',
                        value: null
                    }
                ]
            },
        },
        {
            path: 'LpAuthAvatar',
            name: 'LpAuthAvatar',
            component: utils.view('lovePotion/authAvatar'),
            meta: {
                breadcrumb: [
                    {
                        label: '头像审核',
                        value: null
                    }
                ]
            },
        },
        {
            path: 'LpActivity/add',
            name: 'LpActivityAdd',
            component: utils.view('lovePotion/activity/add'),
            meta: {
                breadcrumb: [
                    {
                        label: '新增LP活动',
                        value: null
                    }
                ],
                parentPath: '/lovePotion/LpActivity',
            },
        },
        {
            path: 'LpActivity/update',
            name: 'LpActivityUpdate',
            component: utils.view('lovePotion/activity/update'),
            meta: {
                breadcrumb: [
                    {
                        label: '修改LP活动',
                        value: null
                    }
                ],
                parentPath: '/lovePotion/LpActivity',
            },
        },
        {
            path: 'LpActivity/user',
            name: 'LpActivityUser',
            component: utils.view('lovePotion/activity/activityUser'),
            meta: {
                breadcrumb: [
                    {
                        label: 'LP活动用户列表',
                        value: null
                    }
                ],
                parentPath: '/lovePotion/LpActivity',
            },
        }
    ]
}