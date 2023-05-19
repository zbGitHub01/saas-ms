import http from '../index'
import { generateApiFnc } from '@/api/helper/apiFncs'
import { stringify } from 'qs'

const apiConfig = {
  findTenantList: `GET /upms/client/user/tenant/list`,
  findUserInfo: `GET /upms/client/user/info`,
  setPassword: `POST /upms/client/user/setPassword`,
  logout: `DELETE /auth/token/logout`,
  acceptInvite: `GET /upms/client/user/invite/accept`,
}

export const userLogin = (data, _object) => {
  const params = {
    ...data
  }
  const postData = {
    password: params.password
  }
  delete params.password
  return http.post('/auth/oauth/token', stringify(postData), { ..._object, params })
}
export const mobileLogin = (params, _object) => {
  return http.post(`/auth/mobile/token/sms`, null, { ..._object, params })
}
export const sendSmsCode = mobile => {
  return http.get(`/upms/client/mobile/${mobile}`)
}
export const chooseTenant = tenantId => {
  return http.get(`/upms/client/user/tenant/choose/${tenantId}`)
}

const apis = generateApiFnc(apiConfig)
export default apis
