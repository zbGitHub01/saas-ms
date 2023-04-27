import { generateApiFnc } from '@/api/helper/apiFncs'
import http from '../index'

const apiConfig = {
    // 租户员工下拉
    getEmployeeDrop: `GET /upms/admin/tenant/getEmployeeDrop`,
    // 编辑租户信息
    tenantEdit: `PUT /upms/admin/tenant/edit`,
    // 发送短信
    sendSms: `GET /upms/client/tenant/sendSms`,
    // 变更主管理员
    updateAdmin: `POST /upms/client/tenant/updateAdmin`,
    // 变更注册人
    updateRegister: `POST /upms/client/tenant/updateRegister`,
}

// 获取公司信息
export const adminTenant = id => {
  return http.get(`/upms/admin/tenant/${id}`)
}

const apis = generateApiFnc(apiConfig)
export default apis