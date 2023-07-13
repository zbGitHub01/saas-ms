<template>
  <div class="search-form-wrapper">
    <el-form ref="formRef" :model="form" inline>
      <template v-for="item in formItems" :key="item.key">
        <el-form-item v-if="!!item.isShow" :prop="item.key">
          <el-input
            v-if="item.type === 'text'"
            v-model="form[item.key]"
            :placeholder="'请输入' + item.title"
            clearable
          ></el-input>
          <el-input
            v-if="item.type === 'number'"
            v-model="form[item.key]"
            type="number"
            :placeholder="'请输入' + item.title"
            clearable
          ></el-input>
          <el-select
            v-if="formTypeMap.select.includes(item.type)"
            v-model="form[item.key]"
            :placeholder="'请选择' + item.title"
            clearable
            filterable
            :multiple="item.type === 'multipleSelect'"
          >
            <el-option
              v-for="option in item.type === 'radio' ? item.data : options[item.code] || []"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
          <el-select-v2
            v-if="formTypeMap.lazySelect.includes(item.type)"
            v-model="form[item.key]"
            :options="options[item.code] || []"
            :multiple="item.type === 'lazyMultipleSelect'"
            filterable
            clearable
            :placeholder="'请选择' + item.title"
          />
          <el-cascader
            v-if="item.type === 'area'"
            v-model="form[item.key]"
            :options="areaList"
            :placeholder="'请选择' + item.title"
            clearable
            filterable
            :props="{
              value: 'name',
              checkStrictly: true,
              label: 'name',
              multiple: true
            }"
          />
          <el-date-picker
            v-if="formTypeMap.date.includes(item.type)"
            v-model="form[item.key]"
            :type="item.type === 'dateRange' ? 'daterange' : 'date'"
            :placeholder="'请选择' + item.title"
            value-format="yyyy-MM-dd"
            range-separator="至"
            :start-placeholder="item.title + '开始'"
            :end-placeholder="item.title + '结束'"
          ></el-date-picker>
          <number-range
            v-if="item.type === 'sumRange'"
            v-model="form[item.key]"
            :start-placeholder="item.title + '最小值'"
            :end-placeholder="item.title + '最大值'"
          />
        </el-form-item>
      </template>
      <el-form-item class="btn-list">
        <el-popover style="margin-right: 10px" placement="bottom-start" trigger="click" width="220">
          <div class="check-wrap">
            <el-input v-model="searchText" placeholder="请输入搜索内容" :prefix-icon="Search" />
            <el-scrollbar class="scroll">
              <div class="check-list">
                <el-checkbox v-for="item in checkList" :key="item.key" :model-value="!!item.isShow" @change="checkChange($event, item)">
                  {{ item.title }}
                </el-checkbox>
              </div>
            </el-scrollbar>
          </div>
          <template #reference>
            <el-button :icon="Operation" circle></el-button>
          </template>
        </el-popover>
        <el-button type="primary" @click="onSearch">查询</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Operation, Search } from '@element-plus/icons-vue'
import { useCommonStore } from '@/store/modules/common'
import NumberRange from './NumberRange.vue'
import { foreara } from '@/utils/formatedate'
// import { caseStatePauseConfigList } from '@/api/casestop'
import formData from './formData.json'
import Apis from '@/api/modules/caseManage'
// text: 输入框, select: 单选下拉框, multipleSelect: 多选下拉框, radio: 简易下拉框, lazySelect: 懒加载下拉框. lazyMultipleSelect: 懒加载多选下拉框, area: 区域选择, dateRange: 日期区间选择器, date: 日期选择器, sumRange: 数值金额区间
// tips: 日期区间参数为key值后面加 Start | End, 数值区间参数为key值后面加 Max | Min

const props = defineProps({
  code: {
    type: String,
    default: '',
    required: true
  }
})
const emit = defineEmits(['search'])
const commonStore = useCommonStore()
const formRef = ref()
const formTypeMap = {
  select: ['select', 'multipleSelect', 'radio'], // 下拉框类型
  lazySelect: ['lazySelect', 'lazyMultipleSelect'], // 懒加载下拉框类型
  date: ['dateRange', 'date'] // 日期类型
}
// 需要初始化的value为[]的类型
const rangeType = ['dateRange', 'sumRange', 'area']
const valueStringKey = ['IVR_TAG', 'ROBOT_TAG', 'CASE_LAWSUIT_STATUS_TAG']
const formStaticCode = {
  // 前端调用的下拉数据
  cpeId: 'CPE_LIST'
}
const formItems = ref([])
const options = reactive({
  CASE_STATUS_LIST: [
    { value: 1, label: '正常' },
    { value: 10, label: '关闭|已结清' },
    { value: 15, label: '关闭|特殊原因' },
    { value: 12, label: '关闭|已核销' },
    { value: 16, label: '关闭|资产已转让' },
    { value: 17, label: '关闭|呆账/坏账' },
    { value: 20, label: '暂停|投诉' },
    { value: 25, label: '暂停|特殊原因' }
  ],
  CPE_LIST: []
})
const form = reactive({})
const areaList = computed(() => commonStore.regionData)
const searchText = ref('')
const checkList = computed(() => {
  if (!searchText.value) return formItems.value
  return formItems.value.filter(item => item.title.includes(searchText.value))
})

