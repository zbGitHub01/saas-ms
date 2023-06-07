<script>
import { regionData } from 'element-china-area-data' //区域级联
import { computed, reactive, toRefs, ref, watch } from 'vue'
import { flatten, unflatten } from 'flat'
export default {
  props: {
    labelWidth: {
      type: String,
      default: () => {
        return '100px'
      }
    },
    fields: {
      type: Array,
      default: () => []
    },
    asyncFields: {
      type: Array,
      default: () => []
    },
    defaultValues: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formItemStyle: {
      type: String,
      default: () => {
        return null
      }
    }
  },
  emits: {
    // 验证函数
    submit: payload => {
      if (Object.prototype.toString.call(payload) === '[object Object]') {
        return true
      } else {
        console.warn(`submit failed, Invalid submit event payload!`)
        return false
      }
    },
    reset: null
  },
  setup(props) {
    const state = reactive({
      regionOptions: regionData,
      flatEntity: flatten(props.defaultValues), // 扁平
      defaultTime: [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)],
      searchValue: ''
      // searchList: []
    })
    let { fields, asyncFields } = toRefs(props)
    const formFields = computed(() => {
      const fieldsData = []
      let fieldsArr = fields.value.length > 0 ? fields.value : asyncFields.value
      fieldsArr.forEach(e => {
        if (e.type) {
          fieldsData.push(e)
        }
      })
      return fieldsData
    })

    const getEntity = () => {
      return unflatten(state.flatEntity)
    }
    /* const handleSubmit = () => {
      emit('submit', getEntity())
    } */
    const handleReset = () => {
      state.flatEntity = {}
      // emit('reset', {})
    }
    const searchList = ref([])
    const beforePopoverEnter = () => {
      searchList.value = formFields.value
    }

    watch(
      () => state.searchValue,
      (newValue, oldValue) => {
        searchList.value = newValue ? formFields.value.filter(item => item.name.includes(state.searchValue)) : formFields.value
        console.log('值变更', newValue, oldValue)
      },
      { deep: true },
      { immediate: true }
    )
    const checkChange = (value, index, currObj) => {
      let newObj = { ...currObj }
      newObj.isShow = Number(value)
      searchList.value.splice(index, 1, newObj)
      // emit('reset', {})
    }
    return {
      state,
      formFields,
      getEntity,
      checkChange,
      searchList,
      props,
      // handleSubmit,
      handleReset,
      beforePopoverEnter
    }
  }
}
</script>

<template>
  <el-form :inline="true" :model="defaultValues">
    <el-form-item
      v-for="item in formFields"
      :key="item.property"
      :label-width="item.labelWidth || labelWidth"
      :label="item.name"
      :prop="item.property"
      :style="formItemStyle"
    >
      <span v-if="item.type === 'label'">{{ state.flatEntity[item.property] }}</span>
      <el-input v-if="item.type === 'input'" v-model="state.flatEntity[item.property]" :placeholder="item.placeholder" />
      <el-select
        v-if="item.type === 'select'"
        v-model="state.flatEntity[item.property]"
        :multiple="item.multiple || false"
        :clearable="item.clearable || false"
        :filterable="item.filterable || false"
        :placeholder="item.placeholder"
      >
        <el-option v-for="opts in item.options" :key="opts.value" :label="opts.label" :value="opts.value" />
      </el-select>
      <!-- 需要地区级联选择再开启 -->
      <el-cascader
        v-if="item.type === 'area-select'"
        v-model="state.flatEntity[item.property]"
        size="large"
        :options="state.regionOptions"
        :placeholder="item.placeholder"
      />
      <el-date-picker
        v-if="item.type === 'date'"
        v-model="state.flatEntity[item.property]"
        type="date"
        value-format="x"
        :placeholder="item.placeholder"
      />
      <el-date-picker
        v-if="item.type === 'daterange'"
        v-model="state.flatEntity[item.property]"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="state.defaultTime"
        value-format="x"
      />
      <el-input
        v-if="item.type === 'textarea'"
        v-model="state.flatEntity[item.property]"
        type="textarea"
        :rows="item.rows"
        :placeholder="item.placeholder"
      />
      <el-input-number v-if="item.type === 'numeric'" v-model="state.flatEntity[item.property]" :min="item.min" :max="item.max" />
      <el-input
        v-if="item.type === 'input-secret'"
        v-model="state.flatEntity[item.property]"
        show-password
        :placeholder="item.placeholder"
      />
    </el-form-item>
    <el-form-item v-if="props.asyncFields.length > 0">
      <el-popover placement="bottom" width="250" trigger="click" @before-enter="beforePopoverEnter">
        <template #reference>
          <el-button icon="Operation" circle></el-button>
        </template>
        <div class="check-wrap">
          <el-input v-model="state.searchValue" placeholder="请输入搜索内容" prefix-icon="el-icon-search" />
          <el-scrollbar class="scroll">
            <div class="check-list">
              <el-checkbox
                v-for="(item, index) in searchList"
                :key="item.property"
                :label="item.name"
                :model-value="!!Number(item.isShow)"
                @change="checkChange($event, index, item)"
              ></el-checkbox>
            </div>
          </el-scrollbar>
        </div>
      </el-popover>
    </el-form-item>
    <!-- <el-form-item>
      <el-button type="primary" @click="handleSubmit">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </el-form-item> -->
  </el-form>
</template>

<style lang="scss" scoped>
:deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
  width: 210px;
}
:deep(.el-range-editor.el-input__wrapper) {
  width: 210px;
}
:deep(.el-input > .el-input__wrapper) {
  height: auto;
}
.el-form--inline .el-form-item {
  margin-right: 12px;
  vertical-align: top;
}
.check-wrap {
  display: flex;
  flex-direction: column;
  // .scroll {
  //   margin-top: 10px;
  //   :deep(.el-scrollbar__wrap) {
  //     max-height: 280px;
  //     padding-bottom: 20px;
  //     overflow-x: hidden;
  //   }
  // }
  .check-list {
    display: flex;
    flex-direction: column;
  }
}
</style>
