import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from '@/store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/styles/reset.scss'
import '@/styles/common.scss'
import '@/styles/element.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'virtual:svg-icons-register'
import Components from '@/components'
import directives from '@/directives/index'
import 'jsoneditor'
import deepCopy from '@/utils/deepCopy.js'
// import '../mock/index.js'

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(ElementPlus, { locale: zhCn })
app.use(Components)
app.use(directives)
app.config.globalProperties.$deepCopy = deepCopy

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
