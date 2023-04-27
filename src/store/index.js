import { createPinia, defineStore } from 'pinia'
import piniaPersistConfig from '@/utils/piniaPersist'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { stringify } from 'qs'
import Apis, { chooseTenant } from '@/api/modules/user'
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
    maximize: false // 内容最大化
  }),
  actions: {
    setAssemblySizeSize(assemblySize) {
      this.assemblySize = assemblySize
    },
    setMaximize(isMax) {
      this.maximize = isMax
    },
    async login(params) {
      const headers = {
        Authorization: `Basic ${btoa('dongan:dongan')}`
      }
      const loginApiFn = params.grant_type === 'password' ? Apis.userLogin : Apis.mobileLogin
      const data = await loginApiFn(stringify(params), { headers })
      if (data && data.access_token) {
        this.token = `Bearer ${data.access_token}`
        this.refreshToken = data.refresh_token
        return data
      } else {
        return null
      }
    },
    async fetchUserInfo() {
      const { code, data } = await Apis.findUserInfo()
      if (code === 200) {
        this.userInfo = data
      }
    },
    async fetchTenantList() {
      const { code, data } = await Apis.findTenantList()
      if (code === 200 && data.length) {
        this.tenantList = data
        return data
      } else {
        return []
      }
    },
    async chooseTenant(tenantId) {
      const { code, data } = await chooseTenant(tenantId)
      if (code === 200) {
        this.tenantId = data.tenantId
        this.tenantInfo = data
        return data
      } else {
        return null
      }
    },
    async acceptInvite(userCode) {
      const { code, data } = await Apis.acceptInvite({ code: userCode })
      if (code === 200) {
        this.tenantId = data.tenantId
        return data
      } else {
        return null
      }
    },
    async logout(isLogout = false) {
      if (isLogout) {
        await Apis.logout()
      }
      localStorage.clear()
      this.token = ''
      this.refreshToken = ''
      this.tenantId = ''
      const path = isLogout ? '/login' : `/login?redirect=${router.currentRoute.value.fullPath}`
      router.push({ path })
      return true
    }
  },
  persist: piniaPersistConfig('globalStore')
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
