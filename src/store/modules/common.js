import { defineStore } from 'pinia'
import Apis from '@/api/modules/common'

export const useCommonStore = defineStore('commonStore', {
  state: () => ({
    deptTree: [], // 部门
    positionList: [], // 职位
    roleList: [], // 角色
    dropdownList: {
      COOPERATION_STATUS: [],
      ROLE: [],
      DEPT: [],
      POSITION: []
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
