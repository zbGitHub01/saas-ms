/**
 * 可管理案件
 */
import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getCaseInfoList: 'GET /caseCenter/case/info' //案件详情列表
}

const apis = generateApiFnc(apiConfig)
export default apis
