import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getExportList: `GET /caseCenter/case/entrust/entrustRecordExportField`
}

const apis = generateApiFnc(apiConfig)
export default apis
