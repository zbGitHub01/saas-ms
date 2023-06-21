import { generateApiFnc } from '@/api/helper/apiFncs'
import http from '../index'

const apiConfig = {
  // getOrgNameList: 'GET /caseCenter/getOrgNameList',
  divisionStrategyList: 'GET /caseCenter/case/allot/org/manage', //列表查询
  addOrgManage: 'POST /caseCenter/case/allot/org/manage', //新增分案机构管理
  updateOrgManage: 'PUT /caseCenter/case/allot/org/manage' //修改分案机构管理
  // getAssignAdminNameList: 'GET /caseCenter/getAssignAdminNameList'
}

//删除分案机构管理
export const deleteOrgManage = id => {
  return http.delete(`/caseCenter/case/allot/org/manage/${id}`)
}

const apis = generateApiFnc(apiConfig)
export default apis
