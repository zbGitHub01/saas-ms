/**
 * v-auth
 * 控制权限按钮显示隐藏
 * 接收参数：string类型/Ref<string>类型/Reactive<string>类型
 */
import { useAuthStore } from '@/store/modules/auth'
const auth = {
  mounted(el, binding) {
    const buttonList = useAuthStore().authButtons
    const whiteList = ['string', 'array']
    const type = Object.prototype.toString.call(binding.value).slice(8, -1).toLowerCase()
    if (!whiteList.includes(type)) {
      throw new Error('v-auth只支持接受sting类型或者array类型')
    }
    const bindingValueArr = type === 'string' ? [binding.value] : binding.value
    const flag = bindingValueArr.every(el => {
      if (typeof el == 'string') {
        return buttonList.includes(el)
      } else {
        return el
      }
    })
    !flag && (el.style.display = 'none')
  }
}

export default auth
