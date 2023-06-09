/**
 * 预委案
 */
import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  entrustList: 'GET /caseCenter/case/entrust/entrustPlanList' //entrustBusType: 业务类型（1-实时委案；2-预预案; 3-导入委案; 4-模型委案;）
}

const apis = generateApiFnc(apiConfig)
export default apis
