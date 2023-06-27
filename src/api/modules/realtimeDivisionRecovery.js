import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getOrgList: 'GET /other/org/orgChart/list',
  getUserList: 'GET /other/org/system/user/all',
  caseAllotInfo: 'GET /caseCenter/case/allot/caseAllotNext',
  getLabelStats: 'POST /caseCenter/case/recover/recoverCaseList/stats', //label显示金额
  recoverRecordList: 'POST /caseCenter/case/recover/recoverCaseList', //列表
  recoverNowSelect: 'POST /caseCenter/case/recover/recoverNowSelect'
}

const apis = generateApiFnc(apiConfig)

export default apis
