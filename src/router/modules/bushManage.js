const bushManageRouter = [
  {
    path: '/bushManage',
    name: 'bushManage',
    component: () => import('@/layout/index.vue'),
    meta: { title: '业务管理', icon: 'Setting' },
    children: [
      {
        path: '/bushManage/waiverApprox',
        name: 'WaiverApprox',
        meta: { title: '减免审批', keepAlive: true },
        component: () => import('@/views/bushManage/waiverApprox/index.vue')
      },
      {
        path: '/bushManage/settlementCertify',
        name: 'SettlementCertify',
        meta: { title: '结清证明', keepAlive: true },
        component: () => import('@/views/bushManage/settlementCertify/index.vue')
      },
      {
        path: '/bushManage/basicConfigure',
        name: 'BasicConfigure',
        meta: { title: '业务基础配置', keepAlive: true },
        component: () => import('@/views/bushManage/basicConfigure/index.vue')
      }
    ]
  }
]
export default bushManageRouter
