import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  findDeptTree: `GET /upms/client/dict/dept/tree`,
  findPositionList: `GET /upms/client/dict/dept/list`,
  findRoleList: `GET /upms/client/dict/role/list`,
}

const apis = generateApiFnc(apiConfig)
export default apis
