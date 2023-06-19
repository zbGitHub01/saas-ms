import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getPreRecoverList: 'POST /caseCenter/case/recover/preRecoverList', //预收回列表
  preRecoverPublish: 'POST /caseCenter/case/recover/preRecoverPublish', //发布预收回方案
  preRecoverDelete: 'POST /caseCenter/case/recover/preRecoverDelete', //删除预收回方案
  casePreRecoverNext: 'POST /caseCenter/case/recover/casePreRecoverNext', //发起预收回方案选机构
  casePreRecoverSave: 'POST /caseCenter/case/recover/casePreRecoverSave' //发起预收回方案保存方案
}

const apis = generateApiFnc(apiConfig)
export default apis
