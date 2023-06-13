import { defineStore } from 'pinia'
import Apis from '@/api/modules/common'

export const useCommonStore = defineStore('commonStore', {
  state: () => ({
    dropdownList: {
      COOPERATION_STATUS: [], // 机构合作状态
      ROLE_LIST: [], // 角色列表
      DEPT_LIST: [], // 部门列表
      POSITION_LIST: [] // 职位列表
    },
    regionData: []
  }),
  actions: {
    async fetchItemList(code = null) {
      const codes = code || Object.keys(this.dropdownList).join(',')
      const { data } = await Apis.findItemList({ codes }, { headers: { noLoading: true } })
      this.dropdownList = { ...this.dropdownList, ...data }
    },
    async fetchRegion() {
      const { data } = await Apis.areaTree({}, { headers: { noLoading: true } })
      this.regionData = data
    }
  }
})
