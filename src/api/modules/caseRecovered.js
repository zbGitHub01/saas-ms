import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getCaseRecoveredList: 'POST /caseCenter/case/recover/recoverRecordList',
  getCaseRecoveredInfo: 'GET /caseCenter/case/recover/recoverRecordDetail'
}

const apis = generateApiFnc(apiConfig)
export default apis
