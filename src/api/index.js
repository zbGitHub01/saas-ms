import axios from 'axios'
import { showFullScreenLoading, tryHideFullScreenLoading } from './serviceLoading'
import { AxiosCanceler } from './helper/axiosCancel'
import { ResultEnum } from './httpEnum'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { checkStatus } from './helper/checkStatus'
import { TOKEN } from '@/utils/constant'

const axiosCancel = new AxiosCanceler()
const config = {
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: ResultEnum.TIMEOUT,
  withCredentials: true
}
console.log(config, process.env, '---xixi')
class RequestHttp {
  service

  constructor(config) {
    this.service = axios.create(config)

    this.service.interceptors.request.use(
      config => {
        axiosCancel.addPending(config)
        if (!config.headers.noLoading) {
          showFullScreenLoading()
        }
        const token = localStorage[TOKEN] || null
        const headers = token ? { ...config.headers, token } : { ...config.headers }
        return { ...config, headers }
      },
      error => {
        return Promise.reject(error)
      }
    )

    this.service.interceptors.response.use(
      response => {
        const { data, config } = response
        axiosCancel.removePending(config)
        tryHideFullScreenLoading()
        if (config.headers.noMessage) {
          return data
        }
        if (data.code === ResultEnum.OVERDUE) {
          ElMessage.error(data.msg)
          // store.dispatch('user/logout')
          router.replace({ name: 'Login' })
          return data
        }
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          ElMessage.error(data.msg)
          return data
        }
        return data
      },
      error => {
        const { response } = error
        tryHideFullScreenLoading()
        if (response) {
          return checkStatus(response.status)
        }
        if (!window.navigator.onLine) {
          return router.replace('500')
        }
        return Promise.reject(error)
      }
    )
  }
  // * 常用请求方法封装
  get(url, params = {}, _object = {}) {
    return this.service.get(url, { params, ..._object })
  }
  post(url, params = {}, _object = {}) {
    return this.service.post(url, params, _object)
  }
  put(url, params = {}, _object = {}) {
    return this.service.put(url, params, _object)
  }
  delete(url, params = {}, _object = {}) {
    return this.service.delete(url, { params, ..._object })
  }
}

export default new RequestHttp(config)
