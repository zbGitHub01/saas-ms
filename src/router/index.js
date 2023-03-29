import { createRouter, createWebHashHistory } from 'vue-router'

//导入所有router
const metaRouters = import.meta.glob('./modules/*.ts', { eager: true })
// * 处理路由表
export const routerArray = []
Object.keys(metaRouters).forEach(item => {
  Object.keys(metaRouters[item]).forEach(key => {
    routerArray.push(...metaRouters[item][key])
  })
})

const routes = [
  {
    path: '/',
    redirect: '/home/index',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: { title: '登录' },
    component: () => import('@/views/login/index.vue')
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
    path: '/projectList',
    component: () => import('@/layout/index.vue'),
    redirect: '/projectList/index',
    children: [
      {
        path: 'index',
        name: 'projectList',
        component: () => import('@/views/projectList/index.vue'),
        meta: { keepAlive: true, title: '项目列表', icon: 'List' }
      }
    ]
  },
  {
    path: '/systemSetting/companyInfo',
    component: () => import('@/layout/index.vue'),
    redirect: '/systemSetting/companyInfo/index',
    children: [
      {
        path: 'index',
        name: 'companyInfo',
        component: () => import('@/views/systemSetting/companyInfo/index.vue'),
        meta: { keepAlive: true, title: '公司信息管理' }
      }
    ]
  },
  {
    path: '/microApp/order',
    name: 'order',
    meta: { title: '工单管理', icon: 'Setting' },
    component: () => import('@/layout/index.vue')
  },
  {
    path: '/bushManage',
    name: 'bushManage',
    meta: { title: '业务管理', icon: 'Setting' },
    children: [
      {
        path: '/microApp/bushManage/waiverApprox',
        name: 'WaiverApprox',
        meta: { title: '减免审批', keepAlive: true },
        component: () => import('@/layout/index.vue')
      },
      {
        path: '/microApp/bushManage/settlementCertify',
        name: 'SettlementCertify',
        meta: { title: '结清证明', keepAlive: true },
        component: () => import('@/layout/index.vue')
      },
      {
        path: '/microApp/bushManage/basicConfigure',
        name: 'BasicConfigure',
        meta: { title: '业务基础配置', keepAlive: true },
        component: import('@/layout/index.vue')
      }
    ]
  },
  ...routerArray
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router
