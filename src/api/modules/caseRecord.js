import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getEntrustAmount: 'GET /caseCenter/case/entrust/entrustRecordEntrustAmount', //实际委案量api
  getList: 'POST /caseCenter/case/entrust/entrustRecordList'
}

const apis = generateApiFnc(apiConfig)
export default apis
