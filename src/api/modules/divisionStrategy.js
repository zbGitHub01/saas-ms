import { generateApiFnc } from '@/api/helper/apiFncs'
import http from '../index'

const apiConfig = {
  // getOrgNameList: 'GET /caseCenter/getOrgNameList',
  divisionStrategyList: 'GET /caseCenter/case/allot/org/manage', //列表查询
  addOrgManage: 'POST /caseCenter/case/allot/org/manage', //新增分案机构管理
  updateOrgManage: 'PUT /caseCenter/case/allot/org/manage', //修改分案机构管理
  getCPEList: 'GET /caseCenter/case/allot/stats/allotStats', //CPE持案情况(平台端使用)
  getDetailInfo: 'POST /caseCenter/case/allot/strategy/detail', //策略实时分案信息
  strategyExecute: 'POST /caseCenter/case/allot/strategy/execute', //执行分案
  getOrgList: 'GET /upms/client/dict/relationOrg/list', //获取机构下拉
  getUserList: 'GET /upms/client/dict/empolyee/list' //获取负责人下拉
}

//删除分案机构管理
export const deleteOrgManage = id => {
  return http.delete(`/caseCenter/case/allot/org/manage/${id}`)
}

//导入策略分案
export const strategyImport = (params, data) => {
  return http.post(`/caseCenter/case/allot/strategy/import?orgId=${params}`, data)
}

const apis = generateApiFnc(apiConfig)
export default apis
