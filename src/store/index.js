import { createPinia, defineStore } from 'pinia'
import piniaPersistConfig from '@/utils/piniaPersist'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    userInfo: {
      username: '沃德妈耶',
      avatar: '//asfile.donganzichan.cn/assets/image/20220623/b2a2ae4a3223435aa0cf67304658e188.gif'
    },
    token: '',
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
    outLogin() {}
  },
  persist: piniaPersistConfig('globalStore')
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia
