import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  // 所有员工
  findAllEmployeeList: `POST /upms/client/employee/page`,
  updateEmployeeStatus: `GET /upms/client/employee/updateStatus`,
  updateEmployeeDimission: `GET /upms/client/employee/updateDimission`,
  inviteEmployee: `POST /upms/client/employee/invite`,
  findInviteUserInfo: `GET /upms/client/user/invite/get`,
  findEmployeeInfo: `GET /upms/client/employee/getById`,
  editEmployeeInfo: `POST /upms/client/employee/editById`,
  // 机构部门
  findDeptTree: `GET /upms/client/employee/dept/tree`,
  addDept: `POST /upms/client/employee/dept/add`,
  editDept: `POST /upms/client/employee/dept/edit`,
  delDept: `GET /upms/client/employee/dept/delete`,
  findDeptEmployeeList: `GET /upms/client/employee/dept/employee/list`,
  updateDeptEmployee: `GET /upms/client/employee/dept/employee/updateDept`,
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
  editRole: `POST /upms/client/employee/role/save`,
  removeRole: `GET /upms/client/employee/role/delete`,
  findRoleDeptList: `GET /upms/client/employee/role/getDeptList`,
  removeDept: `GET /upms/client/employee/role`,
  findRoleEmployeeList: `GET /upms/client/employee/role/employee/list`,
  findNonRoleList: `GET /upms/client/employee/role/employee/nonRoleList`,
  addRoleEmployee: `POST /upms/client/employee/role/employee/add`,
  removeRoleEmployee: `GET /upms/client/employee/role/employee/remove`,

  // 部门权限
  findPermissionDeptTree: `GET /upms/client/permission/dept/tree`,
  findPermissionDeptPermit: `GET /upms/client/permission/dept/permit/List`,
  addPermissionDeptPermit: `POST /upms/client/permission/dept/permit/add`,
  removePermissionDeptPermit: `POST /upms/client/permission/dept/permit/remove`,
  updatePermissionDeptScope: `POST /upms/client/permission/dept/permit/scope/save`,
  // 角色权限
  findPermissionRoleList: `GET /upms/client/permission/role/list`,
  findPermissionRolePermit: `GET /upms/client/permission/role/permit/List`,
  addPermissionRolePermit: `POST /upms/client/permission/role/permit/add`,
  removePermissionRolePermit: `POST /upms/client/permission/role/permit/remove`,
  updatePermissionRoleScope: `POST /upms/client/permission/role/permit/scope/save`,
  // 员工权限
  findPermissionEmployeeDeptTree: `GET /upms/client/permission/employee/dept/tree`,
  findPermissionEmployeeList: `GET /upms/client/permission/employee/list`,
  fetchPermissionEmployeePermit: `GET /upms/client/permission/employee/permit/list`,
  addPermissionEmployeePermit: `POST /upms/client/permission/employee/permit/add`,
  removePermissionEmployeePermit: `POST /upms/client/permission/employee/permit/remove`,
  updatePermissionEmployeeScope: `POST /upms/client/permission/employee/permit/scope/save`
}

const apis = generateApiFnc(apiConfig)
export default apis
