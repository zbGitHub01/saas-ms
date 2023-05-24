import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getExportList: 'GET /caseCenter/case/entrust/entrustRecordExportField',
  getList: 'POST /caseCenter/case/getList'
}

const apis = generateApiFnc(apiConfig)
export default apis
