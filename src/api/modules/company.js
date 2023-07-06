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

    // 债权方
    creditorPage: `POST /upms/client/tenant/creditor/page`, //债权方列表
    creditorAdd: `POST /upms/client/tenant/creditor/add`, //新增债权方
    creditorEdit: `POST /upms/client/tenant/creditor/edit`, //编辑债权方
    creditorDelete: `DELETE /upms/client/tenant/creditor/delete`, //删除债权方 //试试看
    creditorDetail: `GET /upms/client/tenant/creditor/detail`, //债权方详情
}

// 获取公司信息
export const adminTenant = id => {
  return http.get(`/upms/client/tenant/${id}`)
}

const apis = generateApiFnc(apiConfig)
export default apis