import utils from '../utils'

export default {
    path: '/merchant',
    component: utils.view('Layout'),
    meta: {
        title: '商户管理'
    },
    children: [{
            path: 'management',
            name: 'Merchant',
            component: utils.view('merchant/management/index'),
            meta: {
                breadcrumb: [{
                    label: '商户管理',
                    value: null
                }]
            }
        },{
            path: 'audit',
            name: 'MerchantAudit',
            component: utils.view('merchant/audit/index'),
            meta: {
                breadcrumb: [{
                        label: '商户审核',
                        value: null
                }],
            }
        },
        {
            path: 'auditDetail',
            name: 'MerchantAuditDetail',
            component: utils.view('merchant/audit/detail'),
            meta: {
                breadcrumb: [{
                        label: '审核详情',
                        value: null
                }],
                parentPath: '/merchant/audit'
            }
        },
        {
            path: 'businessAuditDetail',
            name: 'businessAuditDetail',
            component: utils.view('merchant/audit/business'),
            meta: {
                breadcrumb: [{
                        label: '审核详情',
                        value: null
                }],
                parentPath: '/merchant/audit'
            }
        },
        {
            path: 'managementDetail',
            name: 'MerchantManagementDetail',
            component: utils.view('merchant/management/detail'),
            meta: {
                    breadcrumb: [{
                            label: '管理详情',
                            value: null
                    }],
                    parentPath: '/merchant/management'
            }
        },
    ]
}