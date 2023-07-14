import { render, createVNode } from 'vue'
import PreviewImageConstructor from './main.vue'

const createPreviewImage = options => {
  const container = document.createElement('div')
  const props = {
    remove() {
      render(null, container)
    },
    ...options
  }
  const vnode = createVNode(PreviewImageConstructor, props)
  render(vnode, container)
  document.body.appendChild(container.firstElementChild)
  // const vm = vnode.component
  // console.log(vm)
  // vm.exposed.visible.value = true
}
/**
 * @description: 图片预览方法
 * @param urlList 图片地址，多张图片必须是数组，一张图片可以是字符串
 * @param index 图片预览展示的下标，不传默认为0
 * @return void
 */
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
