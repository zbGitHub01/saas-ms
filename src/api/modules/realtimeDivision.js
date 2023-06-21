import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  // getOrgList: 'GET /other/org/orgChart/list',
  // getUserList: 'GET /other/org/system/user/all',
  // caseAllotInfo: 'GET /caseCenter/case/allot/caseAllotNext',
  // recoverNowSelect: 'POST /caseCenter/case/recover/recoverNowSelect'
  getDetailInfo: 'POST /caseCenter/case/allot/strategy/detail', //策略实时分案信息
  strategyImport: 'POST /caseCenter/case/allot/strategy/import', //导入策略分案
  strategyExecute: 'POST /caseCenter/case/allot/strategy/execute' //执行分案
}

const apis = generateApiFnc(apiConfig)
export default apis
