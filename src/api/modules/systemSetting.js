import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  // 所有员工
  findAllEmployeeList: `POST /upms/client/employee/page`,
  updateEmployeeStatus: `GET /upms/client/employee/updateStatus`,
  updateEmployeeDimission: `GET /upms/client/employee/updateDimission`,
  // 机构部门
  findDeptTree: `GET /upms/client/employee/dept/tree`,
  addDept: `POST /upms/client/employee/dept/add`,
  editDept: `POST /upms/client/employee/dept/edit`,
  findDeptEmployeeList: `GET /upms/client/employee/dept/employee/list`,
  updateDeptEmployee: `POST /upms/client/employee/dept/employee/updateDept`,
  // 机构职位
  findPositionList: `GET /upms/client/employee/position/list`,
  addPosition: `POST /upms/client/employee/position/add`,
  editPosition: `POST /upms/client/employee/position/edit`,
  delPosition: `GET /upms/client/employee/position/delete`,
  findPositionEmployeeList: `GET /upms/client/employee/position/employee/list`,
  findNonPositionEmployee: `GET /upms/client/employee/position/employee/nonPositionList`,
  editPositionEmployee: `POST /upms/client/employee/position/employee/updatePosition`,
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