const fetchFieldList = async () => {
  const { data } = await Apis.findFieldList({ codes: props.code })
  setFormData(data[props.code])
  // setFormData(formData)
}
const setFormData = data => {
  const codes = []
  formItems.value = data.map(item => {
    if (item.code) {
      codes.push(item.code)
    }
    if (formStaticCode[item.key]) {
      item.code = formStaticCode[item.key]
    }
    form[item.key] = rangeType.includes(item.type) ? [] : null
    return item
  })
  fetchSelectList(codes)
}
const fetchSelectList = async codes => {
  if (!codes.length) return
  codes.forEach(key => {
    if (commonStore.dropdownList[key]) {
      options[key] = commonStore.dropdownList[key]?.map(item => {
        const value = valueStringKey.includes(key) ? item.itemText : item.itemId
        return { label: item.itemText, value: value || item.itemText }
      })
    }
    if (key === 'PRODUCT_LIST') {
      fetchProductList()
    }
  })
  console.log(options, '---options')
}
const fetchProductList = async () => {
  const { data } = await Apis.productList({ isProxy: 0, productStatus: 1 })
  options.PRODUCT_LIST = data.map(item => {
    return { label: item.productName, value: item.productId }
  })
}
// const fetchCpeList = async () => {
//   const { code, data } = await cpeList({ positionStatus: 1 })
//   if (code === 200) {
//     this.options.CPE_LIST = data.map(item => {
//       return { label: item.username, value: item.userId }
//     })
//   }
// }
const checkChange = async (value, item) => {
  item.isShow = Number(value)
  const fieldInfo = formItems.value.map(item => {
    return { isShow: item.isShow, title: item.title }
  })
  Apis.saveFieldList({
    code: props.code,
    fieldInfo: JSON.stringify(fieldInfo)
  })
}
const onSearch = () => {
  emit('search')
}
const onReset = () => {
  formRef.value.resetFields()
  emit('search')
}
const getParams = () => {
  // dateRange  sumRange
  const formData = {}
  if (formItems.value.length) {
    formItems.value.forEach(item => {
      if (item.type === 'dateRange') {
        formData[`${item.key}Start`] = form[item.key][0] || null
        formData[`${item.key}End`] = form[item.key][1] || null
      } else if (item.type === 'sumRange') {
        const sumRangeValue = form[item.key]
        formData[`${item.key}Min`] = sumRangeValue[0] !== 0 && !sumRangeValue[0] ? null : sumRangeValue[0]
        formData[`${item.key}Max`] = sumRangeValue[1] !== 0 && !sumRangeValue[1] ? null : sumRangeValue[1]
      } else if (item.type === 'number') {
        formData[item.key] = form[item.key] ? Number(form[item.key]) : null
      } else {
        formData[item.key] = form[item.key]
      }
    })
  }
  return formData
}
onMounted(() => {
  fetchFieldList()
  // fetchCpeList()
})

defineExpose({
  getParams,
  onReset
})
</script>

<style lang="scss" scoped>
.search-form-wrapper {
  background-color: white;
  margin-bottom: 20px;
  :deep(.el-form--inline .el-form-item) {
    margin-bottom: 10px;
    margin-right: 10px;
  }
  :deep(.el-range-editor.el-input__wrapper) {
    width: 370px;
  }
  :deep(.el-input__wrapper) {
    width: 180px;
  }
  :deep(.el-select-v2__input-wrapper) {
    width: 136px !important;
  }
}
.btn-list {
  display: block;
}
.check-wrap {
  display: flex;
  flex-direction: column;
  .scroll {
    margin-top: 10px;
    :deep(.el-scrollbar__wrap) {
      max-height: 280px;
      overflow-x: hidden;
    }
  }
  .check-list {
    display: flex;
    flex-direction: column;
    :deep(.el-checkbox) {
      height: 24px;
    }
  }
}
</style>
