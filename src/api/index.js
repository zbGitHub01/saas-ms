import axios from 'axios'
import { showFullScreenLoading, tryHideFullScreenLoading } from './serviceLoading'
import { AxiosCanceler, axiosCancelWhiteList } from './helper/axiosCancel'
import { ResultEnum, checkStatus } from './httpEnum'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useGlobalStore } from '@/store'

const axiosCancel = new AxiosCanceler()
const config = {
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: ResultEnum.TIMEOUT,
  withCredentials: true
}
class RequestHttp {
  service

  constructor(config) {
    this.service = axios.create(config)

    this.service.interceptors.request.use(
      config => {
        const globalState = useGlobalStore()
        if (!axiosCancelWhiteList.includes(config.url)) {
          axiosCancel.addPending(config)
        }
        if (!config.headers.noLoading) {
          showFullScreenLoading()
        }
        const headers = { ...config.headers }
        if (globalState.token && !headers.Authorization) {
          headers.Authorization = globalState.token
        }
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
        if (data.code && data.code !== ResultEnum.SUCCESS) {
          ElMessage.error(data.msg)
        }
        return data
      },
      error => {
        const { response } = error
        tryHideFullScreenLoading()
        if (response) {
          checkStatus(response.status)
          if (response.status === ResultEnum.OVERDUE) {
            const globalStore = useGlobalStore()
            globalStore.logout()
          }
        }
        if (!window.navigator.onLine) {
          return router.replace('500')
        }
        return response || error
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
