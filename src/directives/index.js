import copy from './modules/copy'
import tabVisible from './modules/tabVisible'

const directivesList = {
  copy,
  tabVisible
}

const directives = {
  install: function (Vue) {
    Object.keys(directivesList).forEach(key => {
      // 注册所有自定义指令
      Vue.directive(key, directivesList[key])
    })
  }
}

export default directives
