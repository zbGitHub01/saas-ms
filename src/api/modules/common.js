import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  findDeptTree: `GET /upms/client/dict/dept/tree`,
  findPositionList: `GET /upms/client/dict/dept/list`,
  findRoleList: `GET /upms/client/dict/role/list`,
  findRegisterUserList: `GET /upms/client/dict/register/userList`, // 下拉注册人名称列表
  findConfigList: `GET /upms/client/dict/config/list` // 机构准入配置下拉列表
}

const apis = generateApiFnc(apiConfig)
export default apis
