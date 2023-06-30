import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getEntrustAmount: 'GET /caseCenter/case/entrust/entrustRecordEntrustAmount', //实际委案量api
  getList: 'POST /caseCenter/case/entrust/entrustRecordList',
  getOrgList: 'GET /upms/client/dict/relationOrg/list' //获取机构下拉
}

const apis = generateApiFnc(apiConfig)
export default apis
