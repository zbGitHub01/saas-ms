import { render, createVNode } from 'vue'
import PreviewImageConstructor from './main.vue'

const createPreviewImage = options => {
  const container = document.createElement('div')
  const props = {
    visible: true,
    remove() {
      render(null, container)
    },
    ...options
  }
  const vnode = createVNode(PreviewImageConstructor, props)
  render(vnode, container)
  document.body.appendChild(container.firstElementChild)
}
export const previewImage = (urlList, index = 0) => {
  if (typeof urlList === 'string') {
    urlList = [urlList]
  }
  if (!Array.isArray(urlList)) {
    console.log('图片地址格式不正确')
    return
  }
  createPreviewImage({ urlList, zIndex: index })
}
