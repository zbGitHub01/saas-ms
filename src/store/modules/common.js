import { defineStore } from 'pinia'
import Apis from '@/api/modules/common'

export const useCommonStore = defineStore('commonStore', {
  state: () => ({
    dropdownList: {
      COOPERATION_STATUS: [], // 机构合作状态
      ROLE: [], // 角色列表
      DEPT: [], // 部门列表
      POSITION: [] // 职位列表
    }
  }),
  actions: {
    async fetchItemList(code = null) {
      const codes = code || Object.keys(this.dropdownList).join(',')
      const { data } = await Apis.findItemList({ codes }, { headers: { noLoading: true } })
      this.dropdownList = { ...this.dropdownList, ...data }
    }
  }
})
