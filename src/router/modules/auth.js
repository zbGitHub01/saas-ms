const authRouter = [
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/layout/index.vue'),
    meta: { title: '权限设置' },
    children: [
      {
        path: '/auth/menu',
        name: 'menu',
        meta: { title: '菜单管理', icon: 'UserFilled' },
        component: () => import('@/views/auth/menu/index.vue')
      },
      {
        path: '/auth/button',
        name: 'button',
        meta: { title: '按钮管理', icon: 'UserFilled' },
        component: () => import('@/views/auth/button/index.vue')
      }
    ]
  }
]

export default authRouter
