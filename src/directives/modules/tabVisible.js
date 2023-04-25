import { nextTick } from 'vue'
import { useAuthStore } from '@/store/modules/auth'

const tabVisible = {
  mounted(el, binding) {
    const authStore = useAuthStore()
    if (authStore.tabPage && authStore.tabPage.tabs) {
      if (!authStore.tabPage.tabs.includes(binding.value)) {
        nextTick(() => {
          const parentEl = el.parentElement.parentElement
          const removeEl = parentEl.querySelector(`div[aria-controls=pane-${binding.value}]`)
          removeEl.remove()
          el.remove()
        })
      }
    }
  }
}
export default tabVisible
