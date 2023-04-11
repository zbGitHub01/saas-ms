// * 请求枚举配置
import { ElMessage } from 'element-plus'

/**
 * @description：请求配置
 */
export const ResultEnum = {
  SUCCESS: 200,
  ERROR: 500,
  OVERDUE: 424,
  NOT_PERMISSION: 403,
  TIMEOUT: 30000,
  TYPE: 'success'
}
/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */
export const checkStatus = status => {
  switch (status) {
    case 401:
      ElMessage.error('当前操作没有权限！')
      break
    case 403:
      ElMessage.error('当前操作没有权限！')
      break
    case 404:
      ElMessage.error('资源不存在！')
      break
    case 417:
      ElMessage.error('未绑定登录账号，请使用密码登录后绑定！')
      break
    case 423:
      ElMessage.error('演示环境不能操作，如需了解联系我们！')
      break
    case 424:
      ElMessage.error('令牌状态已过期，请重新登录！')
      break
    case 426:
      ElMessage.error('用户名不存在或密码错误！')
      break
    case 428:
      ElMessage.error('验证码错误,请重新输入！')
      break
    case 429:
      ElMessage.error('请求过频繁！')
      break
    case 479:
      ElMessage.error('演示环境，没有权限操作！')
      break
    default:
      ElMessage.error('系统未知错误,请反馈给管理员！')
  }
}

/**
 * @description：请求方法
 */
export const RequestEnum = {
  GET: 'GET',
  POST: 'POST',
  PATCH: 'PATCH',
  PUT: 'PUT',
  DELETE: 'DELETE'
}

/**
 * @description：常用的contentTyp类型
 */
export const ContentTypeEnum = {
  // json
  JSON: 'application/json;charset=UTF-8',
  // text
  TEXT: 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data 上传
  FORM_DATA: 'multipart/form-data;charset=UTF-8'
}
