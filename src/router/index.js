import { createRouter, createWebHashHistory } from 'vue-router'

//导入所有router
const metaRouters = import.meta.glob('./modules/*.js', { eager: true })
// * 处理路由表
export const routerArray = []
Object.keys(metaRouters).forEach(item => {
  Object.keys(metaRouters[item]).forEach(key => {
    routerArray.push(...metaRouters[item][key])
  })
})
console.log(routerArray)
const routes = [
  {
    path: '/',
    redirect: '/home/index'
  },
  {
    path: '/home',
    component: () => import('@/layout/index.vue'),
    redirect: '/home/index',
    children: [
      {
        path: 'index',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { keepAlive: true, title: '首页' }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () => import('@/views/login/index.vue')
  },
  ...routerArray,
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/errorPage/403.vue'),
    meta: { title: '403' }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404.vue'),
    meta: { title: '404' }
  },
  {
    path: '/500',
    name: '500',
    component: () => import('@/views/errorPage/500.vue'),
    meta: { title: '500' }
  },
  {
    path: '/:pathMatch(.*)',
    redirect: { name: '404' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router
