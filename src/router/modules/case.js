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
        path: '/caseCirculation/bankManage',
        name: 'bankManage',
        component: () => import('@/views/caseCirculation/bankManage/index.vue'),
        meta: { title: '分库管理', icon: '' },
        children: [
          {
            path: '/caseCirculation/bankManage/caseBank',
            name: 'caseBank',
            component: () => import('@/views/caseCirculation/bankManage/caseBank/index.vue'),
            meta: { title: '案件分库', icon: '' }
          },
          {
            path: '/caseCirculation/bankManage/bankRecord',
            name: 'bankRecord',
            component: () => import('@/views/caseCirculation/bankManage/bankRecord/index.vue'),
            meta: { title: '分库记录', icon: '' }
          },
          {
            path: '/caseCirculation/bankManage/bankRecoverRecord',
            name: 'bankRecoverRecord',
            component: () => import('@/views/caseCirculation/bankManage/bankRecoverRecord/index.vue'),
            meta: { title: '分库收回记录', icon: '' }
          },
          {
            path: '/caseCirculation/bankManage/bankSetName',
            name: 'bankSetName',
            component: () => import('@/views/caseCirculation/bankManage/bankSetName/index.vue'),
            meta: { title: '分库名称设置', icon: '' }
          }
        ]
      },
      {
        path: '/caseCirculation/delegatedCaseManage',
        name: 'delegatedCaseManage',
        component: () => import('@/views/caseCirculation/delegatedCaseManage/index.vue'),
        meta: { title: '委案管理', icon: '' },
        children: [
          {
            path: '/caseCirculation/delegatedCaseManage/caseAssignment',
            name: 'caseAssignment',
            component: () => import('@/views/caseCirculation/delegatedCaseManage/caseAssignment/index.vue'),
            meta: { title: '实时委案', icon: '' }
          },
          {
            path: '/caseCirculation/delegatedCaseManage/caseRecovery',
            name: 'caseRecovery',
            component: () => import('@/views/caseCirculation/delegatedCaseManage/caseRecovery/index.vue'),
            meta: { title: '实时委案收回', icon: '' }
          },
          {
            path: '/caseCirculation/delegatedCaseManage/caseConfiguration',
            name: 'caseConfiguration',
            component: () => import('@/views/caseCirculation/delegatedCaseManage/caseConfiguration/index.vue'),
            meta: { title: '委案类型配置', icon: '' }
          }
        ]
      }
    ]
  }
]

export default caseRouter