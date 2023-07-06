import { defineStore } from 'pinia'
import { HOME_URL, TABS_BLACK_LIST } from '@/utils/constant'
import piniaPersistConfig from '@/utils/piniaPersist'
import router from '@/router/index'

// TabsStore
export const useTabsStore = defineStore('tabsState', {
  state: () => ({
    tabsMenuValue: HOME_URL,
    tabsMenuList: [{ title: '首页', path: HOME_URL, icon: 'home-filled', close: false }]
  }),
  getters: {},
  actions: {
    // Add Tabs
    async addTabs(tabItem) {
      // not add tabs black list
      // 任务页面不添加到标签里
      if (tabItem.path.includes('task/index')) return
      if (TABS_BLACK_LIST.includes(tabItem.path)) return
      const tabInfo = {
        title: tabItem.title,
        path: tabItem.path,
        icon: tabItem.icon,
        close: tabItem.close,
        query: {
          ...tabItem.query
        }
      }
      if (this.tabsMenuList.every(item => item.path !== tabItem.path)) {
        this.tabsMenuList.push(tabInfo)
      }
      this.setTabsMenuValue(tabItem.path)
    },
    // Remove Tabs
    async removeTabs(tabPath) {
      let tabsMenuValue = this.tabsMenuValue
      const tabsMenuList = this.tabsMenuList
      if (tabsMenuValue === tabPath) {
        tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) return
          const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1]
          if (!nextTab) return
          tabsMenuValue = nextTab.path
          router.push(nextTab.path)
        })
      }
      this.tabsMenuValue = tabsMenuValue
      this.tabsMenuList = tabsMenuList.filter(item => item.path !== tabPath)
    },
    // Change Tabs
    async changeTabs(tabItem) {
      this.tabsMenuList.forEach(item => {
        if (item.title === tabItem.label) router.push(item.path)
      })
    },
    // Set TabsMenuValue
    async setTabsMenuValue(tabsMenuValue) {
      this.tabsMenuValue = tabsMenuValue
    },
    // Set TabsMenuList
    async setTabsMenuList(tabsMenuList) {
      this.tabsMenuList = tabsMenuList
    },
    // Close MultipleTab
    async closeMultipleTab(tabsMenuValue) {
      this.tabsMenuList = this.tabsMenuList.filter(item => {
        return item.path === tabsMenuValue || item.path === HOME_URL
      })
    },
    // Go Home
    async goHome() {
      router.push(HOME_URL)
      this.tabsMenuValue = HOME_URL
    }
  },
  persist: piniaPersistConfig('TabsState')
})
