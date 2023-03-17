import { ElLoading } from 'element-plus'

let loadingInstance

const startLoading = () => {
  loadingInstance = ElLoading.service({
    fullscreen: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.1)'
  })
}
const endLoading = () => {
  loadingInstance.close()
}

let neelLoadingRequestCount = 0
export const showFullScreenLoading = () => {
  if (neelLoadingRequestCount === 0) {
    startLoading()
  }
  neelLoadingRequestCount++
}
export const tryHideFullScreenLoading = () => {
  if (neelLoadingRequestCount <= 0) return
  neelLoadingRequestCount--
  if (neelLoadingRequestCount === 0) {
    endLoading()
  }
}
