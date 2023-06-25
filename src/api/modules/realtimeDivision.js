import http from '../index'
import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getDetailInfo: 'POST /caseCenter/case/allot/strategy/detail', //策略实时分案信息
  strategyExecute: 'POST /caseCenter/case/allot/strategy/execute' //执行分案
}

//导入策略分案
export const strategyImport = (params, data) => {
  return http.post(`/caseCenter/case/allot/strategy/import?orgId=${params}`, data)
}

const apis = generateApiFnc(apiConfig)

export default apis
