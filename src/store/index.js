import { createPinia, defineStore } from 'pinia'
import piniaPersistConfig from '@/utils/piniaPersist'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Apis, { chooseTenant, mobileLogin, userLogin } from '@/api/modules/user'
import router from '@/router'

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    userInfo: {},
    tenantInfo: {},
    tenantList: [],
    token: '',
    refreshToken: '',
    tenantId: '',
    assemblySize: 'default', // element组件大小
    maximize: false, // 内容最大化
    socketToken: null
  }),
  actions: {
    setAssemblySizeSize(assemblySize) {
      this.assemblySize = assemblySize
    },
    setMaximize(isMax) {
      this.maximize = isMax
    },
    setSocketToken(token = null) {
      this.socketToken = token
    },
    async login(params) {
      const headers = {
        Authorization: `Basic ${btoa('dongan:dongan')}`
      }
      const loginApiFn = params.grant_type === 'password' ? userLogin : mobileLogin
      const data = await loginApiFn(params, { headers }).catch(() => {})
      if (data && data.access_token) {
        this.token = `Bearer ${data.access_token}`
        this.refreshToken = data.refresh_token
        return data
      } else {
        return null
      }
    },
    async fetchUserInfo() {
      const { data } = await Apis.findUserInfo()
      this.userInfo = data
    },
    async fetchTenantList() {
      const { data } = await Apis.findTenantList()
      if (data.length) {
        this.tenantList = data
        return data
      } else {
        return []
      }
    },
    async chooseTenant(tenantId) {
      try {
        const { data } = await chooseTenant(tenantId)
        this.tenantId = data.tenantId
        this.tenantInfo = data
        return data
      } catch (err) {
        return null
      }
    },
    async acceptInvite(userCode) {
      try {
        const { data } = await Apis.acceptInvite({ code: userCode })
        this.tenantId = data.tenantId
        return data
      } catch (err) {
        return null
      }
    },
    async logout(isLogout = false) {
      if (isLogout) {
        await Apis.logout().catch(() => {})
      }
      localStorage.clear()
      this.token = ''
      this.refreshToken = ''
      this.tenantId = ''
      this.socketToken = null
      const path = isLogout ? '/login' : `/login?redirect=${router.currentRoute.value.fullPath}`
      await router.push({ path })
      return true
    }
  },
  persist: piniaPersistConfig('globalStore')
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
