import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getCPEList: 'GET /caseCenter/case/allot/stats/allotStats' //CPE持案情况(平台端使用)
}

const apis = generateApiFnc(apiConfig)
export default apis
