import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getCaseRecoveredList: 'POST /caseCenter/caseRecoveredList',
  getCaseRecoveredInfo: 'GET /caseCenter/caseRecoveredInfo'
}

const apis = generateApiFnc(apiConfig)
export default apis
