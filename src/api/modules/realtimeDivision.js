import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getLabelStats: 'POST /caseCenter/case/allot/allotCaseList/stats', //label显示金额
  getTemplateUrl: 'GET /caseCenter/caseImport/importExcelPath', //获取导入分案模板
  caseAllotSelect: 'POST /caseCenter/case/allot/caseAllotSelect', //发起分案
  caseImportAllot: 'POST /caseCenter/case/allot/caseImportAllot', //导入分案模板
  caseAllotRefresh: 'POST /caseCenter/case/allot/caseAllotRefresh', //重新分配
  caseAllotAdjust: 'POST /caseCenter/case/allot/caseAllotAdjust', //调值
  caseAllotSave: 'POST /caseCenter/case/allot/caseAllotSave', //实时分案保存
  caseAllotNext: 'POST /caseCenter/case/allot/caseAllotNext', //CPE选择
  recordList: 'POST /caseCenter/case/allot/allotCaseList', //列表
  getUserTreeList: 'GET /upms/client/dict/item/list', //获取机构用户部门树形列表
  getUserList: 'GET /upms/client/dict/empolyee/list' //获取CPE
}

const apis = generateApiFnc(apiConfig)

export default apis
