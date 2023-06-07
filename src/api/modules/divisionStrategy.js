import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getOrgNameList: 'GET /caseCenter/getOrgNameList',
  divisionStrategyList: 'POST /caseCenter/divisionStrategyList',
  getAssignAdminNameList: 'GET /caseCenter/getAssignAdminNameList'
}

const apis = generateApiFnc(apiConfig)
export default apis
