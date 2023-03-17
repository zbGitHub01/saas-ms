import { generateApiFnc } from '@/api/helper/apiFncs'

const apiConfig = {
  login: `POST /sys/login/on`,
  msgCaptcha: `GET /sys/login/msgCaptcha`,
  getCurrentUserInfo: `GET /sys/user/getCurrentUserInfo`,
  resetPasswords: `POST /sys/user/resetPasswords`,
  dropdownList: `GET /dict/dropdown/list`
}

const apis = generateApiFnc(apiConfig)

export default apis
