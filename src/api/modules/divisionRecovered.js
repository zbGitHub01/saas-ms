import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getDivisionRecoveredList: 'POST /caseCenter/divisionRecoveredList',
  getDivisionRecoveredInfo: 'GET /caseCenter/divisionRecoveredInfo'
}

const apis = generateApiFnc(apiConfig)
export default apis
