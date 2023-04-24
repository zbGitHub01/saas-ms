import { defineStore } from 'pinia'
import piniaPersistConfig from '@/utils/piniaPersist'
import { filterMenu } from '@/utils/tree'
import menuData from '../menu.json'
import permissionData from '../permissionData.json'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isCollapse: false,
    menuList: [],
    authRouter: []
  }),
  getters: {
    menuListGet: state => state.menuList
  },
  actions: {
    async setCollapse() {
      this.isCollapse = !this.isCollapse
    },
    async findMenu() {
      this.menuList = filterMenu(permissionData)
      console.log(this.menuList, '----menuList')
    }
  },
  persist: piniaPersistConfig('authStore')
})
