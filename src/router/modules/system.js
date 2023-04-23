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
        path: '/systemSetting/employee',
        name: 'employee',
        meta: { title: '员工管理', icon: 'UserFilled' },
        component: () => import('@/views/systemSetting/employee/index.vue')
      },
      {
        path: '/systemSetting/authManage',
        name: 'authManage',
        meta: { title: '权限管理', icon: 'UserFilled' },
        component: () => import('@/views/systemSetting/authManage/index.vue')
      }
    ]
  }
]

export default systemRouter
