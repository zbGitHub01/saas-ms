import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  findDeptTree: `GET /upms/client/employee/dept/tree`,
  addDept: `POST /upms/client/employee/dept/add`,
  editDept: `POST /upms/client/employee/dept/edit`,
  // 机构职位
  findPositionList: `GET /upms/client/employee/position/list`,
  addPosition: `POST /upms/client/employee/position/add`,
  // 机构角色
  findRoleList: `GET /upms/client/employee/role/list`,
  editRole: `POST /upms/client/employee/role`,
  findRoleDeptList: `GET /upms/client/employee/role/getDeptList`,
  removeDept: `GET /upms/client/employee/role`,
  findRoleEmployeeList: `GET /upms/client/employee/role/employee/list`,
  findNonRoleList: `GET /upms/client/employee/role/employee/nonRoleList`,
  addRoleEmployee: `GET /upms/client/employee/role/employee/add`,
  removeRoleEmployee: `GET /upms/client/employee/role/employee/remove`,
}

const apis = generateApiFnc(apiConfig)
export default apis
