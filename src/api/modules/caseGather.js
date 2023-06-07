import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  getCPEList: 'POST /caseCenter/case/getCPEList',
  caseUnassignedGatherList: 'POST /caseCenter/case/caseUnassignedGatherList'
}

const apis = generateApiFnc(apiConfig)
export default apis
