import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getCaseRecoveredList: 'POST /caseCenter/case/recover/recoverRecordList',
  getCaseRecoveredInfo: 'GET /caseCenter/case/recover/recoverRecordDetail',
  getOrgList: 'GET /upms/client/dict/relationOrg/list' //获取机构下拉
}

const apis = generateApiFnc(apiConfig)
export default apis
