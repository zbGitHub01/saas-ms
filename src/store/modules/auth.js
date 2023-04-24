import { defineStore } from 'pinia'
import piniaPersistConfig from '@/utils/piniaPersist'
import menuData from '../menu.json'

export const filterMenu = (routes, isAll = false) => {
  if (routes.length === 0) return []
  let menuList = []
  const deepCloneRoutes = JSON.parse(JSON.stringify(routes))
  deepCloneRoutes.map((el, index) => {
    if (isAll) {
      el.permissionType.type === 1 && (menuList[index] = el)
      el.permissionType.type === 1 &&
        el.children &&
        el.children.length &&
        (menuList[index].children = filterMenu(el.children, isAll).filter(item => item))
    } else {
      el.permissionType.type === 1 && !el.hide && menuList.push(el)
      el.permissionType.type === 1 &&
        !el.hide &&
        el.children &&
        el.children.length &&
        (menuList[menuList.length - 1].children = filterMenu(el.children, isAll))
    }
  })
  return menuList
}
export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isCollapse: false,
    menuList: filterMenu(menuData)
  }),
  actions: {
    async setCollapse() {
      this.isCollapse = !this.isCollapse
    },
    async findMenu() {
      this.menuList = filterMenu(menuData)
    }
  },
  persist: piniaPersistConfig('authStore')
})
