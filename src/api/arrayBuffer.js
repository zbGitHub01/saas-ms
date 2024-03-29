import axios from 'axios'
import { useGlobalStore } from '@/store'
import { ElMessage } from 'element-plus'

const globalState = useGlobalStore()

export const downArrayBufferFile = (method, action, data) => {
  axios({
    method: method ? method : 'get',
    url: action,
    data: data,
    // params: {
    //   isXlsx: false
    // },
    responseType: 'blob',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
      Authorization: globalState.token
    }
  })
    .then(res => {
      const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })
      const fileName = '文件名' + new Date().getTime() + '.xlsx'
      const element = document.createElement('a') // 创建a标签
      element.download = fileName // 为a标签添加download属性  //命名下载名称
      element.style.display = 'none'
      element.href = URL.createObjectURL(blob)
      document.body.appendChild(element)
      element.click() // 点击下载
      URL.revokeObjectURL(element.href) // 释放URL 对象
      document.body.removeChild(element) // 释放标签
    })
    .catch(error => {
      ElMessage.error(error)
      console.log('Error: ', error)
    })
}
