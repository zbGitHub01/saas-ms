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
        meta: { title: '数据导入', icon: '' }
      },
      {
        path: '/caseManage/allCases',
        name: 'allCases',
        component: () => import('@/views/caseManage/allCases/index.vue'),
        meta: { title: '全部案件', icon: '' }
      },
      {
        path: '/caseManage/assetEntrust',
        name: 'assetEntrust',
        component: () => import('@/views/caseManage/assetEntrust/index.vue'),
        meta: { title: '资产委托', icon: '' }
      },
      {
        path: '/caseManage/assetDispose',
        name: 'assetDispose',
        component: () => import('@/views/caseManage/assetDispose/index.vue'),
        meta: { title: '资产基础配置', icon: '' }
      },
      {
        path: '/caseManage/casesDetails',
        name: 'casesDetails',
        hidden: true,
        meta: { title: '可管理案件', icon: '' },
        children: [
          {
            path: '/caseManage/casesDetails/casesManageable',
            name: 'casesManageable',
            component: () => import('@/views/caseManage/caseDetails/casesManageable/index.vue'),
            meta: { title: '可管理案件', icon: '' }
          },
          {
            path: '/caseManage/casesDetails/casesEntrusted',
            name: 'casesEntrusted',
            component: () => import('@/views/caseManage/caseDetails/casesEntrusted/index.vue'),
            meta: { title: '受委托案件', icon: '' }
          }
        ]
      }
    ]
  },
  {
    path: '/externalCase',
    name: 'externalCase',
    component: () => import('@/layout/index.vue'),
    meta: { title: '外部案件管理' },
    children: [
      {
        path: '/externalCase/externalCaseImport',
        name: 'externalCaseImport',
        component: () => import('@/views/externalCase/externalCaseImport/index.vue'),
        meta: { title: '外部案件导入', icon: '' }
      },
      {
        path: '/externalCase/externalCaseManage',
        name: 'externalCaseManage',
        component: () => import('@/views/externalCase/externalCaseManage/index.vue'),
        meta: { title: '外部案件管理', icon: '' }
      },
      {
        path: '/externalCase/externalCaseAssignment',
        name: 'externalCaseAssignment',
        component: () => import('@/views/externalCase/externalCaseAssignment/index.vue'),
        meta: { title: '外部案件委派', icon: '' }
      },
      {
        path: '/externalCase/externalCaseRecovery',
        name: 'externalCaseRecovery',
        component: () => import('@/views/externalCase/externalCaseRecovery/index.vue'),
        meta: { title: '外部案件收回', icon: '' }
      },
      {
        path: '/externalCase/externalAssetDispose',
        name: 'externalAssetDispose',
        component: () => import('@/views/externalCase/externalAssetDispose/index.vue'),
        meta: { title: '外部资产基础配置', icon: '' }
      },
      {
        path: '/externalCase/collectionRegister',
        name: 'collectionRegister',
        component: () => import('@/views/externalCase/collectionRegister/index.vue'),
        meta: { title: '回款登记', icon: '' }
      },
      {
        path: '/externalCase/collectionRegisterDetail',
        name: 'collectionRegisterDetail',
        component: () => import('@/views/externalCase/collectionRegisterDetail/index.vue'),
        meta: { title: '回款登记明细', icon: '' }
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
            path: '/caseCirculation/delegatedCaseManage/preCase',
            name: 'preCase',
            component: () => import('@/views/caseCirculation/delegatedCaseManage/preCase/index.vue'),
            meta: { title: '预委案', icon: '' }
          },
          {
            path: '/caseCirculation/delegatedCaseManage/caseRecord',
            name: 'caseRecord',
            component: () => import('@/views/caseCirculation/delegatedCaseManage/caseRecord/index.vue'),
            meta: { title: '委案记录', icon: '' }
          },
          {
            path: '/caseCirculation/delegatedCaseManage/caseRecovery',
            name: 'caseRecovery',
            component: () => import('@/views/caseCirculation/delegatedCaseManage/caseRecovery/index.vue'),
            meta: { title: '实时委案收回', icon: '' }
          },
          {
            path: '/caseCirculation/delegatedCaseManage/caseAheadRecovery',
            name: 'caseAheadRecovery',
            component: () => import('@/views/caseCirculation/delegatedCaseManage/caseAheadRecovery/index.vue'),
            meta: { title: '委案预收回', icon: '' }
          },
          {
            path: '/caseCirculation/delegatedCaseManage/caseRecovered',
            name: 'caseRecovered',
            component: () => import('@/views/caseCirculation/delegatedCaseManage/caseRecovered/index.vue'),
            meta: { title: '委案收回记录', icon: '' }
          },
          {
            path: '/caseCirculation/delegatedCaseManage/caseConfiguration',
            name: 'caseConfiguration',
            component: () => import('@/views/caseCirculation/delegatedCaseManage/caseConfiguration/index.vue'),
            meta: { title: '委案类型配置', icon: '' }
          }
        ]
      },
      {
        path: '/caseCirculation/divisionManage',
        name: 'divisionManage',
        meta: { title: '分案管理', icon: '' },
        children: [
          {
            path: '/caseCirculation/divisionManage/realtimeDivision',
            name: 'realtimeDivision',
            component: () => import('@/views/caseCirculation/divisionManage/realtimeDivision/index.vue'),
            meta: { title: '实时分案', icon: '' }
          },
          {
            path: '/caseCirculation/divisionManage/caseGather',
            name: 'caseGather',
            component: () => import('@/views/caseCirculation/divisionManage/caseGather/index.vue'),
            meta: { title: '分案汇总', icon: '' }
          },
          {
            path: '/caseCirculation/divisionManage/realtimeDivisionRecovery',
            name: 'realtimeDivisionRecovery',
            component: () => import('@/views/caseCirculation/divisionManage/realtimeDivisionRecovery/index.vue'),
            meta: { title: '实时分案收回', icon: '' }
          },
          {
            path: '/caseCirculation/divisionManage/divisionRecovered',
            name: 'divisionRecovered',
            component: () => import('@/views/caseCirculation/divisionManage/divisionRecovered/index.vue'),
            meta: { title: '分案收回记录', icon: '' }
          },
          {
            path: '/caseCirculation/divisionManage/divisionStrategy',
            name: 'divisionStrategy',
            component: () => import('@/views/caseCirculation/divisionManage/divisionStrategy/index.vue'),
            meta: { title: '机构策略分案', icon: '' },
            children: [
              {
                path: '/caseCirculation/divisionManage/divisionStrategy/divisionRealStrategy',
                name: 'divisionRealStrategy',
                component: () => import('@/views/caseCirculation/divisionManage/divisionStrategy/divisionRealStrategy/index.vue'),
                meta: { title: '策略实时分案', icon: '' },
                hidden: true
              },
              {
                path: '/caseCirculation/divisionManage/divisionStrategy/divisionSituation',
                name: 'divisionSituation',
                component: () => import('@/views/caseCirculation/divisionManage/divisionStrategy/divisionSituation/index.vue'),
                meta: { title: 'CPE持案情况', icon: '' },
                hidden: true
              }
            ]
          }
        ]
      }
    ]
  }
]

export default caseRouter
