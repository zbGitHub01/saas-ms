/**
 * 可管理案件
 */
import { generateApiFnc } from '@/api/helper/apiFncs'

//案件详情APi
const caseInfoApi = {
  getCaseInfoList: 'GET /caseCenter/case/info', //案件详情列表
  updateCaseInfo: 'POST /caseCenter/case/info/update' //更新案件资料
}

//债转通知记录Api
const debtNoticeApi = {
  getDebtNoticeList: 'GET /caseCenter/case/notice/list' //案件详情列表
}

//案件流转记录Api
const transferLogApi = {
  getTransferLogList: 'GET /caseCenter/case/transferLog/list' //案件流转记录
}

//案件流转记录Api
const retentionApi = {
  getRetainList: 'GET /caseCenter/case/retain/list' //留案记录
}

const apiConfig = {
  ...caseInfoApi,
  ...retentionApi,
  ...debtNoticeApi,
  ...transferLogApi
}

const apis = generateApiFnc(apiConfig)
export default apis
