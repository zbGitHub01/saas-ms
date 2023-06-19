import { defineStore } from 'pinia'
import Apis from '@/api/modules/common'

export const useCommonStore = defineStore('commonStore', {
  state: () => ({
    dropdownList: {
      GLE_UPMS_COOPERATION_STATUS: [], // 机构合作状态
      ROLE_LIST_LIST: [], // 角色列表
      DEPT_LIST_LIST: [], // 部门列表
      DEPT_TREE: [], // 部门树
      POSITION_LIST_LIST: [], // 职位列表
      EMPLOYEE_LIST: [], // 员工列表
      TENANT_LIST: [], // 租户列表
      PERMISSION_TEMPLATE_LIST: [], // 权限模版列表
      CREDITOR_LIST: [], // 债权方列表
      WORK_TYPE: [], // 工单类型
      WORK_TYPE_ALL: [] // 全部工单类型
    },
    regionData: [] // 省市区
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
