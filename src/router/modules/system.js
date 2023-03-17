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
        children: [
          {
            path: '/systemSetting/employee/info',
            name: 'employeeInfo',
            component: () => import('@/views/systemSetting/business/businessInfo/index.vue'),
            meta: { title: '员工信息', icon: 'Menu' }
          },
          {
            path: '/systemSetting/employee/department',
            name: 'department',
            component: () => import('@/views/systemSetting/business/departmentSetting/index.vue'),
            meta: { title: '部门设置', keepAlive: true, icon: 'Menu' }
          }
        ]
      }
    ]
  }
]

export default systemRouter
