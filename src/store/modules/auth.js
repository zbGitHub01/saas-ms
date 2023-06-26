import { defineStore } from 'pinia'
import piniaPersistConfig from '@/utils/piniaPersist'
import router from '@/router'
import { filterMenu, filterAuth } from '@/utils/tree'
import permissionData from '../permissionData.json'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isCollapse: false,
    menuList: [],
    authRouter: [],
    authButtons: [],
    tabPageMap: {}
  }),
  getters: {
    menuListGet: state => state.menuList,
    tabPage: state => {
      return state.tabPageMap[router.currentRoute.value.path] || {}
    }
  },
  actions: {
    async setCollapse() {
      this.isCollapse = !this.isCollapse
    },
    async findMenu() {
      const { authRouter, buttonList, tabPageMap } = filterAuth(permissionData)
      this.menuList = filterMenu(permissionData)
      this.authRouter = authRouter
      this.authButtons = buttonList
      this.tabPageMap = tabPageMap
    },
    tabVisible(code) {
      if (this.tabPage.tabs) {
        return this.tabPage.tabs.includes(code)
      } else {
        return true
      }
    }
  },
  persist: piniaPersistConfig('authStore')
})
