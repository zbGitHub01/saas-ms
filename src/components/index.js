import FormWrap from './FormWrap/index.vue'
import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import OperationBar from './OperationBar/index.vue'
import LabelData from './LabelData/index.vue'
import TableWrap from './TableWrap/index.vue'
import FormClass from '@/components/FormClass/index.vue'
import DialogForm from '@/components/DialogForm/index.vue'
import TableClass from '@/components/TableClass/index.vue'
import LabelClass from '@/components/LabelClass/index.vue'
import ColorShow from '@/components/ColorShow/index.vue'
import Status  from '@/components/Status/index.vue'
import TemporaryLabel from '@/components/TemporaryLabel/index.vue'

export default {
  install: Vue => {
    Vue.component('SvgIcon', SvgIcon)
    Vue.component('FormWrap', FormWrap)
    Vue.component('Pagination', Pagination)
    Vue.component('OperationBar', OperationBar)
    Vue.component('LabelData', LabelData)
    Vue.component('TableWrap', TableWrap)
    Vue.component('FormClass', FormClass)
    Vue.component('DialogForm', DialogForm)
    Vue.component('TableClass', TableClass)
    Vue.component('LabelClass', LabelClass)
    Vue.component('ColorShow', ColorShow)
    Vue.component('Status', Status)
    Vue.component('TemporaryLabel', TemporaryLabel)
  }
}
