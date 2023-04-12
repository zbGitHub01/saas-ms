import { createPinia, defineStore } from 'pinia'
import piniaPersistConfig from '@/utils/piniaPersist'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { stringify } from 'qs'
import Apis, { chooseTenant } from '@/api/modules/user'
import router from '@/router'

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    userInfo: {
      username: '沃德妈耶',
      avatar: '//asfile.donganzichan.cn/assets/image/20220623/b2a2ae4a3223435aa0cf67304658e188.gif'
    },
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
      const data = await loginApiFn(stringify(params), { headers }).catch(() => {})
      if (data) {
        this.token = `Bearer ${data.access_token}`
        this.refreshToken = data.refresh_token
      }
      return data
    },
    async chooseTenant(tenantId) {
      const { code, data } = await chooseTenant(tenantId)
      if (code === 200) {
        this.tenantId = data.tenantId
      }
      return code === 200
    },
    logout(isLogout = false) {
      localStorage.clear()
      this.token = ''
      this.refreshToken = ''
      this.tenantId = ''
      console.log(router.currentRoute.value.fullPath)
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
