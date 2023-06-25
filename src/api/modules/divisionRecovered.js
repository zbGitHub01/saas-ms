import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getDivisionRecoveredList: 'POST /caseCenter/case/recover/recoverRecordList',
  getDivisionRecoveredInfo: 'GET /caseCenter/case/recover/recoverRecordDetail'
}

const apis = generateApiFnc(apiConfig)
export default apis
