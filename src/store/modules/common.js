import { defineStore } from 'pinia'
import Apis from '@/api/modules/common'

export const useCommonStore = defineStore('commonStore', {
  state: () => ({
    dropdownList: {
      GLE_UPMS_COOPERATION_STATUS: [], // 机构合作状态
      ROLE_LIST_LIST: [], // 角色列表
      DEPT_LIST_LIST: [], // 部门列表
      DIST_LIST: [], // 分库列表
      DEPT_TREE: [], // 部门树
      ENTRUST_TYPE: [], // 委案类型
      POSITION_LIST_LIST: [], // 职位列表
      EMPLOYEE_LIST: [], // 员工列表
      TENANT_LIST: [], // 租户列表
      PERMISSION_TEMPLATE_LIST: [], // 权限模版列表
      CREDITOR_LIST: [], // 债权方列表
      WORK_TYPE: [], // 工单类型
      WORK_TYPE_ALL: [], // 全部工单类型
      CASE_STATUS_LIST: [
        { itemText: '正常', itemId: 1 },
        { itemText: '关闭｜已结清', itemId: 10 },
        { itemText: '关闭｜特殊原因', itemId: 15 },
        { itemText: '关闭｜已核销', itemId: 12 },
        { itemText: '关闭｜资产已转让', itemId: 16 },
        { itemText: '关闭｜呆账/坏帐', itemId: 17 },
        { itemText: '暂停|投诉', itemId: 20 },
        { itemText: '暂停|特殊原因', itemId: 25 }
      ]
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
