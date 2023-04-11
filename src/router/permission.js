import NProgress from '@/utils/nprogress'
import { HOME_URL, ROUTER_WHITE_LIST } from '@/utils/constant'
// import { useAuthStore } from '@/store/modules/auth'
import { useGlobalStore } from '@/store'
import { AxiosCanceler } from '@/api/helper/axiosCancel'

const axiosCanceler = new AxiosCanceler()

export const onBeforeEach = router => {
  router.beforeEach((to, from, next) => {
    NProgress.start()
    NProgress.done()
    const globalStore = useGlobalStore()
    // * 在跳转路由之前，清除所有的请求
    axiosCanceler.removeAllPending()
    if (globalStore.token && globalStore.tenantId && to.path === '/login') {
      next({ path: '/' })
    }
    if (ROUTER_WHITE_LIST.includes(to.path)) return next()
    if (!globalStore.token || !globalStore.tenantId) {
      next({ path: `/login?redirect=${to.path}` })
      NProgress.done()
      return
    }
    next()
    // const authStore = useAuthStore()
    // const authRouterList = [HOME_URL, ...authStore.authRouter]
    // if (authRouterList.includes(to.path) || to.path.includes('/task/index')) {
    //   return next()
    // } else {
    //   next({ path: '/403' })
    // }
  })
  router.afterEach(() => {
    NProgress.done()
  })
}
