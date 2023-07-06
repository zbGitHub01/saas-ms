/**
 * 受委托案件
 */
import { generateApiFnc } from '@/api/helper/apiFncs'

//案件信息APi
const caseInfoApi = {
  getCaseInfoList: 'GET /caseCenter/org/companyCase/new/info', //案件详情列表
  getTagAlert: 'GET /caseCenter/case/tagAlert/list', //获取预警标签列表
  updateCaseInfo: 'POST /caseCenter/case/info/update', //更新案件资料
  updateTagAlert: 'POST /caseCenter/case/tagAlert/share', //设置是否共享
  repayInfo: 'POST /caseCenter/case/cseInfo/repayInfo', //获取案件还款信息
  caseExtLog: 'GET /caseCenter/case/tagAlert/log/list', //案人资料预警标签历史记录
  contactsInfo: 'GET /caseCenter/case/user/phone/getByCaseId', //联系方式
  investorName: 'POST /caseCenter/case/enter/investorName' //录入资方信息
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
