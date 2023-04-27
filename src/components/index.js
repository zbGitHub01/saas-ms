import FormWrap from './FormWrap/index.vue'
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import OperationBar from './OperationBar/index.vue'
import LabelData from './LabelData/index.vue'
import TableWrap from './TableWrap/index.vue'

export default {
  install: Vue => {
    Vue.component('SvgIcon', SvgIcon)
    Vue.component('FormWrap', FormWrap)
    Vue.component('Pagination', Pagination)
    Vue.component('OperationBar', OperationBar)
    Vue.component('LabelData', LabelData)
    Vue.component('TableWrap', TableWrap)
  }
}
