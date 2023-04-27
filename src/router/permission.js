import NProgress from '@/utils/nprogress'
import { HOME_URL, ROUTER_WHITE_LIST } from '@/utils/constant'
// import { useAuthStore } from '@/store/modules/auth'
import { useGlobalStore } from '@/store'
import { useAuthStore } from '@/store/modules/auth'
import { AxiosCanceler } from '@/api/helper/axiosCancel'

const axiosCanceler = new AxiosCanceler()

export const onBeforeEach = router => {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()
    NProgress.done()
    const globalStore = useGlobalStore()
    // * 在跳转路由之前，清除所有的请求
    axiosCanceler.removeAllPending()
    // 是否可以进入登录页
    if (globalStore.token && globalStore.tenantId && to.path === '/login') {
      return next(from.fullPath)
    }
    // 路由白名单
    if (ROUTER_WHITE_LIST.includes(to.path)) return next()
    // 没有登录
    if (!globalStore.token || !globalStore.tenantId) {
      next({ path: `/login?redirect=${to.path}` })
      NProgress.done()
      return
    }
    // 路由权限
    const authStore = useAuthStore()
    if (!authStore.menuListGet.length) {
      await authStore.findMenu()
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
