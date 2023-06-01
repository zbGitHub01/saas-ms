import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getOrgList: 'GET /other/org/orgChart/list',
  getUserList: 'GET /other/org/system/user/all',
  caseAllotInfo: 'GET /caseCenter/case/allot/caseAllotNext'
}

const apis = generateApiFnc(apiConfig)
export default apis
