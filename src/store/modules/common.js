import { defineStore } from 'pinia'
import Apis from '@/api/modules/common'

export const useCommonStore = defineStore('commonStore', {
  state: () => ({
    deptTree: [], // 部门
    positionList: [], // 职位
    roleList: [] // 角色
  }),
  actions: {
    async fetchDeptTree() {
      const { code, data } = await Apis.findDeptTree({}, { headers: { noLoading: true } })
      if (code === 200) {
        this.deptTree = data
      }
    },
    async fetchPositionList() {
      const { code, data } = await Apis.findPositionList({}, { headers: { noLoading: true } })
      if (code === 200) {
        this.positionList = data
      }
    },
    async fetchRoleList() {
      const { code, data } = await Apis.findRoleList({}, { headers: { noLoading: true } })
      if (code === 200) {
        this.roleList = data
      }
    }
  }
})
