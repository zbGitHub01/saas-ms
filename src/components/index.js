import FormWrap from './FormWrap/index.vue'
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import OperationBar from './OperationBar/index.vue'

export default {
  install: app => {
    console.log(app, '---app')
    app.component('SvgIcon', SvgIcon)
    app.component('FormWrap', FormWrap)
    app.component('Pagination', Pagination)
    app.component('OperationBar', OperationBar)
  }
}
