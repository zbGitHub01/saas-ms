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
      const { data } = await Apis.findDeptTree({}, { headers: { noLoading: true } })
      this.deptTree = data
    },
    async fetchPositionList() {
      const { data } = await Apis.findPositionList({}, { headers: { noLoading: true } })
      this.positionList = data
    },
    async fetchRoleList() {
      const { data } = await Apis.findRoleList({}, { headers: { noLoading: true } })
      this.roleList = data
    }
  }
})
