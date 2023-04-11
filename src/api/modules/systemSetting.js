import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  findDeptTree: `GET /upms/client/employee/dept/tree`,
  addDept: `POST /upms/client/employee/dept/add`,
  editDept: `POST /upms/client/employee/dept/edit`,
  // 机构职位
  findPositionList: `GET /upms/client/employee/position/list`,
  addPosition: `POST /upms/client/employee/position/add`,
}

const apis = generateApiFnc(apiConfig)
export default apis
