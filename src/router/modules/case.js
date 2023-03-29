const caseRouter = [
  {
    path: '/caseManage',
    name: 'caseManage',
    component: () => import('@/layout/index.vue'),
    meta: { title: '案件管理' },
    children: [
      {
        path: '/caseManage/caseImport',
        name: 'caseImport',
        component: () => import('@/views/caseManage/caseImport/index.vue'),
        meta: { title: '数据导入', icon: 'UserFilled' }
      },
      {
        path: '/caseManage/allCases',
        name: 'allCases',
        component: () => import('@/views/caseManage/allCases/index.vue'),
        meta: { title: '全部案件', icon: 'UserFilled' }
      },
      {
        path: '/caseManage/assetEntrust',
        name: 'assetEntrust',
        component: () => import('@/views/caseManage/assetEntrust/index.vue'),
        meta: { title: '资产委托', icon: 'UserFilled' }
      },
      {
        path: '/caseManage/assetDispose',
        name: 'assetDispose',
        component: () => import('@/views/caseManage/assetDispose/index.vue'),
        meta: { title: '资产基础配置', icon: 'UserFilled' }
      }
    ]
  }
]

export default caseRouter