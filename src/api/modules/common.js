import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  findRegisterUserList: `GET /upms/client/dict/register/userList`, // 下拉注册人名称列表
  findConfigList: `GET /upms/client/dict/config/list`, // 机构准入配置下拉列表
  findItemList: `GET /upms/client/dict/item/list`, // 查询字典项
  // 省市区
  areaTree: `GET /upms/client/dict/area/tree`,
  // 字典项 DEPT_LIST-部门列表，ROLE_LIST-角色列表，PERMISSION_TEMPLATE_LIST-权限模版列表，TENANT_LIST-租户列表
  dictDropdownList: `GET /upms/admin/dict/dropdownList`
}

const apis = generateApiFnc(apiConfig)
export default apis
