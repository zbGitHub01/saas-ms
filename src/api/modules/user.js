import { generateApiFnc } from '@/api/helper/apiFncs'
import http from '../index'

const apiConfig = {
  userLogin: `POST /auth/oauth/token`,
  mobileLogin: `POST /auth/mobile/token/sms`,
  findTenantList: `GET /upms/client/user/tenant/list`
}

export const sendSmsCode = mobile => {
  return http.get(`/upms/client/mobile/${mobile}`)
}
export const chooseTenant = tenantId => {
  return http.get(`/upms/client/user/tenant/choose/${tenantId}`)
}

const apis = generateApiFnc(apiConfig)
export default apis
