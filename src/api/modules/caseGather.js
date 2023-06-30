import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getList: 'GET /caseCenter/case/allot/stats/orgAllotStats', //CPE持案情况(机构端使用)
  getOrgUnAllotStats: 'GET /caseCenter/case/allot/stats/orgUnAllotStats', //机构未分案统计
  getCPEList: 'GET /upms/client/dict/empolyee/list' //获取CPE下拉
}

const apis = generateApiFnc(apiConfig)
export default apis
