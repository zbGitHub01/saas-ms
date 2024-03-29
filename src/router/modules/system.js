const systemRouter = [
  {
    path: '/systemSetting',
    name: 'systemSetting',
    component: () => import('@/layout/index.vue'),
    meta: {
      title: '系统设置'
    },
    children: [
      {
        path: '/systemSetting/employeeManage',
        name: 'employeeManage',
        meta: { title: '员工管理', icon: '' },
        component: () => import('@/views/systemSetting/employeeManage/index.vue')
      },
      {
        path: '/systemSetting/authManage',
        name: 'authManage',
        meta: { title: '权限管理', icon: '' },
        component: () => import('@/views/systemSetting/authManage/index.vue')
      },
      {
        path: '/systemSetting/companyInfo',
        name: 'companyInfo',
        meta: { title: '公司信息管理', icon: '' },
        component: () => import('@/views/systemSetting/companyInfo/index.vue')
      }
    ]
  }
]

export default systemRouter
