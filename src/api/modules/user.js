import http from '../index'
import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  userLogin: `POST /auth/oauth/token`,
  mobileLogin: `POST /auth/mobile/token/sms`,
  findTenantList: `GET /upms/client/user/tenant/list`,
  findUserInfo: `GET /upms/client/user/info`,
  setPassword: `POST /upms/client/user/setPassword`,
  logout: `DELETE /auth/token/logout`,
  acceptInvite: `GET /upms/client/user/invite/accept`,
}

export const sendSmsCode = mobile => {
  return http.get(`/upms/client/mobile/${mobile}`)
}
export const chooseTenant = tenantId => {
  return http.get(`/upms/client/user/tenant/choose/${tenantId}`)
}

const apis = generateApiFnc(apiConfig)
export default apis
