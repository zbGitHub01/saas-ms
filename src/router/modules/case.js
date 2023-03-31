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
  },
  {
    path: '/caseCirculation',
    name: 'caseCirculation',
    component: () => import('@/layout/index.vue'),
    meta: { title: '案件流转' },
    children: [
      {
        path: '/caseCirculation/caseBank',
        name: 'caseBank',
        component: () => import('@/views/caseCirculation/caseBank/index.vue'),
        meta: { title: '案件分库', icon: 'UserFilled' }
      },
      {
        path: '/caseCirculation/caseAssignment',
        name: 'caseAssignment',
        component: () => import('@/views/caseCirculation/caseAssignment/index.vue'),
        meta: { title: '案件委派', icon: 'UserFilled' }
      },
      {
        path: '/caseCirculation/caseRecovery',
        name: 'caseRecovery',
        component: () => import('@/views/caseCirculation/caseRecovery/index.vue'),
        meta: { title: '案件回收', icon: 'UserFilled' }
      },
      {
        path: '/caseCirculation/caseConfiguration',
        name: 'caseConfiguration',
        component: () => import('@/views/caseCirculation/caseConfiguration/index.vue'),
        meta: { title: '案件流转配置', icon: 'UserFilled' }
      }
    ]
  }
]

export default caseRouter